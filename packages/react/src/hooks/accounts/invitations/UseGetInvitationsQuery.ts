import { GetAccountInvitationsResponse } from "@/types";

import { useQuery, UseQueryOptions } from "../../UseQuery";

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
