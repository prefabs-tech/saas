import { useCallback } from "react";

import { RevokeAccountInvitationResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../../UseMutation";

export const useRevokeInvitationMutation = <
  Response extends RevokeAccountInvitationResponse,
>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (accountId: string, invitationId: number) => {
      const url = `accounts/${accountId}/invitations/${invitationId}/revoke`;

      trigger(url);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
