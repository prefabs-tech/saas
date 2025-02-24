import { useQuery, UseQueryOptions } from "@/api";
import { GetAccountResponse } from "@/types";

export const useGetAccountQuery = <Response extends GetAccountResponse>(
  accountId: string,
  options?: UseQueryOptions<Response>,
) => {
  const url = `accounts/${accountId}`;

  return useQuery<Response>(url, {}, options);
};
