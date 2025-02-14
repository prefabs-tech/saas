import { useCallback, useEffect, useState } from "react";

import client from "@/api/axios";
import { useConfig } from "./UseConfig";
import { encodeURIParameter } from "@/api/utils";

export const useQuery = <QueryResponse>(
  url: string,
  params: object = {},
  { lazy = false, skip = false }: { lazy?: boolean; skip?: boolean },
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<QueryResponse>();

  const { apiBaseUrl } = useConfig();

  const paramsString = Object.keys(params).length
    ? encodeURIParameter(params)
    : "";

  const trigger = useCallback(() => {
    setLoading(true);

    client(apiBaseUrl)
      .get(url, {
        params: paramsString,
      })
      .then(({ data }) => {
        if ("status" in data && data.status === "ERROR") {
          setError(data.message);
        } else {
          setData(data);
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lazy && !skip) {
      trigger();
    }
  }, [paramsString]);

  return { data, loading, error, trigger };
};
