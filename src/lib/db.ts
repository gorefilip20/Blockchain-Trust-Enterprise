import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data', 'platform.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    -- Clients table
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      client_type TEXT NOT NULL CHECK(client_type IN ('hnw_investor', 'web3_founder', 'dao_member', 'crypto_miner', 'staking_operator')),
      status TEXT NOT NULL DEFAULT 'lead' CHECK(status IN ('lead', 'onboarding', 'active', 'inactive')),
      entity_type TEXT CHECK(entity_type IN ('holding_llc', 'operating_llc', 'dao_llc')),
      jurisdiction TEXT DEFAULT 'Wyoming',
      annual_revenue_usd REAL,
      crypto_holdings_usd REAL,
      notes TEXT,
      is_registration_fee_paid INTEGER DEFAULT 0,
      payment_tx_hash TEXT,
      selected_network TEXT CHECK(selected_network IN ('BEP20', 'TRC20', 'ERC20')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Corporate entities with two-tier parent-subsidiary support
    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      entity_name TEXT NOT NULL,
      entity_type TEXT NOT NULL CHECK(entity_type IN ('holding_llc', 'operating_llc', 'dao_llc')),
      jurisdiction TEXT NOT NULL DEFAULT 'Wyoming',
      tier_type TEXT NOT NULL DEFAULT 'parent' CHECK(tier_type IN ('parent', 'subsidiary')),
      parent_entity_id TEXT REFERENCES entities(id) ON DELETE SET NULL,
      ein TEXT,
      state_filing_number TEXT,
      registered_agent TEXT,
      registered_agent_address TEXT,
      operating_agreement_signed INTEGER DEFAULT 0,
      privacy_shield INTEGER DEFAULT 1,
      member_type TEXT CHECK(member_type IN ('single_member', 'multi_member')),
      tax_classification TEXT CHECK(tax_classification IN ('partnership_1065', 'disregarded_entity', 'c_corp_1120', 's_corp_1120s')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'filed', 'approved', 'active', 'dissolved')),
      formed_at TEXT,
      annual_report_due TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Workflow steps tracking (6-stage)
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      step_number INTEGER NOT NULL,
      step_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'blocked')),
      started_at TEXT,
      completed_at TEXT,
      notes TEXT,
      assigned_to TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Partners
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      partner_type TEXT NOT NULL CHECK(partner_type IN ('attorney', 'cpa', 'registered_agent', 'exchange', 'accounting_software', 'custodian')),
      description TEXT,
      website TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      jurisdictions TEXT DEFAULT '[]',
      specialties TEXT DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'preferred')),
      integration_type TEXT CHECK(integration_type IN ('api', 'manual', 'referral')),
      api_endpoint TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Partner assignments
    CREATE TABLE IF NOT EXISTS partner_assignments (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL REFERENCES partners(id),
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      entity_id TEXT REFERENCES entities(id),
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'terminated')),
      assigned_at TEXT DEFAULT (datetime('now'))
    );

    -- Treasury accounts
    CREATE TABLE IF NOT EXISTS treasury_accounts (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
      account_type TEXT NOT NULL CHECK(account_type IN ('fiat_bank', 'exchange_account', 'multisig_wallet', 'cold_storage')),
      provider TEXT NOT NULL,
      account_name TEXT,
      address TEXT,
      network TEXT,
      signature_threshold TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'setup', 'active', 'frozen', 'closed')),
      balance_usd REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Legal documents with download/upload tracking
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      entity_id TEXT REFERENCES entities(id),
      doc_type TEXT NOT NULL CHECK(doc_type IN (
        'articles_of_organization', 'operating_agreement', 'ein_letter',
        'tax_return', 'annual_report', 'resolution', 'trust_deed',
        'subscription_agreement', 'corporate_tree', 'board_resolution', 'other'
      )),
      name TEXT NOT NULL,
      file_path TEXT,
      raw_markdown_content TEXT,
      download_url_token TEXT UNIQUE,
      uploaded_signed_file_url TEXT,
      status TEXT DEFAULT 'generated' CHECK(status IN ('generated', 'draft', 'downloaded', 'pending_review', 'submitted', 'signed', 'verified', 'filed', 'archived')),
      downloaded_at TEXT,
      submitted_at TEXT,
      reviewed_by TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Web3 vaults (multi-sig custody)
    CREATE TABLE IF NOT EXISTS web3_vaults (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
      vault_address TEXT NOT NULL,
      network TEXT NOT NULL DEFAULT 'ethereum',
      network_id INTEGER NOT NULL DEFAULT 1,
      required_signatures INTEGER NOT NULL DEFAULT 2,
      total_signers INTEGER NOT NULL DEFAULT 3,
      subledger_api_connected INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'deployed', 'active', 'paused', 'decommissioned')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Crypto payment verification tracking
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      target_network TEXT NOT NULL CHECK(target_network IN ('BEP20', 'TRC20', 'ERC20')),
      submitted_tx_hash TEXT,
      assigned_destination_wallet TEXT NOT NULL,
      expected_amount_usd REAL NOT NULL,
      verified_amount_tokens REAL,
      sender_wallet_address TEXT,
      transaction_block_number INTEGER,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing_verification', 'confirmed_active', 'failed', 'expired')),
      processing_stage TEXT NOT NULL DEFAULT 'unprocessed' CHECK(processing_stage IN ('unprocessed', 'fetching_rpc', 'mismatched_parameters', 'fully_reconciled')),
      rpc_retry_attempts INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      verified_at TEXT
    );

    -- Billing rules (configurable pricing)
    CREATE TABLE IF NOT EXISTS billing_rules (
      id TEXT PRIMARY KEY,
      package_name TEXT UNIQUE DEFAULT 'Dual-Entity Formation Package',
      price_usd REAL NOT NULL DEFAULT 499.00,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Administrative wallet gateway configuration
    CREATE TABLE IF NOT EXISTS administrative_wallets (
      id TEXT PRIMARY KEY,
      blockchain_network TEXT NOT NULL UNIQUE CHECK(blockchain_network IN ('BEP20', 'TRC20', 'ERC20')),
      receiving_address TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Admin-managed frontend configuration and feature flags
    CREATE TABLE IF NOT EXISTS platform_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      value_type TEXT NOT NULL DEFAULT 'text' CHECK(value_type IN ('text', 'boolean', 'number', 'json')),
      label TEXT NOT NULL,
      description TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      updated_by TEXT
    );

    -- Platform administrators (bcrypt hashed credentials)
    CREATE TABLE IF NOT EXISTS platform_administrators (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'supervisor',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Accounting entries
    CREATE TABLE IF NOT EXISTS accounting_entries (
      id TEXT PRIMARY KEY,
      entity_id TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
      entry_type TEXT NOT NULL CHECK(entry_type IN ('income', 'expense', 'transfer', 'mining_reward', 'staking_reward', 'capital_gain', 'capital_loss')),
      amount_usd REAL NOT NULL,
      amount_crypto REAL,
      crypto_symbol TEXT,
      transaction_hash TEXT,
      wallet_address TEXT,
      exchange_id TEXT,
      category TEXT,
      tax_year INTEGER,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Seed partners
    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-wyoming-cs', 'Wyoming Corporate Services', 'registered_agent',
      'Premier Wyoming registered agent specializing in crypto LLCs with privacy-forward filings',
      '["Wyoming LLC", "Privacy Filings", "DAO LLC", "Annual Compliance"]', 'preferred'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-wyoming-cs');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-ct-corp', 'CT Corporation (Wolters Kluwer)', 'registered_agent',
      'National registered agent and corporate compliance services',
      '["Multi-State", "Corporate Compliance", "Annual Reports"]', 'active'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-ct-corp');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-nw-agent', 'Northwest Registered Agent', 'registered_agent',
      'Privacy-focused registered agent with free year of service for new formations',
      '["Privacy Filing", "Delaware LLC", "Wyoming LLC", "Free First Year"]', 'active'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-nw-agent');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-kraken', 'Kraken Institutional', 'exchange',
      'Institutional crypto exchange with full KYB corporate onboarding',
      '["KYB Onboarding", "Institutional Custody", "Fiat Gateway", "Staking"]', 'preferred'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-kraken');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-coinbase', 'Coinbase Prime', 'exchange',
      'Institutional-grade crypto trading and custody platform',
      '["KYB Onboarding", "Cold Storage", "Fiat Gateway", "Reporting"]', 'active'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-coinbase');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-recap', 'Recap.io', 'accounting_software',
      'Crypto-native accounting and tax software with real-time cost basis tracking',
      '["Cost Basis Tracking", "Tax Reports", "API Integration", "Audit Trail"]', 'preferred'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-recap');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-cointracker', 'CoinTracker', 'accounting_software',
      'Comprehensive crypto portfolio tracking and tax reporting',
      '["Portfolio Tracking", "Tax Filing", "Exchange Integration"]', 'active'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-cointracker');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-safe', 'Safe (Gnosis) Multi-Sig', 'custodian',
      'Industry-leading multi-signature wallet infrastructure for DAOs and treasuries',
      '["Multi-Sig Wallets", "Governance", "Treasury Management", "Recovery"]', 'preferred'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-safe');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-coinpass', 'Coinpass', 'exchange',
      'UK-focused institutional crypto exchange with corporate accounts',
      '["UK Corporate", "GBP Pairs", "KYB", "Institutional"]', 'active'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-coinpass');

    INSERT OR IGNORE INTO partners (id, name, partner_type, description, specialties, status)
    SELECT 'partner-fireblocks', 'Fireblocks', 'custodian',
      'Enterprise-grade digital asset custody and settlement platform',
      '["MPC Custody", "Institutional", "DeFi Gateway", "Treasury Management"]', 'active'
    WHERE NOT EXISTS (SELECT 1 FROM partners WHERE id = 'partner-fireblocks');

    -- Seed baseline $499 registration pricing
    INSERT OR IGNORE INTO billing_rules (id, package_name, price_usd)
    VALUES ('billing-default', 'Dual-Entity Formation Package', 499.00);

    INSERT OR IGNORE INTO platform_config (key, value, value_type, label, description)
    VALUES
      ('hero_headline', 'Institutional clarity. Human control.', 'text', 'Hero headline', 'Primary headline shown on the BTE markets workspace'),
      ('hero_subtitle', 'A transparent command center for global markets, intelligent risk, and responsible execution.', 'text', 'Hero subtitle', 'Supporting copy shown beneath the main headline'),
      ('workspace_mode', 'demo', 'text', 'Workspace mode', 'Use demo until authorized live providers are connected'),
      ('show_bte_copilot', 'true', 'boolean', 'BTE Copilot', 'Show the AI-assisted research surface'),
      ('show_recurring_investments', 'true', 'boolean', 'Recurring investments', 'Show recurring investment controls'),
      ('show_market_alerts', 'true', 'boolean', 'Market alerts', 'Show alert and notification entry points'),
      ('trust_message', 'Protected by BTE TrustLayer · Demo data mode', 'text', 'Trust message', 'Footer trust and environment message'),
      ('max_order_notional_demo', '100000', 'number', 'Demo notional limit', 'Maximum simulated order notional for demo mode');

    -- Seed default admin user (password: admin123456, bcrypt hash)
    INSERT OR IGNORE INTO platform_administrators (id, username, password_hash, role)
    VALUES ('admin-default', 'platform_supervisor', '$2b$10$.CICvqJziE2bjoJlNVMfKuX5PY.uJqtS8T7zJJBVnWlgimoQGdITe', 'supervisor');
  `);
}

export { getDb, uuidv4 };
