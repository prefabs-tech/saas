import { inject } from "vue";

export const useConfig = () => {
  const config = inject("config", {
    subdomains: "enabled",
    multiDatabase: false,
  });

  return config;
};
