import './login.css'
import { useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, ConnectKitButton } from "connectkit";
import { WagmiProvider, useAccount } from "wagmi";
import { FtProvider } from '../../providers/ft-provider';
import { useEffect } from "react";

import { config } from "../../../wagmi-config";
import { useChromiaAccount } from "../../hooks/chromia-hooks";
import { CardLoading } from "../../components/layout/card-loading";
import { Card, CardDescription, CardTitle } from "../../components/ui/card";
import Button from "../../components/chromia-ui-kit/button";

const queryClient = new QueryClient();


const Login = () => {
  const navigate= useNavigate()
  
  return (
    <WagmiProvider config={config}> 
      <FtProvider>
        <QueryClientProvider client={queryClient}>
          <InnerLogin navigate={navigate} /> 
        </QueryClientProvider>
      </FtProvider>
    </WagmiProvider>
  );
};

const InnerLogin = ({ navigate }: { navigate: any }) => {

  const { isConnected } = useAccount(); 
  const { hasAccount, createAccount, isLoading, tried } = useChromiaAccount({
  });

  
    if (isConnected) {
      if(hasAccount){
      navigate("/home"); 
    }
    return (
      <div className="flex flex-1 items-center justify-center">
        {isLoading ? (
          <CardLoading />
        ) : (
          <Card className="min-w-52 p-6 text-center">
            <CardTitle>Account not found</CardTitle>
            <CardDescription className="mt-2">
              You need to create an account
            </CardDescription>
            <Button onClick={createAccount} className="mx-auto mt-4 min-w-44">
              {tried ? "Retry creating account" : "Create account"}
            </Button>
          </Card>
        )}
      </div>
    );
  }
  
  


  return (
    <WagmiProvider config={config}>
      
      <QueryClientProvider client={queryClient}>

    <div className="glass-container-dark">
      <div className="background-glow"></div>
      <div className="glass-card-dark">
        <div className="card-header-dark">
          <h2>Welcome to Planner</h2>
          <p>Connect to your account to continue</p>
        </div>
        <ConnectKitProvider>
          <ConnectKitButton.Custom>
            {({ show, isConnecting }) => (
    <button className="btn-primary-dark" onClick={show} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  )}
          </ConnectKitButton.Custom>
          </ConnectKitProvider>
        <div className="divider-dark">Plan your day</div>
      </div>
    </div>
    </QueryClientProvider>
    
    </WagmiProvider>

  )
}

export default Login