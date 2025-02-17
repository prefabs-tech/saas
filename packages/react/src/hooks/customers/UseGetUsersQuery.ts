import { GetUsersResponse } from "@/types";

import { useQuery, UseQueryOptions } from "../UseQuery";

export const useGetUsersQuery = <Response extends GetUsersResponse>(
  customerId: string,
  parameters?: object,
  options?: UseQueryOptions<Response>,
) => {
  const url = `customers/${customerId}/users`;

  return useQuery<Response>(url, parameters, options);
};
