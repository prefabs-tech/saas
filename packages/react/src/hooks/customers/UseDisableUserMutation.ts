import { useCallback } from "react";

import { DisableUserResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useDisableUserMutation = <Response extends DisableUserResponse>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>({
    method: "PUT",
    ...options,
  });

  const callMutation = useCallback((userId: string) => {
    const url = `users/${userId}/disable`;

    trigger(url);
  }, []);

  return { loading, trigger: callMutation };
};
