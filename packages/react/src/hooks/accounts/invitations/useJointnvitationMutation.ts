import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { AcceptInvitationResponse } from "@/types";

export const useJoinInvitationMutation = <Response = AcceptInvitationResponse>(
  options?: UseMutationOptions<Response, undefined>,
) => {
  const { loading, trigger } = useMutation<Response, undefined>({
    withCredentials: false,
    ...options,
  });

  const callMutation = useCallback(
    (token: string, accountId: string | null) => {
      const url = `accounts/${accountId}/invitations/token/${token}`;

      trigger(url);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
