import { GetAccountUsersResponse } from "@/types";

import { useQuery, UseQueryOptions } from "../../UseQuery";

export const useGetUsersQuery = <Response extends GetAccountUsersResponse>(
  accountId: string,
  parameters?: object,
  options?: UseQueryOptions<Response>,
) => {
  const url = `accounts/${accountId}/users`;

  return useQuery<Response>(url, parameters, options);
};
