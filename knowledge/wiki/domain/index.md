# Domain

Product and business knowledge: what the concepts in the code _mean_ to the business, and the rules that are decisions rather than technical necessities.

This is the section least recoverable from the codebase and therefore the most valuable to fill.

# Tenancy

- [Accounts and account types](accounts.md) - What an account (tenant) is — individual vs organization, slug and custom domain, own schema, account type — and the validation, uniqueness and reservation rules the code enforces.
- [Account roles and membership](account-roles-and-membership.md) - How a user belongs to an account (the account_users row and its account-scoped role), which role each entry path assigns, and how that differs from the user's global SuperTokens roles.
- [Account invitations](account-invitations.md) - What an account invitation is, its derived states (pending, accepted, revoked, expired), and the rules the backend enforces on creating, resending, revoking and accepting one.
