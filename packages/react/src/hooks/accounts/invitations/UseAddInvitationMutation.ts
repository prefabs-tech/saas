import { useCallback } from "react";

import { useMutation, UseMutationOptions } from "@/api";
import {
  AddAccountInvitationResponse,
  AccountInvitationCreateInput,
} from "@/types";

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
