import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { EnableAccountUserResponse } from "@/types";

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
