import { ref } from "vue";

export function useSimpleAccountError() {
  const showAccountError = ref(false);

  const checkForAccountError = (error: any) => {
    // Check for the specific error pattern
    if (
      error?.response?.status === 404 &&
      error?.response?.data?.error?.message === "Account not found"
    ) {
      showAccountError.value = true;
      return true;
    }
    return false;
  };

  const clearError = () => {
    showAccountError.value = false;
  };

  return {
    showAccountError,
    checkForAccountError,
    clearError,
  };
}
