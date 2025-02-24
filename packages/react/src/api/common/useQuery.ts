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
  const [error, setError] = useState(false);
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
      .then(({ data }) => {
        if ("status" in data && data.status === "ERROR") {
          setError(data.message);
          onError && onError(data);
        } else {
          setData(data as QueryResponse);
          onSuccess && onSuccess(data as QueryResponse);
        }
      })
      .catch((error) => {
        setError(error.message);
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
