import { useCallback } from "react";

import { DisableUserResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useDisableUserMutation = <Response extends DisableUserResponse>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback((customerId: string, userId: string) => {
    const url = `customers/${customerId}/users/${userId}/disable`;

    trigger(url);
  }, []);

  return { loading, trigger: callMutation };
};
