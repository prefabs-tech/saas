import { useCallback, useState } from "react";

import client from "@/api/axios";

import { useConfig } from "./UseConfig";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseMutationRequestObject<D = any> = {
  url: string;
  method: "POST" | "PUT" | "DELETE" | "PATCH";
  withCredentials: boolean;
  data?: D;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseMutationOptions<R = any, D = any> = {
  method?: "POST" | "PUT" | "DELETE" | "PATCH";
  withCredentials?: boolean;
  onError?: (error: any, request?: UseMutationRequestObject<D>) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onSuccess?: (response: R, request?: UseMutationRequestObject<D>) => void;
};

export const useMutation = <MutationResponse = any, MutationData = any>( // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: UseMutationOptions<MutationResponse, MutationData>,
) => {
  const {
    method = "POST",
    withCredentials = true,
    onError,
    onSuccess,
  } = options || {};

  const [loading, setLoading] = useState(false);

  const { apiBaseUrl } = useConfig();

  const trigger = useCallback((url: string, data?: MutationData) => {
    setLoading(true);

    const requestObject = {
      url,
      method,
      data,
      withCredentials,
    };

    client(apiBaseUrl)
      .request(requestObject)
      .then(({ data }) => {
        if ("status" in data && data.status === "ERROR") {
          onError && onError(data, data);
        } else {
          onSuccess && onSuccess(data as MutationResponse, requestObject);
        }
      })
      .catch((error) => onError && onError(error))
      .finally(() => setLoading(false));
  }, []);

  return { loading, trigger };
};
