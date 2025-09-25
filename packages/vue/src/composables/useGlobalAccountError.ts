import { ref } from "vue";

// Global state for account error
const showAccountError = ref(false);

export function useGlobalAccountError() {
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
