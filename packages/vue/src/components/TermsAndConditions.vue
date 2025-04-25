<template>
  <div v-if="hasCheckbox" :class="`field ${name}`">
    <div class="input-field-checkbox">
      <Checkbox :name="name" :label="label" @update:model-value="onChange" />

      <slot></slot>
    </div>
  </div>
  <p v-else :class="name" :aria-label="name">
    <slot>
      {{ label }}
    </slot>
  </p>
</template>

<script lang="ts">
export default {
  name: "TermsAndConditions",
};
</script>

<script setup lang="ts">
import { Checkbox } from "@dzangolab/vue3-form";

defineProps({
  hasCheckbox: {
    default: true,
    type: Boolean,
  },
  label: {
    default: undefined,
    required: false,
    type: String,
  },
  name: {
    default: "terms-and-conditions",
    type: String,
  },
});

const emit = defineEmits(["update:check"]);

const onChange = (value: boolean) => {
  emit("update:check", value);
};
</script>
<style lang="css">
.input-field-checkbox {
  align-items: baseline;
  color: #525252;
  display: flex;
  font-size: 14px;
  gap: 0.5rem;
  line-height: 1.35;
}

.input-field-checkbox input {
  width: fit-content;
}
</style>
