import { useCallback } from "react";

import { EnableUserResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useEnableUserMutation = <Response extends EnableUserResponse>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback((customerId: string, userId: string) => {
    const url = `customers/${customerId}/users/${userId}/enable`;

    trigger(url);
  }, []);

  return { loading, trigger: callMutation };
};
