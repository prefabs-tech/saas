import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { ResendAccountInvitationResponse } from "@/types";

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
