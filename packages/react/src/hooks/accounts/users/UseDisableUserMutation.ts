import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { DisableAccountUserResponse } from "@/types";

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
