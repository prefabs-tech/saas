import { useCallback } from "react";

import { AddInvitationResponse, CustomerInvitationCreateInput } from "@/types";

import { useMutation, UseMutationOptions } from "../UseMutation";

export const useAddInvitationMutation = <
  Response extends AddInvitationResponse,
>(
  options: UseMutationOptions<Response>,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (customerId: string, data: CustomerInvitationCreateInput) => {
      const url = `customers/${customerId}/invitations`;

      trigger(url, data);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
