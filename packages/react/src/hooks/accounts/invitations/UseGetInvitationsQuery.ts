import { useQuery, UseQueryOptions } from "@/api";
import { GetAccountInvitationsResponse } from "@/types";

export const useGetInvitationsQuery = <
  Response extends GetAccountInvitationsResponse,
>(
  accountId: string,
  parameters?: object,
  options?: UseQueryOptions<Response>,
) => {
  const url = `accounts/${accountId}/invitations`;

  return useQuery<Response>(url, parameters, options);
};
