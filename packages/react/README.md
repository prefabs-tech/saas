# @12deg/saas-react

Support saas for react app.

## Installation

Install with npm:

```bash
npm install @12deg/saas-react
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @12deg/saas-react
```

## Usage

```typescript
// src/App.tsx
import { AccountsProvider } from "@12deg/saas-react";

import config from "./config";

  // ...
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
  // ...
```

## Configuration

### All configurations can be done with the config prop to AccountsProvider component.

#### Congifuration options

```
config: {
  apiBaseUrl: string;
  mainAppSubdomain: string;
  rootDomain: string;
  autoSelectAccount?: boolean; // default true
  allowMultipleSessions?: boolean; // default true
  customStorageKey?: string; // default "x-cusomter-id"
};
```

## i18n

This package usage @dzangolab/react-i18n for translations. By default, components in this package uses `accounts` namespace for its translations. You'll need to register this names space in you application's i18n setup. See `locales/en/accounts.json` for required translation keys
