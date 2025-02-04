import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

// Use REACT_APP_ prefix for Create React App (CRA) or VITE_ for Vite
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ;

export const config = createConfig(
  getDefaultConfig({
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
    appName: "easy-start",
  })
);
