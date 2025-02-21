import { useQuery, UseQueryOptions } from "@/api";
import { GetAccountUsersResponse } from "@/types";

export const useGetUsersQuery = <Response extends GetAccountUsersResponse>(
  accountId: string,
  parameters?: object,
  options?: UseQueryOptions<Response>,
) => {
  const url = `accounts/${accountId}/users`;

  return useQuery<Response>(url, parameters, options);
};
