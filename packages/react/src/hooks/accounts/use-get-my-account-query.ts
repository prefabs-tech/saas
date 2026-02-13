import { useQuery, UseQueryOptions } from "@/api";
import { GetAccountResponse } from "@/types";

export const useGetMyAccountQuery = <Response extends GetAccountResponse>(
  options?: UseQueryOptions<Response>,
) => {
  const url = `my-account`;

  return useQuery<Response>(url, {}, options);
};
