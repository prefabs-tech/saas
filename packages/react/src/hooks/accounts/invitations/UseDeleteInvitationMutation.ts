import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import { DeleteAccountInvitationResponse } from "@/types";

export const useDeleteInvitationMutation = <
  Response extends DeleteAccountInvitationResponse,
>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>({
    method: "DELETE",
    ...options,
  });

  const callMutation = useCallback(
    (accountId: string, invitationId: number) => {
      const url = `accounts/${accountId}/invitations/${invitationId}`;

      trigger(url);
    },
    [trigger],
  );

  return { loading, trigger: callMutation };
};
