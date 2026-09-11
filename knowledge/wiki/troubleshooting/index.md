# Troubleshooting

Symptom → cause → fix. Add an entry whenever something costs you more than a few minutes to diagnose; the next person is usually you.

# Symptoms

- [API returns 404 "Account not found"](account-not-found-404.md) - Symptom → cause → fix for 404 {"error":{"message":"Account not found"}} from a saas-fastify API, and for the frontends' "unregistered domain" / not-found screens that it produces.
- [Main-app sign-up does not create an account](signup-does-not-create-account.md) - Symptom → cause → fix when signing up on the main app creates a user but no account (or the form shows user fields only), which comes from exact host matching against mainApp.domain on both backend and frontend.
- [Tenant migrations skipped at boot](tenant-migrations-skipped-at-boot.md) - Symptom → cause → fix when the API logs "Account migrations path ... does not exists." and tenant schemas are missing tables or new per-account migrations.
