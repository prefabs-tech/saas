import { useCallback, useEffect, useState } from "react";

import client from "@/api/axios";
import { useConfig } from "./UseConfig";

export const useMutation = <MutationResponse>(
  url: string,
  data: object = {},
  {
    withCredentials = true,
    onSuccess,
    onFailure,
  }: {
    withCredentials?: boolean;
    onSuccess?: (response?: MutationResponse) => void;
    onFailure?: (error?: any) => void;
  },
) => {
  const [loading, setLoading] = useState(false);

  const { apiBaseUrl } = useConfig();

  const trigger = useCallback(() => {
    setLoading(true);

    client(apiBaseUrl)
      .post(url, data, {
        withCredentials,
      })
      .then((response) => {
        onSuccess && onSuccess(response as MutationResponse);
      })
      .catch((error) => onFailure && onFailure(error))
      .finally(() => setLoading(false));
  }, []);

  return { loading, trigger };
};
