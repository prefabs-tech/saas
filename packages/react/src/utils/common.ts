import { ADMIN_SUBDOMAIN_DFAULT } from "@/constants";

export const checkIsAdminApp = () => {
  const subdomain = window.location.hostname.split(".")[0];

  return subdomain === ADMIN_SUBDOMAIN_DFAULT;
};
