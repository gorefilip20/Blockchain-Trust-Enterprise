# BTE Platform Design Update Prompt

> Give this prompt to Claude Design to update the UI/UX for all newly implemented features.

---

## Project Context

**Platform:** Blockchain Trust Enterprise (BTE)
**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
**Design System Tokens:**

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0A1628` | Background, sidebar, dark sections |
| Teal | `#00D4AA` | Primary CTA, success, active states |
| Blue | `#0052FF` | Secondary actions, informational |
| Purple | `#7C3AED` | Preferred/premium badges |
| BEP20 Gold | `#F0B90B` | BNB Smart Chain network badge |
| TRC20 Red | `#FF0013` | TRON network badge |
| ERC20 Indigo | `#627EEA` | Ethereum network badge |

**Typography:** System font stack (Inter preferred), monospace for wallet addresses / tx hashes
**Border Radius:** `rounded-lg` (8px) for inputs, `rounded-2xl` (16px) for cards, `rounded-xl` (12px) for icon containers
**Card Style:** White bg, `border border-[#E2E8F0]`, `rounded-2xl`, `p-6` or `p-8`

---

## New Feature #1: Admin Login Page (`/admin/login`)

### Current Implementation
- Full-screen centered login with navy gradient background (`linear-gradient(135deg, #0A1628 0%, #0F2341 50%, #0A1628 100%)`)
- White card with `rounded-2xl shadow-2xl p-8`, max-width `md` (28rem)
- Teal `BTE` logo badge (16x16 rounded-2xl container with white text)
- Title: "Blockchain Trust Enterprise" with subtitle "Supervisor Control Terminal"
- Username + Password inputs with teal focus rings (`focus:ring-[#00D4AA]`)
- Teal CTA button: "Establish Connection Securely" with spinner loading state
- Default credentials hint in `bg-slate-50` box: `platform_supervisor / admin123456`
- "Back to public site" link at bottom

### Design Requests
1. **Add a subtle animated background effect** -- either a slow-moving gradient mesh, floating blockchain node particles, or a faint grid pattern on the navy background to reinforce the Web3/blockchain identity
2. **Improve the logo area** -- replace the simple text "BTE" with a proper logo mark or shield icon that matches the landing page branding
3. **Add password visibility toggle** -- an eye/eye-off icon inside the password input field
4. **Enhance the loading state** -- consider a progress bar or multi-step connection animation (e.g., "Authenticating... Establishing session... Redirecting...")
5. **Improve the credentials hint** -- make it more visually subtle or add a toggle to show/hide it. It should not look like the default state of a production app
6. **Add a security badge** -- a small "256-bit Encrypted Session" or "Secure Authentication" indicator below the login button with a lock icon

---

## New Feature #2: Platform Settings Page (`/admin/settings`)

### Current Implementation
Three stacked white cards in `max-w-4xl` layout:

**Card 1 - Registration Fee Configuration:**
- Teal icon container with dollar sign SVG
- Heading: "Registration Fee Configuration" with subtitle "Set the dual-entity formation package price"
- Dollar sign prefix input (`type="number"`) with "Update Price" teal button
- Displays current package name from DB

**Card 2 - Crypto Payment Gateway Configuration:**
- Blue icon container with wallet SVG
- Heading: "Crypto Payment Gateway Configuration"
- Lists active wallets as rows: colored network badge (BEP20 gold, TRC20 red, ERC20 indigo) + monospace address + "Active" green pill
- Add/Update form: network dropdown + wallet address input + "Save Destination Address" blue button
- Network badges use color-coded rounded-full pills with white text

**Card 3 - Authentication Security:**
- Purple icon container with lock SVG
- Heading: "Authentication Security" with subtitle about bcrypt + JWT
- Three info tiles in `bg-slate-50`: Password Hashing (bcrypt 10 rounds), Session Tokens (JWT 24h), Token Storage (localStorage)

### Design Requests
1. **Add section tabs or a left sidebar** -- as Settings grows, create a tabbed or sidebar navigation (General, Payment Gateway, Security, Notifications) instead of stacking everything vertically
2. **Add wallet validation feedback** -- show a green checkmark or red X inline as the user types a wallet address, validating the prefix (`0x` for ERC20/BEP20, `T` for TRC20) and length
3. **Add confirmation modals** -- before saving a new wallet address or changing the registration fee, show a confirmation dialog with the old vs new value
4. **Network wallet cards** -- instead of a flat list, show each network as its own mini-card with the network logo, chain name, current wallet address, and a dedicated edit button
5. **Add a "Test Connection" button** -- for each configured wallet, add a button that pings the respective blockchain RPC to verify the address exists and has received transactions
6. **Security card enhancement** -- add a "Change Password" section with current password, new password, confirm password fields. Add a session log showing recent admin login timestamps
7. **Add a danger zone** -- at the bottom, add a red-bordered "Danger Zone" card for destructive actions like resetting all wallets or regenerating the JWT secret

---

## New Feature #3: Onboarding Payment Gate (Stage 1 of `/admin/onboarding`)

### Current Implementation
Inside Stage 1 "Intake & Identity Masking", after the client info fields, there's a payment gate section:

- Teal-bordered card (`border-2`, `borderColor: #00D4AA`, subtle teal bg tint)
- Teal icon badge with dollar sign
- Title: "Dual-Entity Formation Deposit ($499.00 USD)" with subtitle about required crypto payment
- Network selector dropdown: TRC20, BEP20, ERC20
- Destination wallet display in `bg-slate-50` box: "Send $499.00 USDT to: [wallet address]"
- TX Hash input field (monospace font) for pasting the transaction hash after sending
- Dynamic: wallet addresses and billing price are fetched from the admin settings API

### Design Requests
1. **Add a visual payment flow** -- show a 3-step mini flow: (1) Select Network -> (2) Send Payment -> (3) Paste TX Hash, with the current step highlighted
2. **Add QR code generation** -- generate and display a QR code for the destination wallet address so clients can scan with their mobile wallet app
3. **Add a copy-to-clipboard button** -- next to the wallet address, add a copy icon that copies the address to clipboard with a "Copied!" tooltip
4. **Network selector as visual cards** -- instead of a dropdown, show the three networks as selectable cards with their respective chain logos and colors (BNB gold, TRON red, Ethereum indigo)
5. **Add a real-time TX verification indicator** -- after pasting a TX hash, show a status indicator that says "Pending Verification" with an animated spinner. When verified, show a green checkmark with "Payment Confirmed"
6. **Add payment amount in token terms** -- show both USD and approximate USDT amount (they're 1:1 but it reassures the user). If a different stablecoin is used in the future, this field handles conversion display
7. **Improve the "No wallet configured" fallback** -- instead of plain text, show a warning banner with a link directly to Settings to configure wallets

---

## New Feature #4: Document Download Paywall

### Current Implementation
- Documents API (`/api/documents/download/[token]`) now checks `is_registration_fee_paid` on the client record
- Returns HTTP 403 with `{ error: 'Payment required...' }` if the client hasn't paid
- No frontend UI change yet -- the 403 is just a JSON response

### Design Requests
1. **Create a paywall overlay component** -- when a user tries to download a document and gets a 403, show a modal/overlay instead of a raw error. The overlay should explain that a $499 formation fee is required, show which documents are locked, and provide a CTA to initiate payment
2. **Add lock icons to unpaid documents** -- in the documents list, show a small lock icon overlay on documents belonging to clients who haven't paid. Paid clients should show an open lock or no icon
3. **Add a payment status banner** -- on the client detail page, show a top banner indicating payment status: green "Payment Confirmed" with checkmark, or amber "Payment Pending" with a "Verify Payment" button, or red "Payment Required" with instructions

---

## New Feature #5: Admin Sidebar Updates (`AdminSidebar.tsx`)

### Current Implementation
- Navy `#0A1628` background, 64px wide (w-64)
- BTE teal logo badge in top-left with "Blockchain Trust / Admin Portal" text
- 10 nav items with SVG icons: Dashboard, Clients, Entities, Partners, Treasury, Payments, Documents, Accounting, New Client, Settings
- Active state: teal left border (3px), teal text, subtle teal bg
- Hover state: slight white bg tint, lighter text
- Bottom: user avatar (blue circle with "A"), "Admin User" / "admin@bte.com", Logout button with red hover
- Mobile: hamburger toggle, slide-out drawer with dark overlay
- Logout clears `bte-admin-token` from localStorage

### Design Requests
1. **Group nav items** -- add section dividers/labels: "Overview" (Dashboard), "Client Management" (Clients, Entities, Partners), "Financial" (Treasury, Payments, Accounting, Documents), "Actions" (New Client), "System" (Settings)
2. **Update the user section** -- replace hardcoded "Admin User / admin@bte.com" with the actual logged-in username from `localStorage.getItem('bte-admin-user')`. Show the first letter of the username in the avatar circle
3. **Add notification badges** -- show a red dot or count badge on "Payments" when there are pending payment verifications, and on "Clients" when new onboarding submissions are waiting
4. **Add a collapse mode** -- allow the sidebar to collapse to icon-only mode (48px wide) with a toggle button, expanding on hover or click
5. **Add keyboard shortcuts** -- show subtle keyboard shortcut hints next to nav items (e.g., "D" for Dashboard, "C" for Clients) visible on hover

---

## New Feature #6: Multi-Chain Payment Verification Engine (`verify-payments.ts`)

### Context (Backend Only -- needs admin dashboard UI)
- Server-side background job that processes pending payments
- Queries `payments` table for rows with `status = 'processing_verification'`
- Verifies against live blockchain RPCs: BSC (BEP20), Ethereum (ERC20), TronGrid (TRC20)
- On success: marks payment `confirmed_active`, sets `is_registration_fee_paid = 1` on client, completes all workflows
- On failure: increments retry counter, marks `failed` after 5 retries
- Validates: recipient matches configured wallet, amount >= 99% of expected amount

### Design Requests
1. **Create a Payment Verification Dashboard** -- a new section on the Payments admin page showing:
   - Active verifications in progress (with animated pulse indicator)
   - Verification history log: timestamp, TX hash, network, amount, status (confirmed/failed/retrying)
   - Retry counter visualization (e.g., 3/5 retries shown as progress dots)
2. **Add a "Manual Verify" button** -- for each pending payment, allow the admin to trigger a manual RPC verification check with a single click, showing real-time status updates
3. **Add blockchain explorer links** -- for each TX hash, auto-link to the correct explorer:
   - BEP20: `https://bscscan.com/tx/{hash}`
   - ERC20: `https://etherscan.io/tx/{hash}`
   - TRC20: `https://tronscan.org/#/transaction/{hash}`
4. **Show verification details** -- expandable row showing: sender address, verified amount, block number, verification timestamp, number of confirmations

---

## New Feature #7: Public Landing Page -- LLC Formation Guide Section

### Current Implementation
- Combined `#llc-guide` section replacing the standalone FAQ
- Two-column layout on desktop (lg breakpoint):
  - **Left column:** Quick Reference card (6 numbered steps with teal number badges) + Detailed Formation Guide card (7 expandable items with teal dot markers and a green callout box about Wyoming privacy benefits)
  - **Right column:** Sticky FAQ accordion (`lg:sticky lg:top-24`) with expand/collapse items using `ChevronDownIcon`
- Navy background section with white/teal text
- Quick steps: Research -> Choose State -> Draft Agreement -> File Articles -> Get EIN -> Open Accounts
- Detailed guide covers: State Selection Strategy, Operating Agreement Drafting, Tax Architecture, Crypto Custody Framework, etc.

### Design Requests
1. **Add visual icons** -- replace the numbered teal circles with relevant icons for each step (magnifying glass for Research, map pin for Choose State, document for Draft, etc.)
2. **Add an interactive comparison table** -- Delaware vs Wyoming comparison showing: filing fees, privacy level, crypto-friendliness, DAO support, annual reporting requirements
3. **Add a "Get Started" CTA** -- at the bottom of the guide section, add a prominent call-to-action card: "Ready to form your two-tier LLC?" with a button linking to the contact form or onboarding intake
4. **Make the detailed guide collapsible** -- each of the 7 guide items should be an accordion (like the FAQ) to reduce visual overwhelm
5. **Add estimated timeline** -- show a horizontal timeline graphic: "Week 1: State Filing -> Week 2-3: EIN Processing -> Week 3-4: Banking Setup -> Week 4-6: Full Deployment"

---

## General Design Principles to Follow

1. **Consistency:** Use the established color tokens everywhere. Teal for primary actions, Blue for secondary/informational, Purple for premium/preferred badges, Navy for dark backgrounds
2. **Spacing:** Maintain the existing `p-6` / `p-8` card padding and `gap-3` / `gap-4` between elements
3. **Responsive:** All new components must work on mobile (< 768px). Use the existing `sm:grid-cols-2` / `lg:grid-cols-3` breakpoint patterns
4. **Loading States:** Every async action should show a loading spinner or skeleton. Use the existing spinner SVG pattern with `animate-spin`
5. **Error States:** Use the existing error pattern: `bg-red-50 border-red-200 text-red-700` for inline errors
6. **Success Feedback:** Use the existing success pattern: `bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]` for success messages
7. **Monospace:** All wallet addresses, TX hashes, and blockchain data should use `font-mono`
8. **Security Indicators:** Any sensitive operation should have visual security cues (lock icons, shield badges, encrypted labels)
