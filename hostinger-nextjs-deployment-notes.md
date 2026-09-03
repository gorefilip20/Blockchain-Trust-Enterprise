# Hostinger Next.js deployment notes

Source: https://docs.hostinger.com/node.js/overview-1/next

Hostinger's dedicated Next.js documentation says Node.js apps use server mode, Hostinger applies `output: "standalone"` automatically, and the hPanel settings should be: application type `next`, build script `build`, output directory `.next`, and no entry file because it is ignored for Next.js. The package scripts should use `next build` and `next start`. Node 20 or newer is required. Hostinger warns that a function-based Next config can cause the error `Next.js build produced no standalone server or static output`; this repository exports a config object.

Source: https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/

Hostinger supports importing or manually adding environment variables and notes that changes may require redeployment. Secrets should not be committed to GitHub.
