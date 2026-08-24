# BTE Admin Control Center Notes

The new `/admin/frontend-control` route is protected by the existing `AdminGuard`; unauthenticated browser access redirects to `/admin/login`.

The route provides admin-editable controls for workspace headline, subtitle, trust message, workspace mode, demo order notional limit, and feature flags for BTE Copilot, recurring investments, and market alerts. Values persist through `/api/platform-config` in the `platform_config` SQLite table. The public GET endpoint hydrates the client workspace, while writes require a verified admin JWT.

The client workspace now consumes the headline, subtitle, workspace mode, and trust message values. It also exposes four BTE differentiator concepts: explainable execution receipts, TrustLayer transparency, personal guardrails, and privacy-first tax intelligence.

Verification: `npm run build` succeeds. The admin route correctly redirects unauthenticated users to `/admin/login`.
