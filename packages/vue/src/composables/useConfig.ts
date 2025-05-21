import { inject } from "vue";

export const useConfig = () => {
  const config = inject("config", {
    multiDatabase: false,
    subdomains: "enabled",
  });

  return config;
};
