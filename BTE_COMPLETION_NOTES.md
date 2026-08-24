# BTE Completion Notes

## Public frontend

The public root URL is the client-facing BTE Markets workspace. Navigation now replaces the Overview with the selected Portfolio, Markets, Trade, Research, Balances, Reports, Security Center, Settings, or Help Center screen instead of stacking screens beneath Overview.

Visible public actions now have demo behavior: market search and asset-class filters, quote drawers, saved-screen forms, market mover briefs, economic-calendar alerts, portfolio report export, tax-lot controls, guardrail configuration, position details, recurring-investment setup, order history export, pre-trade control configuration, research alerts, research briefs, fundamentals screener, options strategy builder, earnings calendar, learning center, BTE Copilot prompts, account requests, preference forms, and TrustLayer transparency reports.

The paper order ticket supports Buy/Sell, Market/Limit/Stop, Day/Good-till-canceled, quantity entry, estimated value calculation, and a confirmation toast. It is explicitly simulated and does not route live orders.

## Separate admin boundary

The admin URL is `/admin/login` and admin pages are protected by `AdminGuard`. The login route itself is intentionally outside the guard; this prevents an unauthenticated redirect loop that previously rendered a blank page. Authenticated administrators can access `/admin/frontend-control`.

## Admin-to-frontend propagation

Admin configuration persists in SQLite `platform_config` and is read by the public `/api/platform-config` endpoint. Authenticated writes use a Bearer JWT and an allowlisted, typed configuration schema. The public workspace consumes headline, subtitle, workspace mode, trust message, and feature flags. Feature flags now visibly control Recurring Investments, BTE Copilot, and Research Alerts in their respective public screens.

## Verification

- `npm run build` succeeds after the public interaction rebuild.
- Public Overview loaded with admin-edited headline `BTE — Precision for every position.`.
- Public Markets screen loaded and quote drawer opened.
- Public Research screen loaded with working briefs, tools, and Copilot input.
- Public Trade screen loaded, order ticket opened, and paper order staged successfully.
- `/admin/login` rendered after the guard-boundary repair.
- Default development admin authenticated successfully and `/admin/frontend-control` loaded.
- Admin headline was edited and saved; the updated headline appeared on the public root after refresh.

## Production boundary

Live execution, custody, KYC/KYB, money movement, licensed market data, tax reporting, regulatory disclosures, and production security still require authorized provider integrations and compliance review. The current release is a working product demonstration with safe simulated records and controls.
