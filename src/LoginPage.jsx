import Login from "./Login";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      background: "#f4f6f9" 
    }}>
      <div style={{ 
        background: "white", 
        padding: "30px", 
        borderRadius: "10px", 
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)", 
        width: "400px", 
        textAlign: "center" 
      }}>
        <h1 style={{ marginBottom: "10px", color: "#333" }}>BlogSphere 🚀</h1>
        <h2 style={{ marginBottom: "20px", color: "#444" }}>Login</h2>

        <Login />

        <p style={{ marginTop: "20px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#007bff" }}>
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
