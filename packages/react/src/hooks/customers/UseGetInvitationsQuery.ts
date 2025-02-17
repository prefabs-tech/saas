import { GetInvitationsResponse } from "@/types";

import { useQuery, UseQueryOptions } from "../UseQuery";

export const useGetInvitationsQuery = <Response extends GetInvitationsResponse>(
  customerId: string,
  parameters?: object,
  options?: UseQueryOptions<Response>,
) => {
  const url = `customers/${customerId}/invitations`;

  return useQuery<Response>(url, parameters, options);
};
