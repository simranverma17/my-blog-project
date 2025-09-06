import Login from "./Login";
import { Link } from "react-router-dom";
import "./styles/AuthPage.css";  
function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="brand-title">BlogSphere</h1>
        <h2 className="auth-heading">Login</h2>
        <Login />
        <p className="switch-text">
          Don’t have an account? <Link to="/signup">Signup here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
