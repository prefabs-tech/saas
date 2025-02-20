import { useCallback } from "react";

import { ResendAccountInvitationResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../../UseMutation";

export const useResendInvitationMutation = <
  Response extends ResendAccountInvitationResponse,
>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (accountId: string, invitationId: number) => {
      const url = `accounts/${accountId}/invitations/${invitationId}/resend`;

      trigger(url);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
