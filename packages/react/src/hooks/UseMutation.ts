import { useCallback, useState } from "react";

import client from "@/api/axios";

import { useConfig } from "./UseConfig";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseMutationOptions<T = any> = {
  method?: "POST" | "PUT" | "DELETE" | "PATCH";
  withCredentials?: boolean;
  onError?: (error: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onSuccess?: (response: T) => void;
};

export const useMutation = <MutationResponse>(
  options?: UseMutationOptions<MutationResponse>,
) => {
  const {
    method = "POST",
    withCredentials = true,
    onError,
    onSuccess,
  } = options || {};

  const [loading, setLoading] = useState(false);

  const { apiBaseUrl } = useConfig();

  const trigger = useCallback((url: string, data?: object) => {
    setLoading(true);

    client(apiBaseUrl)
      .request({
        url,
        method,
        data,
        withCredentials,
      })
      .then(({ data }) => {
        if ("status" in data && data.status === "ERROR") {
          onError && onError(data);
        } else {
          onSuccess && onSuccess(data as MutationResponse);
        }
      })
      .catch((error) => onError && onError(error))
      .finally(() => setLoading(false));
  }, []);

  return { loading, trigger };
};
