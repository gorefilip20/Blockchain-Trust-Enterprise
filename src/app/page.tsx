'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  ICON COMPONENTS (inline SVGs)                                     */
/* ------------------------------------------------------------------ */

function ShieldIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function DocumentIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function GlobeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
  );
}

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function BuildingIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9h1" />
      <path d="M9 13h1" />
      <path d="M9 17h1" />
    </svg>
  );
}

function WalletIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
  );
}

function ChartIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function SearchIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function KeyIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function LinkIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function MenuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  LANDING PAGE                                                      */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Partners', href: '#partners' },
    { label: 'LLC Guide', href: '#llc-guide' },
    { label: 'Contact', href: '#contact' },
  ];

  const stats = [
    { value: '500+', label: 'Entities Formed' },
    { value: '$2.8B+', label: 'Assets Protected' },
    { value: '99.9%', label: 'Compliance Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const features = [
    {
      icon: <ShieldIcon className="w-7 h-7" />,
      title: 'Privacy-First Architecture',
      description: 'Anonymous LLC formation with nominee services. Your personal identity stays off public records.',
    },
    {
      icon: <DocumentIcon className="w-7 h-7" />,
      title: 'Regulatory Compliance',
      description: 'Full SOC 2 Type II audit trail, AML/KYC integration, and real-time regulatory monitoring.',
    },
    {
      icon: <KeyIcon className="w-7 h-7" />,
      title: 'Multi-Sig Governance',
      description: 'Enterprise-grade multi-signature wallet infrastructure with configurable approval thresholds.',
    },
    {
      icon: <GlobeIcon className="w-7 h-7" />,
      title: 'Global Jurisdiction Support',
      description: 'Entity formation across Wyoming, Delaware, Nevada, and international jurisdictions.',
    },
  ];

  const services = [
    {
      icon: <BuildingIcon className="w-8 h-8" />,
      title: 'Entity Formation & Registration',
      description: 'End-to-end LLC formation with privacy shielding, tailored to digital asset operations.',
      items: [
        'Articles of Organization filing',
        'EIN procurement & registration',
        'Privacy-shielded registered agent',
        'Custom Operating Agreement',
        'Corporate resolution templates',
      ],
      accent: 'from-[#00D4AA] to-[#00B894]',
    },
    {
      icon: <WalletIcon className="w-8 h-8" />,
      title: 'Treasury & Governance Setup',
      description: 'Institutional-grade financial infrastructure for your digital asset entity.',
      items: [
        'Multi-signature wallet deployment',
        'Corporate bank account setup',
        'Exchange integration (KYB)',
        'Governance framework design',
        'Emergency key recovery protocols',
      ],
      accent: 'from-[#0052FF] to-[#3B82F6]',
    },
    {
      icon: <ChartIcon className="w-8 h-8" />,
      title: 'Compliance & Accounting',
      description: 'Automated tax tracking and audit-ready reporting for complete peace of mind.',
      items: [
        'Real-time cost basis tracking',
        'Capital gains/loss reporting',
        'Annual compliance filings',
        'Audit trail documentation',
        'Sub-ledger synchronization',
      ],
      accent: 'from-[#7C3AED] to-[#A78BFA]',
    },
  ];

  const jurisdictions = [
    {
      state: 'Wyoming',
      privacy: 'Excellent',
      fees: '$100',
      annualReport: '$60',
      daoSupport: 'Yes',
      taxBenefits: 'No state income tax',
      highlight: true,
    },
    {
      state: 'Delaware',
      privacy: 'Good',
      fees: '$90',
      annualReport: '$300',
      daoSupport: 'Limited',
      taxBenefits: 'No sales tax',
      highlight: false,
    },
    {
      state: 'Nevada',
      privacy: 'Good',
      fees: '$425',
      annualReport: '$150',
      daoSupport: 'No',
      taxBenefits: 'No state income tax',
      highlight: false,
    },
  ];

  const steps = [
    {
      num: '01',
      icon: <SearchIcon className="w-7 h-7" />,
      title: 'Discovery & Scoping',
      description: 'We assess your portfolio, operations, and goals to determine the optimal entity structure — Holding LLC, Operating LLC, or DAO LLC.',
    },
    {
      num: '02',
      icon: <BuildingIcon className="w-7 h-7" />,
      title: 'Entity Formation',
      description: 'File Articles of Organization with privacy-shielded registered agents. Secure your EIN and adopt a customized Operating Agreement.',
    },
    {
      num: '03',
      icon: <WalletIcon className="w-7 h-7" />,
      title: 'Financial Infrastructure',
      description: 'Set up corporate bank accounts and institutional exchange accounts under the entity name — never your personal SSN.',
    },
    {
      num: '04',
      icon: <KeyIcon className="w-7 h-7" />,
      title: 'Treasury & Governance',
      description: 'Deploy multi-signature wallets with security thresholds (e.g., 2-of-3 signatures) and emergency key recovery for estate continuity.',
    },
    {
      num: '05',
      icon: <LinkIcon className="w-7 h-7" />,
      title: 'Accounting Integration',
      description: 'Connect wallet addresses and exchange APIs to tax tracking software for real-time cost-basis records and streamlined year-end returns.',
    },
  ];

  const partnerCategories = [
    {
      title: 'Registered Agents',
      description: 'Privacy-forward filings, Wyoming LLCs, DAO LLCs, and state compliance across all 50 states.',
      partners: ['Wyoming Corporate Services', 'CT Corporation', 'Northwest Registered Agent'],
      color: 'bg-[#0052FF]',
    },
    {
      title: 'Legal & Tax',
      description: 'Operating agreements, estate planning trusts, tax optimization strategies, and official advisory.',
      partners: ['Licensed Attorneys', 'CPAs & Tax Advisors', 'Estate Planning Counsel'],
      color: 'bg-[#00D4AA]',
    },
    {
      title: 'Web3 Exchanges',
      description: 'Institutional KYB onboarding, multi-sig custody, and fiat on/off ramp integration.',
      partners: ['Kraken Institutional', 'Coinbase Prime', 'Coinpass'],
      color: 'bg-[#7C3AED]',
    },
    {
      title: 'Crypto Accounting',
      description: 'Cost basis tracking, real-time gain/loss calculations, and audit-ready tax reports.',
      partners: ['Recap.io', 'CoinTracker', 'TokenTax'],
      color: 'bg-[#D97706]',
    },
  ];

  const complianceFeatures = [
    { title: 'SOC 2 Type II', description: 'Annual third-party audits verify our security controls meet institutional standards.', icon: <ShieldIcon className="w-6 h-6" /> },
    { title: 'GDPR Compliant', description: 'Full data protection compliance with European privacy regulations for global clients.', icon: <LockIcon className="w-6 h-6" /> },
    { title: 'Privacy Shield', description: 'Anonymous entity formation with nominee services keeps your identity off public records.', icon: <ShieldIcon className="w-6 h-6" /> },
    { title: 'Multi-Jurisdiction', description: 'Compliance frameworks spanning Wyoming, Delaware, Nevada, and international territories.', icon: <GlobeIcon className="w-6 h-6" /> },
    { title: 'AML/KYC Integration', description: 'Built-in anti-money laundering and know-your-customer verification workflows.', icon: <DocumentIcon className="w-6 h-6" /> },
    { title: 'Audit Trail', description: 'Immutable, timestamped records of every transaction, filing, and governance action.', icon: <ChartIcon className="w-6 h-6" /> },
  ];

  const testimonials = [
    {
      quote: 'BTE transformed how we manage our portfolio entities. The privacy shielding and multi-sig governance setup gave us institutional-grade security without the complexity we feared.',
      name: 'Marcus Chen',
      title: 'Managing Partner, Horizon Digital Ventures',
    },
    {
      quote: 'We needed a DAO LLC structure that could interface with traditional banking. BTE delivered in under two weeks, complete with compliant treasury management and automated accounting.',
      name: 'Sarah Whitfield',
      title: 'Founder, DeFi Collective',
    },
    {
      quote: 'The cost basis tracking and real-time compliance monitoring saved us over $200K in our first tax year. Their partner ecosystem is unmatched in the space.',
      name: 'James Okafor',
      title: 'CFO, Apex Mining Operations',
    },
  ];

  const faqs = [
    {
      question: 'What types of entities can you form?',
      answer: 'We specialize in Single-Member LLCs, Multi-Member LLCs, DAO LLCs (Wyoming), Series LLCs, and Holding/Operating LLC structures. Each is tailored for digital asset operations with custom Operating Agreements covering crypto-specific governance, multi-signature requirements, and treasury management protocols.',
    },
    {
      question: 'How long does entity formation take?',
      answer: 'Standard formation takes 5-7 business days from document submission to entity approval. Expedited processing (1-2 business days) is available for Wyoming and Delaware formations. Full onboarding including bank accounts, exchange integration, and treasury setup typically completes within 2-3 weeks.',
    },
    {
      question: 'What does entity formation cost?',
      answer: 'Our formation packages start at $1,500 for a basic LLC with registered agent, EIN, and Operating Agreement. The Professional package ($3,500) adds treasury setup, exchange integration, and first-year accounting. Enterprise packages with multi-entity structures and dedicated compliance support are quoted individually.',
    },
    {
      question: 'Why should I use an LLC for crypto holdings?',
      answer: 'An LLC provides liability protection (separating personal assets from business risk), tax optimization (pass-through taxation avoids double taxation), privacy shielding (your name stays off public records in certain states), and institutional access (exchanges like Coinbase Prime and Kraken Institutional require corporate KYB).',
    },
    {
      question: 'Which jurisdiction should I choose?',
      answer: 'Wyoming is our top recommendation for most crypto entities — it has no state income tax, the strongest privacy protections, explicit DAO LLC legislation, and the lowest annual fees. Delaware is preferred for entities seeking venture capital. Nevada offers strong asset protection but higher fees.',
    },
    {
      question: 'Do you provide legal or tax advice?',
      answer: 'BTE is an entity structuring and concierge platform, not a law firm or accounting practice. We partner with licensed attorneys, CPAs, and tax advisors who provide legal and tax counsel directly. Our role is to orchestrate the entire process and ensure all providers work together seamlessly.',
    },
  ];

  const quickSteps = [
    {
      num: '1',
      title: 'Choose Your State',
      description: 'Each state has different rules, fees, and benefits. Wyoming and Delaware are the most popular for LLCs because of their business-friendly laws and privacy protections.',
    },
    {
      num: '2',
      title: 'Name Your LLC',
      description: 'Pick a unique name that includes "LLC" or "Limited Liability Company." Check your state\'s business name database to make sure it\'s available.',
    },
    {
      num: '3',
      title: 'Appoint a Registered Agent',
      description: 'This is a person or service with a physical address in your state who receives legal documents on your LLC\'s behalf. You can be your own or hire a service.',
    },
    {
      num: '4',
      title: 'File Articles of Organization',
      description: 'Submit this document to your state\'s Secretary of State office (online or by mail). It officially creates your LLC. Fees range from $50 to $350 depending on the state.',
    },
    {
      num: '5',
      title: 'Create an Operating Agreement',
      description: 'This internal document outlines ownership, management structure, and rules. Not all states require it, but it\'s highly recommended for asset protection.',
    },
    {
      num: '6',
      title: 'Get an EIN',
      description: 'Apply for a free Employer Identification Number from the IRS. You\'ll need it to open a business bank account, file taxes, and hire employees.',
    },
  ];

  const detailedGuide = [
    {
      num: '1',
      title: 'Selecting a Name',
      points: [
        'Must include an LLC designator ("LLC," "L.L.C.," or "Limited Liability Company")',
        'Cannot include words that could confuse it with a government agency (e.g., FBI, Treasury)',
        'Must be distinguishable from other registered businesses in your state',
        'Check domain name and social media handle availability before finalizing',
      ],
    },
    {
      num: '2',
      title: 'Appointing a Registered Agent',
      points: [
        'Must have a physical street address in the state of formation (not a P.O. Box)',
        'Must be available during normal business hours to accept legal documents',
        'Can be an individual (including yourself) or a professional registered agent service',
        'Using a professional service adds a layer of privacy and reliability',
      ],
    },
    {
      num: '3',
      title: 'Filing Articles of Organization',
      points: [
        'This is the official formation document filed with the Secretary of State',
        'Typically includes: LLC name, registered agent info, management structure, organizer details',
        'Filing fees range from $50 (e.g., Kentucky) to $350+ (e.g., Massachusetts)',
        'Processing time varies: 1-2 days for expedited, up to several weeks for standard',
      ],
    },
    {
      num: '4',
      title: 'Creating an Operating Agreement',
      points: [
        'Defines ownership percentages and capital contributions of each member',
        'Establishes voting rights and decision-making processes',
        'Outlines profit and loss distribution among members',
        'Details procedures for adding/removing members and dissolving the LLC',
      ],
    },
    {
      num: '5',
      title: 'Obtaining an EIN',
      points: [
        'Apply for free directly through the IRS (online application takes minutes)',
        'Required for opening business bank accounts and filing federal taxes',
        'Needed to hire employees or contractors',
        'Acts as your business\'s "Social Security Number" for tax purposes',
      ],
    },
    {
      num: '6',
      title: 'Setting Up a Business Bank Account',
      points: [
        'Separates personal and business finances (crucial for liability protection)',
        'Typically requires: EIN, Articles of Organization, Operating Agreement, and photo ID',
        'Consider banks that offer business checking with low or no monthly fees',
        'Keep meticulous records of all deposits, withdrawals, and transfers',
      ],
    },
    {
      num: '7',
      title: 'Keeping Your LLC in Good Standing',
      points: [
        'File annual reports (or biennial, depending on the state) to maintain active status',
        'Pay annual renewal fees and any franchise taxes on time',
        'Maintain a current registered agent at all times',
        'Stay organized and keep clean financial records to protect your business and help it thrive',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ============================================================ */}
      {/*  NAVIGATION                                                  */}
      {/* ============================================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#0052FF] flex items-center justify-center">
                <span className="text-white font-extrabold text-sm tracking-tight">BTE</span>
              </div>
              <span className="hidden sm:inline font-semibold text-white text-base tracking-tight">
                Blockchain Trust Enterprise
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/admin/login"
                className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                Admin Login
              </Link>
              <Link
                href="/contact"
                className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A1628] px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-[#0A1628] border-t border-white/10 animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-slate-300 hover:text-white py-2 font-medium"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-white/10" />
              <Link
                href="/admin/login"
                className="block text-slate-300 hover:text-white py-2 font-medium"
              >
                Admin Login
              </Link>
              <Link
                href="/contact"
                className="block bg-[#00D4AA] text-[#0A1628] px-5 py-2.5 rounded-lg font-semibold text-center mt-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/*  HERO SECTION                                                */}
      {/* ============================================================ */}
      <section className="gradient-hero relative overflow-hidden pt-36 pb-20 sm:pt-40 lg:pt-44 lg:pb-28">
        {/* Decorative floating elements */}
        <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-[#0052FF]/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 left-[5%] w-56 h-56 rounded-full bg-[#00D4AA]/8 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-[20%] w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse-glow" />
        <div className="absolute top-1/3 left-[15%] w-1.5 h-1.5 bg-[#0052FF] rounded-full animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        {/* Geometric shapes */}
        <div className="absolute top-32 right-[15%] w-20 h-20 border border-[#00D4AA]/20 rotate-45 animate-float hidden lg:block" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 right-[30%] w-12 h-12 border border-[#0052FF]/20 rotate-12 animate-float hidden lg:block" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#00D4AA] px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse" />
              Trusted by 500+ Institutional Clients
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up">
              Secure Your Digital Assets With{' '}
              <span className="gradient-text">Institutional-Grade</span>{' '}
              Entity Structuring
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl animate-slide-up" style={{ animationDelay: '0.15s' }}>
              We orchestrate legal counsel, registered agents, Web3 exchanges, and crypto accounting tools
              into a seamless enterprise concierge service — so you can focus on building, not paperwork.
            </p>

            {/* CTAs */}
            <div className="mt-10 mb-4 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#00D4AA] hover:bg-[#00B894] text-[#0A1628] px-7 py-3.5 rounded-xl font-semibold text-base transition-colors"
              >
                Start Entity Formation
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-colors hover:bg-white/5"
              >
                Explore Services
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-14 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-slide-up" style={{ animationDelay: '0.45s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl px-6 py-5 text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ABOUT SECTION                                               */}
      {/* ============================================================ */}
      <section id="about" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <div className="text-sm font-semibold text-[#0052FF] uppercase tracking-wider mb-3">About BTE</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
                Why Blockchain Trust Enterprise
              </h2>
              <p className="mt-6 text-[#64748B] text-lg leading-relaxed">
                Operating digital assets under a personal name exposes you to unlimited liability, public exposure,
                and tax inefficiency. BTE provides the institutional wrapper that separates your personal risk
                from your digital asset operations.
              </p>
              <p className="mt-4 text-[#64748B] text-lg leading-relaxed">
                We have structured over 500 entities managing more than $2.8 billion in digital assets — with
                a 99.9% compliance rate across all jurisdictions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-[#0041CC] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
                >
                  Schedule Consultation
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E2E8F0] hover:border-[#00D4AA]/30 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00D4AA]/10 to-[#0052FF]/10 flex items-center justify-center text-[#0052FF] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-[#0F172A] text-base">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SERVICES SECTION                                            */}
      {/* ============================================================ */}
      <section id="services" className="bg-[#F8FAFC] py-20 lg:py-28 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm font-semibold text-[#0052FF] uppercase tracking-wider mb-3">What We Offer</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
              Our Services
            </h2>
            <p className="mt-4 text-[#64748B] text-lg">
              Comprehensive entity structuring, financial infrastructure, and compliance services
              purpose-built for the digital asset economy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pb-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-8 border border-[#E2E8F0] hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.accent}`} />

                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00D4AA]/10 to-[#0052FF]/10 flex items-center justify-center text-[#0052FF] mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">{service.title}</h3>
                <p className="mt-3 text-[#64748B] leading-relaxed">{service.description}</p>
                <ul className="mt-6 space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#0F172A]">
                      <CheckIcon className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  COMPANY REGISTRATION SECTION                                */}
      {/* ============================================================ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-sm font-semibold text-[#0052FF] uppercase tracking-wider mb-3">Entity Registration</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
              What You Need to Know About Company Registration
            </h2>
            <p className="mt-4 text-[#64748B] text-lg">
              Registering your digital asset operations under a corporate entity is the single most
              important step for protecting your wealth, optimizing taxes, and maintaining privacy.
            </p>
          </div>

          {/* Why register */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <ShieldIcon className="w-7 h-7" />,
                title: 'Liability Protection',
                description: 'A properly formed LLC creates a legal barrier between your personal assets and your crypto operations. If a smart contract exploit or market event impacts your entity, your home, savings, and personal accounts remain untouchable.',
              },
              {
                icon: <ChartIcon className="w-7 h-7" />,
                title: 'Tax Optimization',
                description: 'LLCs offer pass-through taxation, avoiding the double taxation of C-corps. Deduct operational expenses — hardware, software, travel, consulting — against revenue. Elect S-corp status when revenue justifies it to reduce self-employment tax.',
              },
              {
                icon: <LockIcon className="w-7 h-7" />,
                title: 'Privacy & Anonymity',
                description: 'In states like Wyoming, your name never appears on public filings. Nominee registered agents shield your identity. Your crypto holdings are held by the entity, not by you personally, creating a critical privacy layer.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#F8FAFC] rounded-xl p-7 border border-[#E2E8F0]">
                <div className="w-12 h-12 rounded-lg bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] mb-5">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-[#0F172A]">{item.title}</h3>
                <p className="mt-3 text-[#64748B] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Jurisdiction comparison table */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Jurisdiction Comparison</h3>
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0A1628] text-white">
                    <th className="px-6 py-4 text-sm font-semibold">Jurisdiction</th>
                    <th className="px-6 py-4 text-sm font-semibold">Privacy Level</th>
                    <th className="px-6 py-4 text-sm font-semibold">Filing Fees</th>
                    <th className="px-6 py-4 text-sm font-semibold">Annual Report</th>
                    <th className="px-6 py-4 text-sm font-semibold">DAO LLC Support</th>
                    <th className="px-6 py-4 text-sm font-semibold">Tax Benefits</th>
                  </tr>
                </thead>
                <tbody>
                  {jurisdictions.map((j) => (
                    <tr
                      key={j.state}
                      className={`border-t border-[#E2E8F0] ${j.highlight ? 'bg-[#00D4AA]/5' : 'bg-white'} hover:bg-[#F8FAFC] transition-colors`}
                    >
                      <td className="px-6 py-4 font-semibold text-[#0F172A]">
                        {j.state}
                        {j.highlight && (
                          <span className="ml-2 inline-block bg-[#00D4AA] text-[#0A1628] text-xs font-bold px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#64748B]">{j.privacy}</td>
                      <td className="px-6 py-4 text-[#64748B]">{j.fees}</td>
                      <td className="px-6 py-4 text-[#64748B]">{j.annualReport}</td>
                      <td className="px-6 py-4 text-[#64748B]">{j.daoSupport}</td>
                      <td className="px-6 py-4 text-[#64748B]">{j.taxBenefits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Required documents and timeline */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[#F8FAFC] rounded-xl p-8 border border-[#E2E8F0]">
              <h3 className="text-xl font-bold text-[#0F172A] mb-5">Required Documents</h3>
              <ul className="space-y-3">
                {[
                  'Government-issued ID (passport or driver\'s license)',
                  'Proof of address (utility bill or bank statement)',
                  'Social Security Number or ITIN (for EIN application)',
                  'Intended business purpose description',
                  'Member/manager information for Operating Agreement',
                  'Initial capital contribution details',
                ].map((doc) => (
                  <li key={doc} className="flex items-start gap-3 text-[#0F172A]">
                    <CheckIcon className="w-5 h-5 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-8 border border-[#E2E8F0]">
              <h3 className="text-xl font-bold text-[#0F172A] mb-5">Formation Timeline</h3>
              <div className="space-y-5">
                {[
                  { day: 'Day 1-2', task: 'Discovery call and structural scoping' },
                  { day: 'Day 3-5', task: 'Articles of Organization filing' },
                  { day: 'Day 5-7', task: 'EIN procurement and Operating Agreement' },
                  { day: 'Day 7-10', task: 'Corporate bank account application' },
                  { day: 'Day 10-14', task: 'Exchange KYB and treasury setup' },
                  { day: 'Day 14-21', task: 'Accounting integration and go-live' },
                ].map((item) => (
                  <div key={item.day} className="flex items-start gap-4">
                    <div className="w-20 flex-shrink-0 text-sm font-bold text-[#0052FF]">{item.day}</div>
                    <div className="flex-1 text-sm text-[#0F172A] leading-relaxed border-l-2 border-[#0052FF]/20 pl-4">
                      {item.task}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS SECTION                                        */}
      {/* ============================================================ */}
      <section id="how-it-works" className="gradient-hero py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4AA]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm font-semibold text-[#00D4AA] uppercase tracking-wider mb-3">Process</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              How It Works
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              Our five-step process takes you from initial consultation to fully operational entity
              in as little as two weeks.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#00D4AA]/40 via-[#0052FF]/40 to-[#00D4AA]/40" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
              {steps.map((step, i) => (
                <div key={step.num} className="relative text-center lg:text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                  {/* Step number circle */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#0052FF] flex items-center justify-center text-white font-bold text-lg relative z-10 mb-5">
                    {step.num}
                  </div>
                  <div className="glass-card rounded-xl p-5 lg:p-4">
                    <div className="flex items-center justify-center text-[#00D4AA] mb-3">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold text-white text-base mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PARTNER ECOSYSTEM SECTION                                   */}
      {/* ============================================================ */}
      <section id="partners" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm font-semibold text-[#0052FF] uppercase tracking-wider mb-3">Ecosystem</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
              Partner Ecosystem
            </h2>
            <p className="mt-4 text-[#64748B] text-lg">
              We orchestrate a network of best-in-class service providers so you
              don&apos;t have to manage them individually.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerCategories.map((cat) => (
              <div
                key={cat.title}
                className="bg-[#F8FAFC] rounded-2xl p-7 border border-[#E2E8F0] hover:border-[#00D4AA]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-11 h-11 ${cat.color} rounded-lg flex items-center justify-center mb-5`}>
                  <span className="text-white font-bold text-sm">{cat.title.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">{cat.title}</h3>
                <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{cat.description}</p>
                <div className="mt-5 space-y-2">
                  {cat.partners.map((p) => (
                    <div key={p} className="text-sm text-[#0F172A] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full flex-shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  COMPLIANCE & SECURITY SECTION                               */}
      {/* ============================================================ */}
      <section className="bg-[#F8FAFC] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm font-semibold text-[#0052FF] uppercase tracking-wider mb-3">Security</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
              Built on Trust & Compliance
            </h2>
            <p className="mt-4 text-[#64748B] text-lg">
              Enterprise-grade security and compliance frameworks protect every entity we manage.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-7 border border-[#E2E8F0] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS SECTION                                        */}
      {/* ============================================================ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm font-semibold text-[#0052FF] uppercase tracking-wider mb-3">Testimonials</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
              Trusted by Industry Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] hover:shadow-lg transition-all duration-300 relative"
              >
                {/* Quote mark */}
                <div className="text-5xl text-[#00D4AA]/30 font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-[#0F172A] leading-relaxed">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#0052FF] flex items-center justify-center text-white font-bold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F172A] text-sm">{t.name}</div>
                    <div className="text-xs text-[#64748B]">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LLC FORMATION GUIDE + FAQ SECTION                           */}
      {/* ============================================================ */}
      <section id="llc-guide" className="bg-[#F8FAFC] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-sm font-semibold text-[#0052FF] uppercase tracking-wider mb-3">LLC Formation Guide</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight">
              How to Form Your LLC
            </h2>
            <p className="mt-4 text-[#64748B] text-lg">
              Everything you need to know to form your LLC correctly and avoid common mistakes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN: Quick Reference + Detailed Guide */}
            <div className="space-y-8">
              {/* Quick Reference Card */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#0052FF] flex items-center justify-center">
                    <DocumentIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Quick Reference: 6 Steps</h3>
                </div>
                <div className="space-y-4">
                  {quickSteps.map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#00D4AA]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-[#00D4AA]">{step.num}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0F172A] text-sm">{step.title}</h4>
                        <p className="text-[#64748B] text-sm leading-relaxed mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Guide */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#7C3AED] flex items-center justify-center">
                    <BuildingIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Detailed Formation Guide</h3>
                </div>
                <div className="space-y-6">
                  {detailedGuide.map((step) => (
                    <div key={step.num} className="border-l-2 border-[#0052FF]/20 pl-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-white bg-[#0052FF] w-6 h-6 rounded-full flex items-center justify-center">{step.num}</span>
                        <h4 className="font-semibold text-[#0F172A]">{step.title}</h4>
                      </div>
                      <ul className="space-y-1.5">
                        {step.points.map((point, pi) => (
                          <li key={pi} className="flex items-start gap-2 text-sm text-[#64748B] leading-relaxed">
                            <CheckIcon className="w-4 h-4 text-[#00D4AA] flex-shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0]">
                  <p className="text-sm text-[#15803D] leading-relaxed font-medium">
                    Staying organized and keeping clean financial records are the best ways to protect your business and help it thrive. An LLC is only as strong as its compliance practices.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FAQ */}
            <div>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Frequently Asked Questions</h3>
                </div>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden transition-all duration-200"
                    >
                      <button
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 hover:bg-[#F1F5F9] transition-colors"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span className="font-semibold text-[#0F172A] text-sm">{faq.question}</span>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-[#64748B] flex-shrink-0 transition-transform duration-200 ${
                            openFaq === i ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-5 pb-4 animate-fade-in">
                          <p className="text-[#64748B] text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                 */}
      {/* ============================================================ */}
      <section id="contact" className="gradient-hero py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4AA]/20 to-transparent" />
        <div className="absolute top-20 right-[10%] w-40 h-40 rounded-full bg-[#0052FF]/10 blur-3xl" />
        <div className="absolute bottom-10 left-[10%] w-40 h-40 rounded-full bg-[#00D4AA]/8 blur-3xl" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Ready to Protect Your Digital Assets?
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Start with a free structural assessment. We&apos;ll determine the optimal entity type,
            jurisdiction, and governance setup for your specific situation.
          </p>

          {/* Email form */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA] transition-colors text-sm"
            />
            <button className="bg-[#00D4AA] hover:bg-[#00B894] text-[#0A1628] px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
              Get Started
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-[#00D4AA]" />
              SOC 2 Certified
            </div>
            <div className="flex items-center gap-2">
              <LockIcon className="w-4 h-4 text-[#00D4AA]" />
              256-bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-4 h-4 text-[#00D4AA]" />
              GDPR Compliant
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="bg-[#0A1628] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#0052FF] flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm tracking-tight">BTE</span>
                </div>
                <span className="font-semibold text-white text-base tracking-tight">
                  Blockchain Trust Enterprise
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Institutional-grade digital asset entity structuring, privacy shielding,
                and treasury management. Trusted by 500+ clients managing over $2.8B in digital assets.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-4 mt-6">
                {/* Twitter/X */}
                <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* GitHub */}
                <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" aria-label="GitHub">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-5 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                {['About', 'Services', 'How It Works', 'Partners', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-5 uppercase tracking-wider">Services</h4>
              <ul className="space-y-3">
                {['Entity Formation', 'Treasury Setup', 'Compliance', 'Accounting', 'Privacy Shielding'].map((link) => (
                  <li key={link}>
                    <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-5 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Cookie Policy', href: '/cookies' },
                  { label: 'Compliance', href: '/compliance' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-3 border-t border-white/10">
                  <a href="mailto:contact@blockchaintrust.enterprise" className="text-sm text-slate-400 hover:text-white transition-colors">
                    contact@blockchaintrust.enterprise
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Blockchain Trust Enterprise. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              BTE is an entity structuring platform, not a law firm or financial advisor.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
