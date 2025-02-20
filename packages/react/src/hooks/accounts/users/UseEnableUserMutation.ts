import { useCallback } from "react";

import { EnableAccountUserResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../../UseMutation";

export const useEnableUserMutation = <
  Response extends EnableAccountUserResponse,
>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>({
    method: "PUT",
    ...options,
  });

  const callMutation = useCallback((userId: string) => {
    const url = `users/${userId}/enable`;

    trigger(url);
  }, []);

  return { loading, trigger: callMutation };
};
