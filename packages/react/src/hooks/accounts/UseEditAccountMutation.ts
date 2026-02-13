import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { AccountUpdateInput, EditAccountResponse } from "@/types";

export const useEditAccountMutation = <Response extends EditAccountResponse>(
  options?: UseMutationOptions<Response>,
) => {
  const { loading, trigger } = useMutation<Response>({
    method: "PUT",
    ...options,
  });

  const callMutation = useCallback(
    (accountId: string, data: AccountUpdateInput) => {
      const url = `accounts/${accountId}`;

      trigger(url, data);
    },
    [trigger],
  );

  return { loading, trigger: callMutation };
};
