import Signup from "./Signup";
import { Link } from "react-router-dom";
import "./styles/AuthPage.css"; 
import "./styles/Form.css";  

function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="brand-title">BlogSphere</h1>
        <h2 className="auth-heading">Signup</h2>
        <Signup />
        <p className="switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
