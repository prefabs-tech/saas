import { GetInvitationResponse } from "@/types";

import { useQuery, UseQueryOptions } from "../UseQuery";

export const useGetInvitationQuery = <Response extends GetInvitationResponse>(
  token: string,
  customerId?: string | null,
  options?: UseQueryOptions<Response>,
) => {
  const url = customerId
    ? `customers/${customerId}/invitations/token/${token}`
    : `invitations/token/${token}`;

  return useQuery<Response>(url, {}, options);
};
