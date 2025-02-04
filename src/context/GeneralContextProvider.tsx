import {
    Session,
    createKeyStoreInteractor,
    createSingleSigAuthDescriptorRegistration,
    createWeb3ProviderEvmKeyStore,
    hours,
    registerAccount,
    registrationStrategy,
    ttlLoginRule,
  } from "@chromia/ft4";
  import { createClient } from "postchain-client";
  import { ReactNode, createContext, useContext, useState } from "react";
  
  const ChromiaContext = createContext<{
    session?: Session;
    initSession?: () => Promise<void>;
  }>({});
  
  declare global {
    interface Window {
      ethereum?: any;
    }
  }
  
  export function ContextProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | undefined>(undefined);
  
    const initSession = async () => {
      console.log("🔹 Initializing Session");
      try {
        // 1. Initialize Client
        const client = await createClient({
          nodeUrlPool: "http://localhost:7740",
          blockchainIid: 0,
        });
  
        // 2. Connect with MetaMask
        const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
  
        // 3. Get all accounts associated with the EVM address
        const evmKeyStoreInteractor = createKeyStoreInteractor(client, evmKeyStore);
        const accounts = await evmKeyStoreInteractor.getAccounts();
  
        if (accounts.length > 0) {
          // 4. Start a new session
          const { session } = await evmKeyStoreInteractor.login({
            accountId: accounts[0].id,
            config: {
              rules: ttlLoginRule(hours(2)),
              flags: ["S"],
            },
          });
          setSession(session);
        } else {
          // 5. Create a new account by signing a message using MetaMask
          const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
          const { session } = await registerAccount(
            client,
            evmKeyStore,
            registrationStrategy.open(authDescriptor, {
              config: {
                rules: ttlLoginRule(hours(2)),
                flags: ["S"],
              },
            }),
            {
              name: "register_user",
            }
          );
          setSession(session);
        }
        console.log("✅ Session initialized");
      } catch (error) {
        console.error("⚠️ Error initializing session:", error);
      }
    };
  
    return (
      <ChromiaContext.Provider value={{ session, initSession }}>
        {children}
      </ChromiaContext.Provider>
    );
  }
  
  export function useSessionContext() {
    const context = useContext(ChromiaContext);
    if (!context) {
      throw new Error("useSessionContext must be used within a ContextProvider");
    }
    return context;
  }
  