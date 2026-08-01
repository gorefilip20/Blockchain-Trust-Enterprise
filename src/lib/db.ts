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
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Entities (LLCs) table
    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      entity_name TEXT NOT NULL,
      entity_type TEXT NOT NULL CHECK(entity_type IN ('holding_llc', 'operating_llc', 'dao_llc')),
      jurisdiction TEXT NOT NULL DEFAULT 'Wyoming',
      ein TEXT,
      state_filing_number TEXT,
      registered_agent TEXT,
      operating_agreement_signed INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'filed', 'approved', 'active', 'dissolved')),
      formed_at TEXT,
      annual_report_due TEXT,
      privacy_shield INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Workflow steps tracking
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

    -- Partners (Attorneys, Registered Agents, Exchanges, Accounting Tools)
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

    -- Partner assignments to clients
    CREATE TABLE IF NOT EXISTS partner_assignments (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL REFERENCES partners(id),
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      entity_id TEXT REFERENCES entities(id),
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'terminated')),
      assigned_at TEXT DEFAULT (datetime('now'))
    );

    -- Treasury accounts (bank + crypto wallets)
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

    -- Documents
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      entity_id TEXT REFERENCES entities(id),
      doc_type TEXT NOT NULL CHECK(doc_type IN ('articles_of_organization', 'operating_agreement', 'ein_letter', 'tax_return', 'annual_report', 'resolution', 'trust_deed', 'other')),
      name TEXT NOT NULL,
      file_path TEXT,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending_review', 'signed', 'filed', 'archived')),
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

    -- Insert seed data if empty
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
  `);
}

export { getDb, uuidv4 };
