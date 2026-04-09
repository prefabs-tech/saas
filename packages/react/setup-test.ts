// Intentionally minimal.
// This file exists because `vitest.config.ts` references it via `setupFiles`.
// Add shared test polyfills/mocks here if needed by future tests.

// Silence React 18 act() environment warnings in Vitest/jsdom.
// See https://react.dev/reference/react/act
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
