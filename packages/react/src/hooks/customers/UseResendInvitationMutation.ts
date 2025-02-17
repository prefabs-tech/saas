import { useCallback } from "react";

import { ResendInvitationResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useResendInvitationMutation = <
  Response extends ResendInvitationResponse,
>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (customerId: string, invitationId: number) => {
      const url = `customers/${customerId}/invitations/${invitationId}/resend`;

      trigger(url);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
