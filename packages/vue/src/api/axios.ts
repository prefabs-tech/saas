import { authConfig } from "../auth-provider";
import { API_PATH_REFRESH } from "../constant";
import axios from "axios";
import SuperTokens from "supertokens-website";

SuperTokens.addAxiosInterceptors(axios);

const client = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Response interceptor: Handle token expiration
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const refreshRoute = authConfig?.user?.apiRoutes?.refresh || API_PATH_REFRESH;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes(refreshRoute)
      ) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await instance.post(refreshRoute, {
            withCredentials: true,
          });

          if (refreshResponse.status === 200) {
            return instance(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const encodeURIParameter = <T>(argument: T) => {
  return !argument ? undefined : JSON.stringify(argument);
};

export default client;
