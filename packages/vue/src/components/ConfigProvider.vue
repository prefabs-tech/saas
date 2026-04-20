<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from "vue";

import type { SaasConfig } from "../types/config";

export interface ConfigProviderProperties {
  config: SaasConfig;
}

const props = defineProps<ConfigProviderProperties>();

// Provide the config to child components
provide(Symbol.for("saas.config"), props.config);
</script>
