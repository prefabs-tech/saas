<!-- Structured feature inventory — used by automated test generation. Developer docs: see GUIDE.md -->

# Features: `@prefabs.tech/saas-fastify`

## Plugin Registration

1. **Main plugin registration** — `fastify.register(saasPlugin)` runs core-table migrations, creates SuperTokens SAAS roles (`onReady`), registers account discovery, and conditionally registers all route groups.
2. **Account migration plugin** — `accountMigrationPlugin` is a separately exported plugin that iterates all accounts and runs per-account schema migrations; skips silently if the migrations path does not exist on disk.
3. **Pre-built SuperTokens recipes config** — `supertokensRecipesConfig` is a ready-made object covering `emailVerification`, `session`, and `thirdPartyEmailPassword` recipes with all SaaS-aware overrides applied.

## Account Discovery Middleware

4. **`onRequest` hook — account resolution** — on every request, resolves `request.account` from either the request hostname (subdomain-based) or the `x-account-id` header (header-based), depending on `subdomains` mode.
5. **App domain bypass** — requests whose hostname matches a configured `apps[]` entry skip account discovery entirely and are logged as belonging to that app.
6. **Route exclusion patterns** — requests matching any pattern in `excludeRoutePatterns` (default: `/`, `/auth/*`, `/me`, `/invitation/token/`) skip account discovery.
7. **Per-route exclusion** — individual routes can opt out of account discovery via `config.saas.exclude: true` in `FastifyContextConfig`.
8. **`request.dbSchema` assignment** — when an account has a `database` field, `request.dbSchema` is set to that value for per-account schema routing.
9. **`request.authEmailPrefix` assignment** — when an account has a `slug`, `request.authEmailPrefix` is set to `${account.id}_` for user email isolation.
10. **404 on undiscoverable account** — if account discovery throws (account not found), the middleware replies `404 { error: { message: "Account not found" } }`.

## Account Management Routes

11. **Account routes (`accountRoutes`)** — registers REST routes for: `GET /accounts`, `GET /accounts/:id`, `GET /accounts/me`, `GET /accounts/my-accounts`, `POST /accounts`, `PUT /accounts/:id`, `PUT /accounts/me`, `DELETE /accounts/:id`.
12. **Disable accounts routes** — set `config.saas.routes.accounts.disabled: true` to skip registering account routes.
13. **Custom account handlers** — every account handler can be replaced via `config.saas.handlers.account.*` (create, delete, getById, list, myAccount, myAccounts, update, updateMyAccount).

## Account Invitation Routes

14. **Invitation routes (`accountInvitationRoutes`)** — registers REST routes for: create, list, getByAccountId, getByToken, join, signup, resend, revoke, remove.
15. **Disable invitation routes** — set `config.saas.routes.accountInvitations.disabled: true`.
16. **Custom invitation handlers** — all invitation handlers are replaceable via `config.saas.handlers.accountInvitation.*`.
17. **One-active-invite enforcement** — `AccountInvitationService.preCreate` rejects creation if a non-expired, non-revoked, non-accepted invite already exists for the same email + account.
18. **Invitation accept link path** — default path `/invitation/token/:token?accountId=:accountId`; override via `config.saas.invitation.acceptLinkPath`.
19. **Invitation email subject/template override** — override via `config.saas.invitation.emailOverrides.subject` and `.templateName`.
20. **Post-accept callback** — `config.saas.invitation.postAccept` is called after a user accepts an invitation.

## Account User Routes

21. **Account user routes (`accountUserRoutes`)** — registers REST routes for: list, getByAccountId.
22. **Disable account user routes** — set `config.saas.routes.accountUsers.disabled: true`.
23. **Custom account user handlers** — replaceable via `config.saas.handlers.accountUser.*`.

## Account Type Routes

24. **Account type routes** — registers REST routes for: all, list, getById, create, update, remove.
25. **Disable account type routes** — set `config.saas.routes.accountTypes.disabled: true`.
26. **Custom account type handlers** — replaceable via `config.saas.handlers.accountType.*`.
27. **Transactional i18n creation** — `AccountTypeService.createWithI18ns` creates the account type and its i18n rows in a single transaction.
28. **Transactional i18n update** — `AccountTypeService.updateWithI18ns` replaces all i18n rows transactionally.

## Subdomains & Domain Routing

29. **`subdomains` mode** — three-value enum (`"disabled"` / `"optional"` / `"required"`) controlling whether slugs/domains are stored on accounts and whether hostname-based discovery is active.
30. **Root domain** — `config.saas.rootDomain` is required; used to compute default `mainApp.domain` and per-app domains.
31. **Main app domain** — defaults to `app.${rootDomain}`; override with `config.saas.mainApp.subdomain` or `config.saas.mainApp.domain`.
32. **Deprecated `mainAppSubdomain`** — `config.saas.mainAppSubdomain` is supported but deprecated in favour of `mainApp.subdomain`.
33. **`skipHostnameCheck`** — when `subdomains === "disabled"`, `mainApp.skipHostnameCheck` defaults to `true`; account discovery falls back to header-only mode.
34. **Invalid slugs list** — `config.saas.invalid.slugs` (default `["admin"]`) prevents reserved values from being used as account slugs.
35. **Invalid domains list** — `config.saas.invalid.domains` (default `[]`) prevents specified domains from being registered.

## Multi-Database Support

36. **`multiDatabase.mode`** — three-value enum (`"disabled"` / `"optional"` / `"required"`) controlling per-account Postgres schema creation.
37. **Schema name generation** — when a separate schema is needed, a unique 8-char `s_<nanoid>` name is generated using `[a-z0-9]` alphabet.
38. **`useSeparateDatabase` flag** — `AccountCreateInput.useSeparateDatabase` opt-in field for when `multiDatabase.mode === "optional"`.
39. **Per-account migrations path** — defaults to `${slonik.migrations.path ?? "migrations"}/accounts`; override via `config.saas.multiDatabase.migrations.path`.
40. **Migration path existence check** — `accountMigrationPlugin` logs a warning and skips if the migrations path does not exist.

## SuperTokens Auth Overrides

41. **Email prefix isolation** — on sign-up, the user's email is stored as `${authEmailPrefix}${email}` in SuperTokens to isolate users per account.
42. **Role validation on sign-up** — `emailPasswordSignUp` checks that all requested roles exist before proceeding; throws `SIGN_UP_FAILED` (500) if any role is missing.
43. **AccountUser record creation on sign-up** — links the new SuperTokens user to the account in the `__account_users` table with the specified role (defaults to `ROLE_SAAS_ACCOUNT_MEMBER`).
44. **User profile local DB creation on sign-up** — creates a user record in the local DB; rolls back the SuperTokens user (`deleteUser`) if local creation fails.
45. **Email verification on sign-up** — if `config.user.features.signUp.emailVerification` is enabled, sends a verification email; skips if `userContext.autoVerifyEmail` is true (auto-verifies instead).
46. **Duplicate email warning** — if `config.user.supertokens.sendUserAlreadyExistsWarning` is true and the email already exists, sends a duplicate-email warning email.
47. **Soft-deleted user session block** — `verifySession` revokes session and throws `SESSION_VERIFICATION_FAILED` (401) if the user has `deletedAt` set.
48. **Disabled user session block** — `verifySession` revokes session and throws `SESSION_VERIFICATION_FAILED` (401) if the user has `disabled: true`.
49. **Soft-deleted/disabled sign-in block** — `createNewSession` throws `SIGN_IN_FAILED` (401) before creating a session if the user is deleted or disabled.
50. **ProfileValidationClaim on session creation** — if `config.user.features.profileValidation.enabled` is true, `ProfileValidationClaim` is fetched and set on the new session.
51. **SuperTokens roles created on startup** — `SAAS_ACCOUNT_ADMIN`, `SAAS_ACCOUNT_OWNER`, `SAAS_ACCOUNT_MEMBER` are created/ensured via `onReady` hook.

## GraphQL API

52. **Account GraphQL schema (`accountSchema`)** — exports a `DocumentNode` with types: `Account`, `Accounts`, `AccountCreateInput`, `AccountUpdateInput`, and queries/mutations with `@auth` directives.
53. **Account GraphQL resolver (`accountResolver`)** — implements `Query.account`, `Query.accounts`, `Mutation.createAccount`, `Mutation.deleteAccount`, `Mutation.updateAccount`.
54. **Merged schema export** — `graphql/schema.ts` exports `mergeTypeDefs([accountSchema])` for use with Mercurius.

## Service Layer

55. **`AccountService`** — extends `BaseService`; adds `findByHostname`, `findByUserId`, `validateSlugOrDomain`; `preCreate` validates/strips slug/domain, generates DB schema name; `postCreate` runs per-account migrations.
56. **`AccountInvitationService`** — extends `AccountAwareBaseService`; adds `findOneByToken` (with UUID validation and account name enrichment); `preCreate` enforces single-active-invite-per-email-per-account.
57. **`AccountUserService`** — extends `AccountAwareBaseService`; adds `getUsers()` to fetch users joined across accounts.
58. **`AccountTypeService`** — extends `BaseService`; adds `createWithI18ns` and `updateWithI18ns` for transactional i18n row management.
59. **`AccountAwareBaseService`** — abstract base service that stores `accountId` and propagates it to the SQL factory on every query; accepts optional `schema` for multi-database routing.
60. **`AccountAwareSqlFactory`** — extends `DefaultSqlFactory`; injects `table.account_id = $accountId` into all WHERE clauses via `getAdditionalFilterFragments`; `applyAccountIdFilter` flag disables per-query.

## Module Augmentations & Type Exports

61. **`FastifyRequest.account`** — typed as `Account | undefined`; populated by account discovery middleware.
62. **`FastifyRequest.authEmailPrefix`** — typed as `string | undefined`; set to `${account.id}_` when slug is present.
63. **`FastifyInstance.verifySession`** — decorated with SuperTokens `verifySession` function.
64. **`FastifyContextConfig.saas.exclude`** — boolean flag to exclude a specific route from account discovery.
65. **`MercuriusContext.config` / `.database`** — typed as `ApiConfig` and `Database` respectively.
66. **`ApiConfig.saas`** — module augmentation extending `@prefabs.tech/fastify-config` with `SaasConfig`.

## Constants

67. **`ACCOUNT_HEADER_NAME`** — `"x-account-id"` — the HTTP header used for header-based account resolution.
68. **`ACCOUNT_INVITATION_ACCEPT_LINK_PATH`** — default invitation accept link path template.
69. **`ROLE_SAAS_ACCOUNT_ADMIN`**, **`ROLE_SAAS_ACCOUNT_OWNER`**, **`ROLE_SAAS_ACCOUNT_MEMBER`** — role name constants.
70. **`NANOID_ALPHABET`** / **`NANOID_SIZE`** — alphabet and length used for schema name generation.
