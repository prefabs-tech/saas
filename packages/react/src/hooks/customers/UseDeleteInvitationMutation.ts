import { useCallback } from "react";

import { DeleteInvitationResponse } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useDeleteInvitationMutation = <
  Response extends DeleteInvitationResponse,
>(
  options?: Omit<UseMutationOptions<Response>, "method">,
) => {
  const { loading, trigger } = useMutation<Response>({
    method: "DELETE",
    ...options,
  });

  const callMutation = useCallback(
    (customerId: string, invitationId: number) => {
      const url = `customers/${customerId}/invitations/${invitationId}`;

      trigger(url);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
