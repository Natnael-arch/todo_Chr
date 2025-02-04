import { 
    Session, 
    createKeyStoreInteractor, 
    createSingleSigAuthDescriptorRegistration, 
    createWeb3ProviderEvmKeyStore, 
    hours, 
    registerAccount, 
    registrationStrategy, 
    ttlLoginRule 
} from "@chromia/ft4";
import { createClient } from "postchain-client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const ChromiaContext = createContext<{ session: Session | undefined; evmKeyStore: any } | undefined>(undefined);

declare global {
    interface Window { ethereum?: any; }
}

export function ContextProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | undefined>(undefined);
    const [evmKeyStore, setEvmKeyStore] = useState<any>(null);

    useEffect(() => {
        if (!window.ethereum) {
            console.error("🛑 MetaMask is not installed! Please install MetaMask.");
            return;
        }

        const initSession = async () => {
            try {
                console.log("🔹 Initializing Chromia Session...");

                // Retrieve session from localStorage if available
                const savedSession = localStorage.getItem("session");
                if (savedSession) {
                    const parsedSession = JSON.parse(savedSession);
                    setSession(parsedSession);
                    console.log("✅ Session loaded from localStorage.");
                    return;
                }

                const nodeUrl = import.meta.env.VITE_NODE_URL;
                const blockchainRid = import.meta.env.VITE_BRID;

                if (!nodeUrl || !blockchainRid) {
                    console.error("🛑 Missing environment variables: VITE_NODE_URL or VITE_BRID.");
                    return;
                }

                const client = import.meta.env.VITE_DEV === "true" 
                    ? await createClient({ 
                        nodeUrlPool: import.meta.env.VITE_LOCAL_NODE_URL || "http://localhost:7740", 
                        blockchainIid: 0
                      }) 
                    : await createClient({ 
                        directoryNodeUrlPool: import.meta.env.VITE_NODE_URL || "https://testnet4-dapps.chromia.dev:7740", 
                        blockchainRid: import.meta.env.VITE_BRID || "D0956ED1788484D73097C85DBB34421D2664D0FF581DF3DCC95BD239C9A469B5"
                      });

                const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
                setEvmKeyStore(evmKeyStore);

                const evmKeyStoreInteractor = createKeyStoreInteractor(client, evmKeyStore);
                const accounts = await evmKeyStoreInteractor.getAccounts();

                if (accounts.length > 0) {
                    console.log("✅ Existing account found. Checking blockchain...");

                    // 🔍 Check if the user exists in the Chromia blockchain
                    const userExists = await client.query("get_user", { account_id: accounts[0].id });

                    if (userExists) {
                        console.log("✅ User exists on blockchain. Logging in...");
                        const { session } = await evmKeyStoreInteractor.login({
                            accountId: accounts[0].id,
                            config: { rules: ttlLoginRule(hours(2)), flags: ["S"] }
                        });

                        setSession(session);

                        // Store session in localStorage
                        localStorage.setItem("session", JSON.stringify(session));
                        console.log("✅ Logged in successfully!");
                    } else {
                        console.log("🛑 User does not exist on blockchain, but key exists. Need manual recovery.");
                    }
                } else {
                    console.log("🆕 No existing account. Registering new user...");

                    const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
                    const { session } = await registerAccount(client, evmKeyStore, registrationStrategy.open(authDescriptor, {
                        config: { rules: ttlLoginRule(hours(2)), flags: ["S"] }
                    }), {
                        name: "register_user"
                    });

                    setSession(session);

                    // Store session in localStorage
                    localStorage.setItem("session", JSON.stringify(session));
                    console.log("✅ New user registered successfully!");
                }
            } catch (error) {
                console.error("⚠️ Error initializing session:", error);
            }
        };

        initSession();
    }, []);

    return (
        <ChromiaContext.Provider value={{ session, evmKeyStore }}>
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
