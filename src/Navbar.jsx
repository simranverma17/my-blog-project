import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  
  if (location.pathname === "/") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        {/* Brand Logo */}
        <Link to="/home" className="brand">
          BlogSphere
        </Link>

        {/* Navigation Links */}
        <Link to="/home">Home</Link>
        <Link to="/editor">Create</Link>
      </div>

      <div className="nav-right">
        {/* Profile & Logout */}
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
