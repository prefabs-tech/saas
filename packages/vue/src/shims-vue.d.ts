declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue' {
  export * from '@vue/runtime-core';
}

declare module 'vue-router' {
  export * from 'vue-router/dist/vue-router';
}

declare module 'vue-i18n' {
  export * from 'vue-i18n/dist/vue-i18n';
}

declare module 'pinia' {
  export * from 'pinia/dist/pinia';
} 