import "./App.css";
import Login from "./components/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./components/todo/Todo";
import Home from "./components/todo/Home"
import {FtProvider} from "./providers/ft-provider";
import { WagmiProvider } from 'wagmi'; 
import { config } from "../wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "./context/GeneralContextProvider";

const queryClient = new QueryClient();
function App() {
  return (
    <ContextProvider>
    
    <BrowserRouter>
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />}/>
        
        <Route path="/home" element={<Home/>} />
        
      </Routes>
    </div>
    </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
