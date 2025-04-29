<template>
  <form class="account-form">
    <h1>Account Form TODO</h1>
  </form>
</template>

<script setup lang="ts">
// import { ref, watch, computed } from "vue";
// import { useI18n } from "@dzangolab/vue3-i18n";
// import { useConfig } from "../../composables/useConfig";
// import type { Account, AccountInput } from "../../types/account";
// import type { PropType } from "vue";

// const props = defineProps({
//   loading: Boolean,
//   account: {
//     default: undefined,
//     type: Object as PropType<Account>,
//   },
//   isEditForm: {
//     default: false,
//     type: Boolean,
//   },
// });

// const emit = defineEmits(["cancel", "submit"]);

// const { t } = useI18n();

// const config = useConfig();

// const formData = ref<AccountInput>({
//   name: props.account?.name || "",
//   individual: props.account?.individual || false,
//   registeredNumber: props.account?.registeredNumber || "",
//   taxId: props.account?.taxId || "",
//   slug: props.account?.slug || "",
//   domain: props.account?.domain || "",
//   useSeparateDatabase: !!props.account?.database,
// });

// const errors = ref<Record<string, string>>({});

// const subdomains = computed(() => config.subdomains);
// const multiDatabase = computed(() => config.multiDatabase);

// watch(
//   () => formData.value.slug,
//   (newSlug) => {
//     if (!newSlug) {
//       formData.value.useSeparateDatabase = false;
//       formData.value.domain = "";
//     }
//   }
// );

// const validateForm = () => {
//   errors.value = {};

//   if (!formData.value.name) {
//     errors.value.name = t("form.validations.name.required");
//   } else if (formData.value.name.length > 255) {
//     errors.value.name = t("form.validations.name.invalid");
//   }

//   if (
//     formData.value.registeredNumber &&
//     formData.value.registeredNumber.length > 255
//   ) {
//     errors.value.registeredNumber = t(
//       "form.validations.registeredNumber.invalid"
//     );
//   }

//   if (formData.value.taxId && formData.value.taxId.length > 255) {
//     errors.value.taxId = t("form.validations.taxId.invalid");
//   }

//   if (formData.value.slug) {
//     const slugRegex = /^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/;
//     if (!slugRegex.test(formData.value.slug)) {
//       errors.value.slug = t("form.validations.slug.invalid");
//     }
//   }

//   if (formData.value.domain) {
//     const domainRegex = /^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/;
//     if (!domainRegex.test(formData.value.domain)) {
//       errors.value.domain = t("form.validations.domain.invalid");
//     }
//   }

//   return Object.keys(errors.value).length === 0;
// };

// const handleSubmit = () => {
//   if (validateForm()) {
//     emit("submit", formData.value);
//   }
// };

// const handleCancel = () => {
//   emit("cancel");
// };
</script>

<style></style>
