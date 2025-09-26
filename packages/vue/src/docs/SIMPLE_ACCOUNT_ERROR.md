# SimpleAccountError Component

A flexible error component for displaying account-related errors with customizable content and actions.

## Features

- **Slots**: Customizable content and action button
- **Translations**: Supports i18n with English and French translations
- **Default Design**: Falls back to default design when no slots are provided
- **Action Handler**: Provides `goToHome` function to slots

## Usage

### Default Usage (No Slots)

```vue
<template>
  <SimpleAccountError />
</template>
```

This will display the default error message with the default "Go to home page" button.

### Custom Content Slot

```vue
<template>
  <SimpleAccountError>
    <template #content>
      <h2>Custom Error Title</h2>
      <p>Custom error message</p>
      <p>Additional information</p>
    </template>
  </SimpleAccountError>
</template>
```

### Custom Action Slot

```vue
<template>
  <SimpleAccountError>
    <template #action="{ goToHome }">
      <button @click="goToHome">Custom Button Text</button>
      <button @click="handleCustomAction">Another Action</button>
    </template>
  </SimpleAccountError>
</template>
```

### Both Custom Slots

```vue
<template>
  <SimpleAccountError>
    <template #content>
      <h2>Custom Error</h2>
      <p>Custom message</p>
    </template>

    <template #action="{ goToHome }">
      <div class="button-group">
        <button @click="goToHome">Go Home</button>
        <button @click="retry">Retry</button>
        <button @click="contactSupport">Contact Support</button>
      </div>
    </template>
  </SimpleAccountError>
</template>
```

## Translation Keys

The component uses the following translation keys:

- `account.error.title` - Error title
- `account.error.message` - Main error message
- `account.error.support` - Support message
- `account.error.goToHome` - Button text

## Props

None. The component uses slots for customization.

## Slots

- `content` - Custom content for the error message
- `action` - Custom action buttons (receives `goToHome` function)

## Events

None. The component handles navigation internally.
