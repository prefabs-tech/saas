import { useCallback, useState } from "react";

import { useConfig } from "@/hooks";

import { client } from "../axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseMutationOptions<R = any, D = any> = {
  method?: "DELETE" | "PATCH" | "POST" | "PUT";
  onError?: (error: any, request?: UseMutationRequestObject<D>) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onSuccess?: (response: R, request?: UseMutationRequestObject<D>) => void;
  withCredentials?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseMutationRequestObject<D = any> = {
  data?: D;
  method: "DELETE" | "PATCH" | "POST" | "PUT";
  url: string;
  withCredentials: boolean;
};

export const useMutation = <MutationResponse = any, MutationData = any>( // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: UseMutationOptions<MutationResponse, MutationData>,
) => {
  const {
    method = "POST",
    onError,
    onSuccess,
    withCredentials = true,
  } = options || {};

  const [loading, setLoading] = useState(false);

  const { apiBaseUrl } = useConfig();

  const trigger = useCallback(
    (url: string, data?: MutationData) => {
      setLoading(true);

      const requestObject = {
        data,
        method,
        url,
        withCredentials,
      };

      client(apiBaseUrl)
        .request(requestObject)
        .then((response) => {
          if ("status" in response.data && response.data.status === "ERROR") {
            onError && onError(response, requestObject);
          } else {
            onSuccess &&
              onSuccess(response.data as MutationResponse, requestObject);
          }
        })
        .catch((error) => onError && onError(error))
        .finally(() => setLoading(false));
    },
    [apiBaseUrl, method, withCredentials, onError, onSuccess],
  );

  return { loading, trigger };
};
