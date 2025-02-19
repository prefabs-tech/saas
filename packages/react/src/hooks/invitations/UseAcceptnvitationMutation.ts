import { useCallback } from "react";

import { AcceptInvitationResponse, UserSignupData } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useAcceptInvitationMutation = <
  Response extends AcceptInvitationResponse,
>(
  options?: UseMutationOptions<Response>,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (token: string, data: UserSignupData, customerId?: string | null) => {
      const url = customerId
        ? `customers/${customerId}/invitations/token/${token}`
        : `invitations/token/${token}`;

      trigger(url, data);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
