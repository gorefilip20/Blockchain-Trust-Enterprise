interface EntityData {
  legal_name: string;
  jurisdiction: string;
  tier_type: string;
  member_type: string;
  parent_entity_name?: string;
  ein?: string;
  registered_agent?: string;
  registered_agent_address?: string;
  tax_classification?: string;
  privacy_shield?: number;
}

interface ClientData {
  first_name: string;
  last_name: string;
  email: string;
}

export function generateSubscriptionAgreement(entity: EntityData, client: ClientData): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `# INVESTMENT SUBSCRIPTION AGREEMENT

**TO:** ${entity.legal_name}
**ATTN:** Managing Members
**RE:** Purchase of Multi-Member LLC Class A Membership Interests
**DATE:** ${date}

---

### 1. Subscription & Capital Contribution

The undersigned investor ("Subscriber") hereby applies to purchase Class A Membership Interests in **${entity.legal_name}**, a ${entity.jurisdiction} limited liability company (the "Company"), for a total capital contribution of $____________________ USD (the "Subscription Amount").

### 2. Adoption of Operating Agreement

By executing this Subscription Agreement, the Subscriber explicitly approves, adopts, and agrees to be legally bound by all terms, provisions, and specialized Web3 amendments contained within the **${entity.legal_name} Operating Agreement**. The Subscriber acknowledges that their rights as a member are governed strictly by that agreement.

### 3. Payment Mechanics

The Subscriber agrees to remit the Subscription Amount immediately upon acceptance of this agreement by the Company via:

- **Fiat Wire:** To the Company's designated corporate fiat bank account; OR
- **Digital Asset Deposit:** To the Company's verified corporate multi-signature vault address. If paid via digital assets (e.g., USDC, USDT, BTC, ETH), the value will be locked using the exact transaction hash (txhash), timestamp, and USD Fair Market Value (FMV) at the time of confirmed on-chain settlement, in accordance with Internal Revenue Code Section 721.

### 4. Specialized Web3 & Digital Asset Risk Disclosures

The Subscriber explicitly acknowledges, understands, and assumes the unique risks associated with investing in an entity managing digital wealth, including but not limited to:

- **Regulatory Volatility:** Digital asset regulations by federal, state, or international bodies (including the IRS and SEC) are subject to rapid shifts that may materially impact corporate operations.
- **On-Chain Governance:** Corporate actions may be executed via decentralized multi-signature smart contract protocols (e.g., Safe vaults). On-chain transactions satisfying the Operating Agreement's signature threshold constitute binding corporate actions.
- **Protocol Risks:** Smart contracts, blockchain networks, protocol hardforks, and airdrops carry inherent technical vulnerabilities. The Company is not liable for structural network failures or external exploits.
- **Custody Risks:** Digital assets are held in multi-signature wallets requiring multiple private key authorizations. Loss of private keys, hardware failures, or unauthorized access may result in permanent loss of assets.

### 5. Investor Representations & Warranties

The Subscriber represents and warrants to the Company that:

- **Accredited Investor Status:** Subscriber is an "Accredited Investor" as defined under Rule 501 of Regulation D of the US Securities Act of 1933.
- **Investment Intent:** Interests are being acquired solely for the Subscriber's own account for long-term investment purposes, not with a view toward resale or public distribution.
- **Independent Review:** Subscriber has conducted their own legal, tax, and technical due diligence regarding the two-tier structure and digital asset management sub-ledgers.
- **AML/KYC Compliance:** Subscriber's funds are derived from lawful sources and Subscriber is not a Specially Designated National (SDN) or subject to any OFAC sanctions.

---

### IN WITNESS WHEREOF, the parties have executed this Agreement.

**SUBSCRIBER SIGNATURE BLOCK:**

Subscriber Legal Name: ____________________________________________________

Signature of Authorized Signatory: __________________________________________

Title (if Entity Investor): ____________________________________________________

Date: ________________________

---

**COMPANY ACCEPTANCE BLOCK**
(To be completed solely by ${entity.legal_name})

The Company hereby accepts this subscription for Class A Membership Interests.

By: ____________________________________________________ (Managing Member)

Date: ________________________
`;
}

export function generateOperatingAgreement(entity: EntityData, client: ClientData): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isMultiMember = entity.member_type === 'multi_member';
  const isSingleMember = entity.member_type === 'single_member';

  return `# OPERATING AGREEMENT
## ${entity.legal_name}
### A ${entity.jurisdiction} Limited Liability Company

**Effective Date:** ${date}
**Type:** ${isMultiMember ? 'Multi-Member' : 'Single-Member'} LLC
${isSingleMember && entity.parent_entity_name ? `**Sole Member:** ${entity.parent_entity_name}` : ''}

---

## ARTICLE I: FORMATION AND NAME

**Section 1.1 Formation.** ${entity.legal_name} (the "Company") is a limited liability company organized under the laws of the State of ${entity.jurisdiction}.

**Section 1.2 Name.** The name of the Company is ${entity.legal_name}.

**Section 1.3 Registered Agent.** The registered agent of the Company is ${entity.registered_agent || '[Registered Agent Name]'}, located at ${entity.registered_agent_address || '[Registered Agent Address]'}.

**Section 1.4 Principal Office.** The principal office shall be as designated by the Managing Member(s) from time to time.

---

## ARTICLE II: PURPOSE AND POWERS

**Section 2.1 Purpose.** The Company is formed for the purpose of holding, managing, and operating digital assets, cryptocurrency investments, decentralized finance positions, and related blockchain-based financial instruments, along with any lawful business activity permitted under ${entity.jurisdiction} law.

**Section 2.2 Powers.** The Company shall have all powers available to a ${entity.jurisdiction} LLC, including but not limited to: acquiring, holding, and disposing of digital assets; executing smart contracts; participating in staking, mining, and DeFi protocols; and maintaining multi-signature wallets.

---

## ARTICLE III: CAPITAL CONTRIBUTIONS

**Section 3.1 Digital Asset Contributions.** All digital asset deposits (BTC, ETH, stablecoins, and other cryptocurrencies) must be documented with the following information recorded in the corporate ledger:

- Transaction hash (txhash) of the on-chain transfer
- Block timestamp of confirmed settlement
- USD Fair Market Value (FMV) at the time of deposit, per IRC Section 721
- Originating wallet address
- Receiving corporate wallet address

**Section 3.2 Valuation.** Fair Market Value for contributed digital assets shall be determined using the volume-weighted average price (VWAP) from at least two major exchanges (Coinbase, Kraken) at the block timestamp of the deposit transaction.

**Section 3.3 Capital Accounts.** A separate capital account shall be maintained for each member in accordance with Treasury Regulation Section 1.704-1(b)(2)(iv).

---

## ARTICLE IV: FIDUCIARY DUTIES AND KEY MANAGEMENT

**Section 4.1 Fiduciary Duty.** Each member and manager owes fiduciary duties to the Company and its members, including the duty of care and the duty of loyalty.

**Section 4.2 Private Key Fiduciary Duty.** Possession of, or access to, a private key, seed phrase, or hardware wallet controlling Company assets does NOT convey personal ownership of those assets. Such access is held in a fiduciary capacity. Unauthorized use, transfer, or disclosure of private keys constitutes unlawful conversion of corporate property and is grounds for immediate removal and legal action.

**Section 4.3 Key Management Protocol.** All private keys controlling Company assets must be:

- Stored on hardware security modules (HSMs) or hardware wallets
- Subject to the multi-signature threshold defined in Article V
- Documented in the Company's key management registry
- Never stored in plaintext on internet-connected devices

---

## ARTICLE V: ON-CHAIN GOVERNANCE

**Section 5.1 Multi-Signature Authority.** The Company shall maintain a multi-signature smart contract wallet (e.g., Safe/Gnosis Safe) as its primary treasury.

**Section 5.2 Signature Threshold.** On-chain transactions require a minimum of [M]-of-[N] authorized signers to execute, where M and N are defined in the Company's governance configuration.

**Section 5.3 Binding Corporate Actions.** On-chain transactions that pass the defined signature threshold constitute binding corporate actions equivalent to a signed board resolution. No additional paper signatures are required for transactions executed through the authorized multi-signature wallet.

**Section 5.4 Transaction Logging.** All on-chain transactions automatically write to the Company's digital corporate minute book and sub-ledger accounting system.

---

## ARTICLE VI: DERIVATIVE AND PROTOCOL ASSETS

**Section 6.1 Corporate Property.** All protocol-generated assets, including but not limited to:

- Hard fork tokens and chain-split derivatives
- Protocol airdrops received by Company-controlled addresses
- Staking rewards and validator income
- Liquidity pool fees and DeFi yield

are the exclusive property of the Company and shall be recorded as corporate revenue at Fair Market Value on the date of receipt.

**Section 6.2 Tax Treatment.** Staking rewards and mining income are treated as ordinary income at FMV upon receipt per IRS Notice 2014-21 and Revenue Ruling 2023-14.

---

## ARTICLE VII: DISTRIBUTIONS

**Section 7.1 Distribution Authority.** Distributions shall be made at the discretion of the Managing Member(s) and may be denominated in fiat currency or digital assets.

**Section 7.2 Tax Distributions.** The Company shall make tax distributions sufficient to cover each member's estimated tax liability arising from the Company's operations.

---

## ARTICLE VIII: TAX MATTERS

**Section 8.1 Tax Classification.** ${isMultiMember
    ? 'The Company shall be classified as a partnership for federal income tax purposes and shall file IRS Form 1065 annually.'
    : `The Company is a single-member LLC and shall be treated as a disregarded entity for federal income tax purposes. All income, deductions, and credits flow through to the sole member${entity.parent_entity_name ? ` (${entity.parent_entity_name})` : ''}.`}

**Section 8.2 Schedule K-1.** ${isMultiMember ? 'The Company shall prepare and deliver Schedule K-1 to each member within 75 days after the close of each fiscal year.' : 'Not applicable to single-member disregarded entities.'}

**Section 8.3 Form 8949.** Capital gains and losses from digital asset dispositions shall be reported on Form 8949 using the Company's elected inventory method (FIFO, LIFO, or HIFO).

---

## ARTICLE IX: EMERGENCY AND SUCCESSION

**Section 9.1 Incapacity Protocol.** In the event of a key holder's death, incapacitation, or unavailability, the Company shall maintain an emergency succession plan.

**Section 9.2 Dead-Man's Switch.** The Company may implement automated time-locked recovery mechanisms (dead-man's switch) to prevent permanent asset loss.

**Section 9.3 Key Shard Escrow.** Shamir's Secret Sharing or similar cryptographic key-splitting protocols may be used to distribute recovery shards to designated fiduciaries.

**Section 9.4 Succession Trigger.** Emergency key recovery shall be triggered upon:

- Ninety (90) consecutive days of signer inactivity
- Written declaration of incapacity by a medical professional
- Death certificate presented by an authorized estate representative

---

## SIGNATURES

${isMultiMember ? `**Member 1:**

Name: ${client.first_name} ${client.last_name}
Signature: ____________________________________________________
Date: ________________________

**Member 2:**

Name: ____________________________________________________
Signature: ____________________________________________________
Date: ________________________` : `**Sole Member:** ${entity.parent_entity_name || `${client.first_name} ${client.last_name}`}

By: ____________________________________________________
Title: Managing Member
Date: ________________________`}
`;
}

export function generateArticlesOfOrganization(entity: EntityData, client: ClientData): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `# ARTICLES OF ORGANIZATION
## ${entity.legal_name}
### State of ${entity.jurisdiction}

**Filing Date:** ${date}

---

### ARTICLE I: NAME
The name of the limited liability company is **${entity.legal_name}**.

### ARTICLE II: REGISTERED AGENT
The registered agent for the Company in the State of ${entity.jurisdiction} is:

**Name:** ${entity.registered_agent || '[Registered Agent Name]'}
**Address:** ${entity.registered_agent_address || '[Registered Agent Address]'}

### ARTICLE III: PURPOSE
The Company is organized for the purpose of engaging in any lawful business activity permitted under the laws of the State of ${entity.jurisdiction}, including but not limited to the acquisition, management, and disposition of digital assets, cryptocurrency investments, and blockchain-based financial instruments.

### ARTICLE IV: MANAGEMENT
The Company shall be managed by its ${entity.member_type === 'multi_member' ? 'Members (Member-Managed)' : 'sole Member'}.

### ARTICLE V: DURATION
The Company shall have perpetual existence unless dissolved in accordance with its Operating Agreement or ${entity.jurisdiction} law.

### ARTICLE VI: ORGANIZER
The organizer of this limited liability company is:

**Name:** ${client.first_name} ${client.last_name}
**Address:** ____________________________________________________

---

**ORGANIZER SIGNATURE:**

Signature: ____________________________________________________
Date: ${date}
`;
}

export function generateCorporateTree(
  parentEntity: EntityData,
  subsidiaryEntity: EntityData,
  client: ClientData
): string {
  return `# CORPORATE STRUCTURE CERTIFICATION
## Two-Tier Parent-Subsidiary Entity Architecture

---

### CORPORATE TREE DIAGRAM

\`\`\`
${client.first_name} ${client.last_name} (Founder / Managing Member)
    |
    |  100% Membership Interest
    v
+-------------------------------------------------------+
|  ${parentEntity.legal_name.padEnd(50)}  |
|  ${parentEntity.jurisdiction} ${parentEntity.member_type === 'multi_member' ? 'Multi-Member' : 'Single-Member'} LLC${' '.repeat(Math.max(0, 34 - parentEntity.jurisdiction.length))}|
|  Tax Classification: ${(parentEntity.tax_classification || 'Partnership (Form 1065)').padEnd(29)}|
|  Role: Public-Facing Fundraising Hub                  |
|  EIN: ${(parentEntity.ein || 'Pending').padEnd(45)}|
+-------------------------------------------------------+
    |
    |  100% Legal Owner & Manager
    v
+-------------------------------------------------------+
|  ${subsidiaryEntity.legal_name.padEnd(50)}  |
|  ${subsidiaryEntity.jurisdiction} Single-Member LLC${' '.repeat(Math.max(0, 32 - subsidiaryEntity.jurisdiction.length))}|
|  Tax Classification: Disregarded Entity                |
|  Role: Anonymous Asset & Vault Layer                   |
|  Privacy Shield: ${subsidiaryEntity.privacy_shield ? 'ACTIVE' : 'INACTIVE'}${' '.repeat(33)}|
|  EIN: ${(subsidiaryEntity.ein || 'Pending').padEnd(45)}|
+-------------------------------------------------------+
    |
    |  Controls
    v
+-------------------------------------------------------+
|  Multi-Sig Treasury Wallet (Safe/Gnosis)               |
|  Exchange Accounts (KYB under subsidiary name)         |
|  Cold Storage Custody                                  |
+-------------------------------------------------------+
\`\`\`

---

### STRUCTURAL RATIONALE

**Delaware Parent (${parentEntity.legal_name}):**
- Receives outside VC capital and investor subscriptions
- Issues Class A Membership Interests to investors
- Files annual IRS Form 1065 (Partnership Informational Return)
- Issues Schedule K-1 to each member/investor
- Maintains strong Chancery Court legal protections

**Wyoming Subsidiary (${subsidiaryEntity.legal_name}):**
- Holds all crypto assets, multi-sig wallets, and exchange accounts
- Privacy shield drops founder identities from public records
- Single-member disregarded entity status bypasses state tax
- All gains, yields, and losses flow through to Delaware parent
- Registered agent address replaces personal addresses in state filings

### TAX FLOW-THROUGH ARCHITECTURE

\`\`\`
On-Chain Activity (${subsidiaryEntity.legal_name})
    |
    | Disregarded entity pass-through
    v
${parentEntity.legal_name}
    |
    | Form 1065 + Schedule K-1
    v
Individual Members / Investors
\`\`\`

---

**Certified By:** ${client.first_name} ${client.last_name}
**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
`;
}
