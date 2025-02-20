import { useCallback } from "react";

import {
  AddAccountInvitationResponse,
  AccountInvitationCreateInput,
} from "@/types";

import { useMutation, UseMutationOptions } from "../../UseMutation";

export const useAddInvitationMutation = <
  Response extends AddAccountInvitationResponse,
>(
  options?: UseMutationOptions<Response>,
) => {
  const { loading, trigger } = useMutation<Response>(options);

  const callMutation = useCallback(
    (accountId: string, data: AccountInvitationCreateInput) => {
      const url = `accounts/${accountId}/invitations`;

      trigger(url, data);
    },
    [],
  );

  return { loading, trigger: callMutation };
};
