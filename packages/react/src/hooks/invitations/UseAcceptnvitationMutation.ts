import { useCallback } from "react";

import { AcceptInvitationResponse, UserSignupData } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useAcceptInvitationMutation = <
  Response = AcceptInvitationResponse,
  Data = UserSignupData,
>(
  options?: UseMutationOptions<Response, Data>,
) => {
  const { loading, trigger } = useMutation<Response, Data>(options);

  const callMutation = useCallback(
    (token: string, data: Data, customerId?: string | null) => {
      const url = customerId
        ? `customers/${customerId}/invitations/token/${token}`
        : `invitations/token/${token}`;

      trigger(url, data);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
