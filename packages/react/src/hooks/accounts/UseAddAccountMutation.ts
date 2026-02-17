import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { AccountCreateInput, AddAccountResponse } from "@/types";

export const useAddAccountMutation = <Response extends AddAccountResponse>(
  options?: UseMutationOptions<Response>,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (data: AccountCreateInput) => {
      const url = `accounts`;

      trigger(url, data);
    },
    [trigger],
  );

  return { loading, trigger: callMutation };
};
