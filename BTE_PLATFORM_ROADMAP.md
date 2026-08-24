# Blockchain Trust Enterprise Platform Roadmap

## Current release: Institutional workspace expansion

Blockchain Trust Enterprise now presents an original premium markets workspace inspired by the public capability categories visible in large multi-asset broker platforms. The interface does not copy Interactive Brokers branding, source code, or proprietary screens.

| Surface | Current demo implementation | Live integration required |
|---|---|---|
| Overview | Portfolio value, P&L, allocation, net liquidation chart, watchlist, recent orders, signal card | Pricing stream, ledger, corporate actions, account service |
| Portfolio | Performance analytics, risk-factor exposure, margin cushion, holdings and tax-lot table | Portfolio ledger, historical pricing, tax-lot engine, margin engine |
| Markets | Global instrument explorer, asset filters, search, market movers, economic calendar | Licensed real-time/delayed market-data providers and exchange entitlements |
| Trade | Order management, recurring-investment entry point, pre-trade control preview, order history | Broker/custodian API, risk checks, suitability, order routing, execution reports |
| Research | Research cards, fundamentals screener entry point, options strategy entry point, earnings calendar, education, BTE copilot entry point | Licensed news/research feeds, fundamentals, options chains, AI governance |
| Balances | Cash, settled cash, margin, withdrawal preview | Banking/payment rails, custody ledger, AML/transaction monitoring |
| Reports | Reports and statement workspace entry point | Statement generation, tax forms, document storage, retention policies |
| Security center | Account protection, MFA, session and permissions controls | Production identity provider, device intelligence, audit logs, fraud controls |
| Settings | Workspace preferences and notification controls | User profile service and notification infrastructure |
| Help center | Support workspace, knowledge base and case entry point | Customer-support platform, secure messaging, SLA monitoring |

## Important operating boundary

The repository currently runs in **Demo data mode**. All balances, market prices, orders, analytics, and research content are example records. The paper order ticket is intentionally non-routing. No funds, identity documents, or live trades are processed by this prototype.

## Production sequence

The correct production sequence is to establish the regulated operating model and authorized providers first, then connect the BTE UI to those services through a server-side integration layer. The minimum production work includes identity verification and KYC/KYB, sanctions and AML monitoring, account and custody ledgering, market-data licensing, broker/exchange connectivity, pre-trade risk and suitability checks, deposits and withdrawals, multi-factor authentication, regulatory disclosures, statements and tax reporting, operational monitoring, and incident response.

## Reference research

The feature categories were checked against the public Interactive Brokers homepage, public trading-platform information, public products-and-exchanges information, and public PortfolioAnalyst information.

- https://www.interactivebrokers.com/
- https://www.interactivebrokers.com/en/trading/trading-platforms.php
- https://www.interactivebrokers.com/en/trading/products-exchanges.php
- https://www.interactivebrokers.com/en/portfolioanalyst/overview.php
