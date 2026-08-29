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

    -- Demo brokerage users and copy-trading operations
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'pending', 'suspended')),
      created_at TEXT DEFAULT (datetime('now')),
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS copy_strategies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      manager TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      return_30d TEXT NOT NULL,
      max_drawdown TEXT NOT NULL,
      followers INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft', 'published', 'paused', 'archived')),
      description TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_messages (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'archived')),
      assigned_to TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
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

    INSERT OR IGNORE INTO copy_strategies (id, name, manager, risk_level, return_30d, max_drawdown, followers, status, description)
    VALUES
      ('strategy-atlas', 'Atlas Balanced', 'BTE Research Desk', 'Moderate', '+18.4%', '-8.2%', 2184, 'published', 'Diversified global allocation with measured risk.'),
      ('strategy-northstar', 'Northstar Growth', 'Maya Chen', 'Growth', '+31.7%', '-16.9%', 1472, 'published', 'Concentrated growth strategy with active risk review.'),
      ('strategy-signal', 'Signal & Carry', 'BTE Systematic', 'Conservative', '+12.1%', '-4.6%', 894, 'published', 'Systematic carry and quality-factor allocation.');

    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      type TEXT NOT NULL CHECK(type IN ('price_alert','order_fill','document_ready','payment_confirmed','system')),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Paper trading simulator tables
    CREATE TABLE IF NOT EXISTS paper_trades (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      symbol TEXT NOT NULL,
      side TEXT NOT NULL CHECK(side IN ('buy','sell')),
      order_type TEXT NOT NULL DEFAULT 'market' CHECK(order_type IN ('market','limit','stop')),
      quantity REAL NOT NULL,
      price REAL NOT NULL,
      total_value REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'filled' CHECK(status IN ('pending','filled','cancelled','rejected')),
      filled_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS paper_portfolios (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      cash_balance REAL NOT NULL DEFAULT 100000.00,
      total_value REAL NOT NULL DEFAULT 100000.00,
      total_pnl REAL NOT NULL DEFAULT 0,
      total_pnl_percent REAL NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS paper_positions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      quantity REAL NOT NULL,
      avg_cost REAL NOT NULL,
      current_price REAL NOT NULL,
      market_value REAL NOT NULL,
      unrealized_pnl REAL NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, symbol)
    );

    -- Seed default admin user (password: admin123456, bcrypt hash)
    INSERT OR IGNORE INTO platform_administrators (id, username, password_hash, role)
    VALUES ('admin-default', 'platform_supervisor', '$2b$10$.CICvqJziE2bjoJlNVMfKuX5PY.uJqtS8T7zJJBVnWlgimoQGdITe', 'supervisor');

    -- Seed demo paper trading data
    INSERT OR IGNORE INTO paper_portfolios (id, user_id, cash_balance, total_value, total_pnl, total_pnl_percent)
    VALUES ('pp-demo', 'demo-user', 75420.00, 142680.00, 42680.00, 42.68);

    INSERT OR IGNORE INTO paper_positions (id, user_id, symbol, quantity, avg_cost, current_price, market_value, unrealized_pnl)
    VALUES
      ('pos-btc-demo', 'demo-user', 'BTC', 0.5, 95000.00, 108492.00, 54246.00, 6746.00),
      ('pos-eth-demo', 'demo-user', 'ETH', 4.2, 3200.00, 3942.18, 16557.16, 3117.16),
      ('pos-nvda-demo', 'demo-user', 'NVDA', 25, 155.00, 182.06, 4551.50, 676.50);

    INSERT OR IGNORE INTO paper_trades (id, user_id, symbol, side, order_type, quantity, price, total_value, status)
    VALUES
      ('pt-1', 'demo-user', 'BTC', 'buy', 'market', 0.5, 95000.00, 47500.00, 'filled'),
      ('pt-2', 'demo-user', 'ETH', 'buy', 'market', 4.2, 3200.00, 13440.00, 'filled'),
      ('pt-3', 'demo-user', 'NVDA', 'buy', 'limit', 25, 155.00, 3875.00, 'filled'),
      ('pt-4', 'demo-user', 'BTC', 'sell', 'market', 0.1, 102340.00, 10234.00, 'filled'),
      ('pt-5', 'demo-user', 'ETH', 'buy', 'market', 1.2, 3450.00, 4140.00, 'filled');

    -- Seed demo notifications (tied to any user that registers)
    INSERT OR IGNORE INTO notifications (id, user_id, type, title, message, is_read, created_at)
    VALUES
      ('notif-demo-1', 'demo-user', 'system', 'Welcome to BTE', 'Your demo workspace is ready. Explore portfolio analytics, copy trading, and more.', 0, datetime('now', '-1 hour')),
      ('notif-demo-2', 'demo-user', 'price_alert', 'BTC above $108,000', 'Bitcoin has crossed your $108,000 alert threshold. Current price: $108,492.00.', 0, datetime('now', '-2 hours')),
      ('notif-demo-3', 'demo-user', 'order_fill', 'Buy order filled', 'Your market buy order for 0.10 BTC has been filled at $108,492.00.', 0, datetime('now', '-3 hours')),
      ('notif-demo-4', 'demo-user', 'document_ready', 'Operating Agreement ready', 'Your Operating Agreement document has been generated and is available for download.', 1, datetime('now', '-1 day')),
      ('notif-demo-5', 'demo-user', 'payment_confirmed', 'Payment confirmed', 'Your $499.00 formation package payment via BEP20 has been confirmed on-chain.', 1, datetime('now', '-2 days')),
      ('notif-demo-6', 'demo-user', 'system', 'Security review complete', 'Your account security review has been completed. No issues found.', 1, datetime('now', '-3 days'));
  `);
}

export { getDb, uuidv4 };
