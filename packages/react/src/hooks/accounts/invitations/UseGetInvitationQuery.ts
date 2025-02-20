import { GetInvitationResponse } from "@/types";

import { useQuery, UseQueryOptions } from "../../UseQuery";

export const useGetInvitationQuery = <Response extends GetInvitationResponse>(
  token: string,
  accountId?: string | null,
  options?: UseQueryOptions<Response>,
) => {
  const url = accountId
    ? `accounts/${accountId}/invitations/token/${token}`
    : `invitations/token/${token}`;

  return useQuery<Response>(url, {}, options);
};
