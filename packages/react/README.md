# @prefabs.tech/saas-react

This package provides essential tools and components to support SaaS functionality in React applications. It simplifies account management, routing, and configuration for multi-tenant SaaS platforms.

## Installation

Install with npm:

```bash
npm install @prefabs.tech/saas-react
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @prefabs.tech/saas-react
```

## Usage

### Basic setup

To use this package, wrap your application with the `AccountsProvider` component. This provider manages account-related state and configuration.

```typescript
// src/App.tsx
import { AccountsProvider } from "@prefabs.tech/saas-react";
import config from "./config";

function App() {
  return (
    <AccountsProvider
      userId={user?.id}
      config={{
        apiBaseUrl: config.apiBaseUrl,
        autoSelectAccount: true,
        mainAppSubdomain: config.saas.mainAppSubdomain,
        rootDomain: config.saas.rootDomain,
      }}
    >
      <AppRouter />
      <ToastContainer position="bottom-right" />
    </AccountsProvider>
  );
}
```

### Configuration

The `AccountsProvider` accepts a `config` prop to customize its behavior. Below are the available options with detailed explanations:

```typescript
config: {
  accounts?: {
    autoSelectAccount?: boolean; // (default: true) 
    allowMultipleSessions?: boolean; // (default: true) 
    signup?: {
      apiPath?: string;
      termsAndConditionsUrl?: string; 
      appRedirection?: boolean;
    };
  };
  apiBaseUrl: string;
  mainAppSubdomain: string;
  rootDomain: string; 
  multiDatabase: boolean;
  saasAccountRoles?: string[]; 
  subdomains: "required" | "optional" | "disabled";
};
```

### Detailed attribute descriptions

- **`accounts`**: Contains account-specific configurations.
  - **`autoSelectAccount`**: When enabled (default), the system automatically selects an account for the user if they have only one account.
  - **`allowMultipleSessions`**: When enabled (default), users can maintain multiple active sessions across different accounts.
  - **`signup`**: Configuration for signup-related operations.
    - **`apiPath`**: The api path for signup
    - **`termsAndConditionsUrl`**: url for the terms and conditions page.
    - **`appRedirection`**: Indicates whether to redirect to the app after signup.
- **`apiBaseUrl`**: The base url for all api requests.
- **`mainAppSubdomain`**: Specifies the subdomain for the main application.
- **`rootDomain`**: The root domain of your SaaS platform.
- **`multiDatabase`**: Indicates whether the SaaS platform supports multiple databases.
- **`saasAccountRoles`**: A list of roles available for accounts in the SaaS platform. Used when inviting users to an account.
- **`subdomains`**: Specifies the subdomain behavior for the SaaS platform. Options include:
  - `"required"`: Subdomains are mandatory for tenant identification.
  - `"optional"`: Subdomains are optional and can be used if needed.
  - `"disabled"`: Subdomains are not used in the SaaS platform.


### Routing

This package provides pre-configured routes for SaaS applications, designed to simplify navigation in multi-tenant platforms. The two main methods for generating routes are:

#### `getSaasAdminRoutes`
- **Purpose**: Generates routes for the admin section of a SaaS application.
- **Ideal use case**: Use this method in your **Admin App**.
- **Parameters**:
  - `type`: Specifies the type of routes. Options:
    - `"authenticated"` (default): Routes for authenticated users.
    - `"unauthenticated"`: No routes are returned.
    - `"public"`: No routes are returned.
  - `options`: An optional object to customize routes. Following route options are available under `options.routes`:
    - `accountsAdd`: Customizes the "Add Account" route.
    - `accountsEdit`: Customizes the "Edit Account" route.
    - `accountsView`: Customizes the "Viefw Account" route.

#### `getSaasAppRoutes`
- **Purpose**: Generates routes for the main application section of a SaaS platform.
- **Ideal use case**: Use this method in your **Main App**.
- **Parameters**:
  - `type`: Specifies the type of routes. Options:
    - `"authenticated"` (default): Routes for authenticated users.
    - `"unauthenticated"`: Routes for unauthenticated users.
    - `"public"`: Routes for public access.
  - `options`: An optional object to customize routes. Following route options are available under `options.routes`:
    - `accountSettings`: Customizes the "Account Settings" route.
    - `invitationAccept`: Customizes the "Accept Invitation" route.
    - `invitationJoin`: Customizes the "Join Invitation" route.
    - `invitationSignup`: Customizes the "Signup Invitation" route.
    - `myAccounts`: Customizes the "My Accounts" route.
    - `signup`: Customizes the "Signup" route.

### Example usage

```typescript
import { getSaasAdminRoutes, getSaasAppRoutes } from "@prefabs.tech/saas-react/routes";

// Admin App
const adminRoutes = getSaasAdminRoutes();

// Main App
const appRoutes = getSaasAppRoutes();
```

These methods allow you to easily define and manage routes for different sections of your SaaS platform.

### Components and pages

This package provides several reusable components and pages to simplify SaaS application development. Below is a list of all exported components and pages:

#### Components
- **Account components**:
  - `AccountSwitcher`: Allows users to switch between accounts.
  - `AccountForm`: A form for creating or editing account details.
  - `AccountInfo`: Displays detailed information about an account.
  - `AccountInvitationForm`: A form for sending account invitations.
  - `AccountInvitationModal`: A modal for managing account invitations.
  - `AccountInvitationsTable`: Displays a table of account invitations.
  - `AccountSignupForm`: A form for signing up for an account.
  - `AccountUsersTable`: Displays a table of users associated with an account.
  - `AccountsTable`: Displays a table of all accounts.
  - `MyAccounts`: Displays a list of accounts associated with the user.
  - `UserSignupForm`: A form for user signup.

#### Pages
- **AcceptInvitation pages**:
  - `AcceptInvitation`: Handles the process of accepting an invitation to join or signup to an account.
  - `JoinInvitation`: Manages the process of joining an account via an invitation.
  - `SignupInvitation`: Facilitates signing up for an account through an invitation.

- **Account pages**:
  - `AccountAdd`: Provides a page for adding a new account.
  - `AccountEdit`: Allows editing of existing account details.
  - `AccountSettings`: Displays and manages account information including user and invitations.
  - `AccountView`: Shows detailed information about a specific account.

- **MyAccounts pages**:
  - `MyAccountsPage`: Displays a list of accounts associated with the user and allows account switching or management.

- **Signup pages**:
  - `SignupPage`: Facilitates user signup and account creation processes. Dynamically renders either an `AccountSignupForm` or `UserSignupForm` based on the app context (main app or user app).

These components and pages can be imported and used directly in your application.


### i18n support

This package uses `@prefabs.tech/react-i18n` for translations. By default, it uses the following namespaces:

- `account`
- `accounts`

These namespaces are available in the following locales:

- **English (`en`)**: `locales/en/account.json`, `locales/en/accounts.json`
- **French (`fr`)**: `locales/fr/account.json`, `locales/fr/accounts.json`

Ensure you register these namespaces in your application's i18n setup.

Refer to the `locales/en` and `locales/fr` folders for the required translation keys.

## Contributing

Contributions are welcome! Please follow the guidelines in the repository to submit issues or pull requests.
