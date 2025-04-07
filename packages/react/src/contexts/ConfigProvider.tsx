import React, { createContext, useCallback, useState } from "react";

import { RoutesConfig } from "@/types";
import { SaasConfig } from "@/types/config";

export interface ConfigContextType extends SaasConfig {
  updateRoutesConfig: (routesConfig: Partial<RoutesConfig>) => void;
}

interface Properties {
  children: React.ReactNode;
  config: SaasConfig;
}

const configContext = createContext<ConfigContextType | undefined>(undefined);

const ConfigProvider = ({ children, config: pConfig }: Properties) => {
  const [config, setConfig] = useState(pConfig);

  const updateRoutesConfig = useCallback(
    (newRoutesConfig: Partial<RoutesConfig>) => {
      const routesConfig = { ...config.routes };

      // TODO update/overwrite routes config
    },
    [],
  );

  return (
    <configContext.Provider value={{ ...config, updateRoutesConfig }}>
      {children}
    </configContext.Provider>
  );
};

export default ConfigProvider;

export { configContext };
