import "./login.css";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../context/GeneralContextProvider";

const Login = () => {
  const navigate = useNavigate();
  const { initSession } = useSessionContext(); // Importing initSession from context

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!window.ethereum) {
      alert("🛑 MetaMask is not installed! Please install it first.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      if (initSession) {
        console.log("🔹 Initializing session...");
        await initSession(); // Explicitly initialize the session
        alert("✅ Wallet connected and session initialized! Redirecting...");
        navigate("/home"); // Redirect to home after successful login
      } else {
        console.error("🛑 initSession method is not available in context.");
        alert("Failed to initialize session. Please try again.");
      }
    } catch (error) {
      console.error("⚠️ Login failed:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="glass-container-dark">
      <div className="background-glow"></div>
      <div className="glass-card-dark">
        <div className="card-header-dark">
          <h2>Welcome to Planner</h2>
          <p>Connect to your account to continue</p>
        </div>
        <button className="btn-primary-dark" onClick={handleLogin}>
          Connect to wallet
        </button>
        <div className="divider-dark">Plan your day</div>
      </div>
    </div>
  );
};

export default Login;
