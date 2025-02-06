import React, { createContext } from "react";

import { SaasConfig } from "@/types/config";

interface Properties {
  children: React.ReactNode;
  config: SaasConfig;
}

const configContext = createContext<SaasConfig | undefined>(undefined);

const ConfigProvider = ({ children, config }: Properties) => {
  return (
    <configContext.Provider value={config}>{children}</configContext.Provider>
  );
};

export default ConfigProvider;

export { configContext };
