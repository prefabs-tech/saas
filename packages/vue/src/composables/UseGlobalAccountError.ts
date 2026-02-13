import { ref } from "vue";

const globalShowAccountError = ref(false);

type ErrorWithResponse = {
  response?: { status?: number; data?: { error?: { message?: string } } };
};

export function useGlobalAccountError() {
  const checkForAccountError = (error: unknown) => {
    const err = error as ErrorWithResponse;

    if (
      err?.response?.status === 404 &&
      err?.response?.data?.error?.message === "Account not found"
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
    showAccountError: globalShowAccountError,
    checkForAccountError,
    clearError,
  };
}
