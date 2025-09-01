# Required Dependencies for Vue SaaS Package

## Issue

When using the `@prefabs.tech/saas-vue` package in your application, you may encounter errors about missing SuperTokens dependencies:

```
Error: The following dependencies are imported but could not be resolved:
  supertokens-web-js
  supertokens-web-js/recipe/emailverification
  supertokens-web-js/recipe/session
  supertokens-web-js/recipe/userroles
  supertokens-website
```

## Solution

The Vue SaaS package requires these dependencies to be installed in your host application.

### Install Required Dependencies

Run this command in your host application:

```bash
# Using pnpm (recommended)
pnpm add supertokens-web-js supertokens-website @prefabs.tech/vue3-user

# Using npm
npm install supertokens-web-js supertokens-website @prefabs.tech/vue3-user

# Using yarn
yarn add supertokens-web-js supertokens-website @prefabs.tech/vue3-user
```

### Complete Peer Dependencies

For a complete installation, install all peer dependencies:

```bash
pnpm add \
  @prefabs.tech/vue3-config@0.16.0 \
  @prefabs.tech/vue3-i18n@0.16.0 \
  @prefabs.tech/vue3-layout@0.16.0 \
  @prefabs.tech/vue3-ui@0.16.0 \
  @prefabs.tech/vue3-user@0.16.0 \
  @vee-validate/i18n \
  @vee-validate/rules \
  @vueuse/core \
  axios \
  pinia \
  supertokens-web-js \
  supertokens-website \
  vee-validate \
  vue \
  vue-router \
  zod
```

## Why These Dependencies Are Required

### SuperTokens Dependencies

- **`supertokens-web-js`**: Core SuperTokens SDK for authentication
- **`supertokens-website`**: Session management and API integration

### Vue3-User Package

- **`@prefabs.tech/vue3-user`**: Provides authentication components and composables used by the SaaS package

## Verification

After installation, your application should start without dependency resolution errors.

### Check Installation

You can verify the packages are installed by checking your `package.json`:

```json
{
  "dependencies": {
    "@prefabs.tech/vue3-user": "0.16.0",
    "supertokens-web-js": "^0.13.0",
    "supertokens-website": "^20.0.0"
  }
}
```

## Package Size Impact

After proper externalization:

- **Before**: ~1.4MB bundle size
- **After**: ~781KB bundle size (44% reduction)

The SuperTokens dependencies are now properly externalized, reducing the Vue SaaS package bundle size while ensuring proper dependency management.

## Common Issues

### Version Conflicts

If you encounter version conflicts, ensure you're using compatible versions:

- `supertokens-web-js`: `>=0.13.0`
- `supertokens-website`: `>=20.0.0`
- `@prefabs.tech/vue3-user`: `0.16.0`

### Development vs Production

These dependencies are required in both development and production environments.

## Support

If you continue to experience issues after installing these dependencies, please check:

1. ✅ All dependencies are installed
2. ✅ Version compatibility
3. ✅ No package manager conflicts
4. ✅ Clear cache: `pnpm store prune` or `npm cache clean --force`

The Vue SaaS package is now optimized for proper dependency management and should work seamlessly with these peer dependencies installed! 🚀
