# Baseline audit

## Public homepage

The current homepage is functional and content-rich, but it leans heavily into a terminal-style dark theme: near-black background, mint green accents, thin monospace labels, and a large neon-gradient hero. The hierarchy is clear, but the visual language reads as “AI/crypto dashboard” rather than a calm financial product. The strategy cards sit below the fold and the top nav is compact but visually low-contrast. The main CTA links work and the page renders without obvious runtime errors.

## Functional observations

The homepage has clear routes to `/account`, `/account/dashboard`, `/academy`, and `/mentorship`. The “View strategy” control is a button that navigates with `window.location.href`, while most other actions are links. The current page does not expose a human-friendly product explanation before the data console beyond the lede and proof row.

## Engineering baseline

`npm run build` succeeds with Next.js 16.2.12 and TypeScript. `npm run lint` fails with 42 errors and 22 warnings, including React effect lint violations, a forbidden require in `src/lib/db.ts`, explicit-any declarations in `src/types/node-sqlite.d.ts`, and several page/component-specific issues. These are tracked as a quality pass after the visual implementation.

## Admin baseline

The admin area has a large 19-item navigation list, currently styled with inline dark slate/teal Tailwind values. It needs grouping, stronger information hierarchy, responsive behavior, and a consistent purple operations identity. The admin layout uses a light gray page shell while the sidebar is dark teal, creating a split visual system. The existing admin APIs and routes should remain compatible while the shell and high-value screens are upgraded.
