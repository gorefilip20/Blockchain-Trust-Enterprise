# Security and admin audit checkpoint

The original `/api/stats` endpoint returned dashboard data with no authorization header. It now requires a valid admin bearer token and returns HTTP 401 when unauthenticated. A short-lived local audit token was accepted with HTTP 200, confirming the guarded contract works.

`AdminGuard` previously trusted any value in `localStorage`; it now validates the token against `/api/admin/auth`, clears invalid session storage, and redirects to `/admin/login`. The admin dashboard now sends its bearer token when loading stats.

A temporary audit session is currently seeded in the local browser only to inspect the guarded dashboard. No real credentials were used and no token is intended for commit.
