import { ref } from "vue";

const globalShowAccountError = ref(false);

type ErrorWithResponse = {
  response?: { data?: { error?: { message?: string } }; status?: number };
};

export function useGlobalAccountError() {
  const checkForAccountError = (error: unknown) => {
    const errorWithResponse = error as ErrorWithResponse;

    if (
      errorWithResponse?.response?.status === 404 &&
      errorWithResponse?.response?.data?.error?.message === "Account not found"
    ) {
      globalShowAccountError.value = true;

      return true;
    }

    return false;
  };

  const clearError = () => {
    globalShowAccountError.value = false;
  };

  return {
    checkForAccountError,
    clearError,
    showAccountError: globalShowAccountError,
  };
}
