import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { AcceptInvitationResponse, UserSignupData } from "@/types";

export const useSignupInvitationMutation = <
  Response = AcceptInvitationResponse,
  Data = UserSignupData,
>(
  options?: UseMutationOptions<Response, Data>,
) => {
  const { loading, trigger } = useMutation<Response, Data>({
    withCredentials: false,
    ...options,
  });

  const callMutation = useCallback(
    (token: string, data: Data, accountId?: null | string) => {
      const url = accountId
        ? `accounts/${accountId}/invitations/token/${token}`
        : `invitations/token/${token}`;

      trigger(url, data);
    },
    [trigger],
  );

  return { loading, trigger: callMutation };
};
