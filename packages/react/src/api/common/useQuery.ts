import { useCallback, useEffect, useState } from "react";

import { encodeURIParameter } from "@/api/utils";
import { useConfig } from "@/hooks";

import { client } from "../axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseQueryOptions<T = any> = {
  lazy?: boolean;
  skip?: boolean;
  onError?: (error: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onSuccess?: (response: T) => void;
};

export const useQuery = <QueryResponse>(
  url: string,
  parameters?: object,
  options?: UseQueryOptions<QueryResponse>,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<QueryResponse>();

  const { apiBaseUrl } = useConfig();

  const { lazy = false, skip = false, onError, onSuccess } = options || {};

  const parametersString =
    parameters && Object.keys(parameters).length
      ? encodeURIParameter(parameters)
      : "";

  const trigger = useCallback(() => {
    setLoading(true);

    client(apiBaseUrl)
      .get(url, {
        params: parametersString,
      })
      .then((response) => {
        if ("status" in response.data && response.data.status === "ERROR") {
          setError(response);
          onError && onError(response);
        } else {
          setData(response.data as QueryResponse);
          onSuccess && onSuccess(response.data as QueryResponse);
        }
      })
      .catch((error) => {
        setError(error);
        onError && onError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lazy && !skip) {
      trigger();
    }
  }, [parametersString]);

  return { data, loading, error, trigger };
};
