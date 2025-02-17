import { useCallback } from "react";

import { RevokeInvitationResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useRevokeInvitationMutation = <
  Response extends RevokeInvitationResponse,
>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (customerId: string, invitationId: number) => {
      const url = `customers/${customerId}/invitations/${invitationId}/revoke`;

      trigger(url);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
