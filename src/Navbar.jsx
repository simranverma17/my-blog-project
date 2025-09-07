import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import "./styles/Navbar.css";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/home" className="brand">BlogSphere</Link>

        {/* Navigation Links */}
        {user ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/editor">New Post</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={() => signOut(auth)}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
