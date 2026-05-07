import { useQuery, UseQueryOptions } from "@/api";
import { GetInvitationResponse } from "@/types";

export const useGetInvitationQuery = <Response extends GetInvitationResponse>(
  token: string,
  accountId?: null | string,
  options?: UseQueryOptions<Response>,
) => {
  const url = accountId
    ? `accounts/${accountId}/invitations/token/${token}`
    : `invitations/token/${token}`;

  return useQuery<Response>(url, {}, options);
};
