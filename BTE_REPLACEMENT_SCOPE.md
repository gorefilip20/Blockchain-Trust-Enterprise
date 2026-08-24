# Blockchain Trust Enterprises Replacement Scope

## Reference feature categories

The public reference experience is organized around account opening, product discovery, global markets, platform selection, pricing, education, research, support, funding, security, and institutional services. Comparable BTE routes should therefore cover:

| Surface | BTE replacement scope |
|---|---|
| Public marketing | Home, Why BTE, Products, Pricing, Security, Education, Research, Support, About, Language/preferences |
| Client workspace | Overview, Portfolio, Markets, Trade, Research, Balances, Reports, Security Center, Settings, Help |
| Trading | Instrument search, watchlists, quote details, market/limit/stop orders, time-in-force, order review, execution receipt, open orders, history |
| Products | Equities, ETFs, options, futures, forex, bonds, funds, digital assets, structured and prediction-style demo markets |
| Analytics | Performance, allocation, risk, margin, tax lots, scenario analysis, fundamentals, options payoff builder, earnings and macro calendars |
| Account operations | Onboarding, permissions, funding, transfers, statements, tax documents, notifications, security and device sessions |
| Admin operations | Clients, entities, onboarding, treasury, payments, documents, accounting, partners, platform controls, incidents, content, feature flags |

## Current repair findings

The prior public experience had a screen-render fix and several stateful demo actions, but the mobile screenshots exposed two presentation failures: admin Tailwind utility classes were not loaded, causing desktop and mobile sidebar variants to render together as unstyled markup; and public advantage cards were appended after earlier mobile media rules, so their base grid rules overrode the phone breakpoint and produced horizontal overflow/white-space artifacts.

The current repair loads Tailwind utilities from `globals.css`, isolates the admin login route from `AdminGuard`, adds explicit public advantage-card base styles, and adds final mobile overrides after the base rules. The production build passes after these changes.

## Implementation boundary

The replacement will use original BTE copy, visuals, component names, and workflows. It will not copy Interactive Brokers proprietary code, logos, protected content, or pixel-identical branding. Real trading, custody, KYC/KYB, money movement, licensed market data, tax reporting, and regulated disclosures remain integration boundaries requiring authorized providers and compliance review. The demo environment will provide deterministic mock data and working user flows so no visible control is a dead end.

## Source URLs

- https://www.interactivebrokers.com/en/
- https://www.interactivebrokers.com/en/trading/trading-platforms.php
- https://www.interactivebrokers.com/en/trading/products-exchanges.php
- https://www.interactivebrokers.com/en/whyib/overview.php
