import { getDb } from './db';
import { ethers } from 'ethers';
import bs58 from 'bs58';
import crypto from 'crypto';

const ERC20_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

const RPC_ENDPOINTS: Record<string, string> = {
  BEP20: 'https://bsc-dataseed1.binance.org',
  ERC20: 'https://eth.llamarpc.com',
};

const TRON_API = 'https://api.trongrid.io';

interface VerificationResult {
  isLegitimate: boolean;
  blockNumber?: number;
  amount?: number;
  sender?: string;
}

interface PaymentRow {
  id: string;
  client_id: string;
  target_network: string;
  submitted_tx_hash: string;
  assigned_destination_wallet: string;
  expected_amount_usd: number;
  rpc_retry_attempts: number;
}

export async function processPendingPayments(): Promise<{
  processed: number;
  verified: number;
  failed: number;
  errors: string[];
}> {
  const db = getDb();
  const results = { processed: 0, verified: 0, failed: 0, errors: [] as string[] };

  const pending = db.prepare(
    "SELECT * FROM payments WHERE status = 'processing_verification' AND rpc_retry_attempts < 5"
  ).all() as PaymentRow[];

  for (const tx of pending) {
    results.processed++;
    try {
      let result: VerificationResult | null = null;

      if (tx.target_network === 'BEP20' || tx.target_network === 'ERC20') {
        result = await verifyEVMTransaction(
          tx.submitted_tx_hash,
          tx.assigned_destination_wallet,
          tx.expected_amount_usd,
          tx.target_network
        );
      } else if (tx.target_network === 'TRC20') {
        result = await verifyTRC20Transaction(
          tx.submitted_tx_hash,
          tx.assigned_destination_wallet,
          tx.expected_amount_usd
        );
      }

      if (result && result.isLegitimate) {
        db.prepare(
          `UPDATE payments SET
            status = 'confirmed_active',
            transaction_block_number = ?,
            verified_amount_tokens = ?,
            sender_wallet_address = ?,
            processing_stage = 'fully_reconciled',
            verified_at = datetime('now')
          WHERE id = ?`
        ).run(result.blockNumber, result.amount, result.sender, tx.id);

        db.prepare(
          "UPDATE workflows SET status = 'completed', completed_at = datetime('now') WHERE client_id = ? AND status != 'completed'"
        ).run(tx.client_id);

        db.prepare(
          "UPDATE clients SET status = 'active' WHERE id = ? AND status != 'active'"
        ).run(tx.client_id);

        results.verified++;
      } else {
        db.prepare(
          "UPDATE payments SET rpc_retry_attempts = rpc_retry_attempts + 1, processing_stage = 'mismatched_parameters' WHERE id = ?"
        ).run(tx.id);

        const row = db.prepare('SELECT rpc_retry_attempts FROM payments WHERE id = ?').get(tx.id) as { rpc_retry_attempts: number } | undefined;
        if (row && row.rpc_retry_attempts >= 5) {
          db.prepare("UPDATE payments SET status = 'failed' WHERE id = ?").run(tx.id);
          results.failed++;
        }
      }
    } catch (error) {
      db.prepare(
        "UPDATE payments SET rpc_retry_attempts = rpc_retry_attempts + 1, processing_stage = 'fetching_rpc' WHERE id = ?"
      ).run(tx.id);
      results.errors.push(`Payment ${tx.id}: ${(error as Error).message}`);
    }
  }

  return results;
}

async function verifyEVMTransaction(
  txHash: string,
  targetWallet: string,
  expectedAmount: number,
  network: string
): Promise<VerificationResult> {
  const rpcUrl = RPC_ENDPOINTS[network];
  if (!rpcUrl) return { isLegitimate: false };

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionReceipt',
      params: [txHash],
    }),
  });

  const data = await response.json();
  const receipt = data.result;
  if (!receipt || receipt.status !== '0x1') return { isLegitimate: false };

  for (const log of receipt.logs) {
    if (log.topics[0] === ERC20_TRANSFER_TOPIC && log.topics.length >= 3) {
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const recipient = abiCoder.decode(['address'], log.topics[2])[0] as string;

      if (recipient.toLowerCase() === targetWallet.toLowerCase()) {
        const rawAmount = BigInt(log.data);
        const parsedAmount = parseFloat(ethers.formatUnits(rawAmount, 18));

        if (parsedAmount >= expectedAmount * 0.99) {
          const sender = abiCoder.decode(['address'], log.topics[1])[0] as string;
          return {
            isLegitimate: true,
            blockNumber: parseInt(receipt.blockNumber, 16),
            amount: parsedAmount,
            sender,
          };
        }
      }
    }
  }
  return { isLegitimate: false };
}

async function verifyTRC20Transaction(
  txHash: string,
  targetWallet: string,
  expectedAmount: number
): Promise<VerificationResult> {
  const response = await fetch(`${TRON_API}/wallet/gettransactionbyid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: txHash }),
  });

  const txData = await response.json();

  if (!txData || !txData.ret || txData.ret[0]?.contractRet !== 'SUCCESS') {
    return { isLegitimate: false };
  }

  const contractParam = txData.raw_data?.contract?.[0]?.parameter?.value;
  if (!contractParam?.data || !contractParam.data.startsWith('a9059cbb')) {
    return { isLegitimate: false };
  }

  const cleanData = contractParam.data.substring(8);
  const rawRecipient = '41' + cleanData.substring(24, 64);
  const hexAmount = cleanData.substring(64, 128);

  const targetWalletBase58 = convertHexToBase58(rawRecipient);

  if (targetWalletBase58.toLowerCase() === targetWallet.toLowerCase()) {
    const parsedAmount = parseInt(hexAmount, 16) / 1_000_000;

    if (parsedAmount >= expectedAmount * 0.99) {
      return {
        isLegitimate: true,
        blockNumber: txData.blockNumber || 0,
        amount: parsedAmount,
        sender: convertHexToBase58(contractParam.owner_address),
      };
    }
  }
  return { isLegitimate: false };
}

function convertHexToBase58(hexStr: string): string {
  const buffer = Buffer.from(hexStr, 'hex');
  const hash1 = crypto.createHash('sha256').update(buffer).digest();
  const hash2 = crypto.createHash('sha256').update(hash1).digest();
  const checksum = hash2.slice(0, 4);
  return bs58.encode(Buffer.concat([buffer, checksum]));
}
