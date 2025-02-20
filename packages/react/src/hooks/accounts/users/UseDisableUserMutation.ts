import { useCallback } from "react";

import { DisableAccountUserResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../../UseMutation";

export const useDisableUserMutation = <
  Response extends DisableAccountUserResponse,
>(
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
