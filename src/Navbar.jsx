import { Link } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth);
    alert("Logged out successfully!");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        padding: "10px",
        background: "#282c34",
        color: "white",
      }}
    >
      {user ? (
        <>
          <Link to="/home" style={{ color: "white" }}>
            Home
          </Link>
          <Link to="/profile" style={{ color: "white" }}>
            Profile
          </Link>
          <Link to="/edit-profile" style={{ color: "white" }}>
            Edit Profile
          </Link>
          <Link to="/create-post" style={{ color: "white" }}>
            Create Post
          </Link>
          <button
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "16px",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: "white" }}>
            Signup
          </Link>
        </>
      )}
    </nav>
  );
}
