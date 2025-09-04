import React, { createContext } from "react";

import { SaasConfig } from "@/types/config";
import { prepareConfig } from "@/utils/config";

interface Properties {
  children: React.ReactNode;
  config: SaasConfig;
}

const configContext = createContext<SaasConfig | undefined>(undefined);

const ConfigProvider = ({ children, config }: Properties) => {
  const _config = prepareConfig(config);

  return (
    <configContext.Provider value={_config}>{children}</configContext.Provider>
  );
};

export default ConfigProvider;

export { configContext };
