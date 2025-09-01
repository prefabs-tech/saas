import { ADMIN_SUBDOMAIN_DEFAULT } from "../constant";

export const checkIsAdminApp = (): boolean => {
  const subdomain = window.location.hostname.split(".")[0];

  return subdomain === ADMIN_SUBDOMAIN_DEFAULT;
};
