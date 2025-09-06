import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./styles/Navbar.css";

export default function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <nav style={{ padding: "10px", background: "#282c34", color: "white" }}>
      <Link to="/home" style={{ margin: "0 10px", color: "white" }}>
        BlogSphere
      </Link>

      {user ? (
        <>
          <Link to="/home" style={{ margin: "0 10px", color: "white" }}>
            Home
          </Link>
          <Link to="/editor" style={{ margin: "0 10px", color: "white" }}>
            New Post
          </Link>
          <Link to="/profile" style={{ margin: "0 10px", color: "white" }}>
            Profile
          </Link>
          <button
            onClick={() => signOut(auth)}
            style={{
              marginLeft: "15px",
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ margin: "0 10px", color: "white" }}>
            Login
          </Link>
          <Link to="/signup" style={{ margin: "0 10px", color: "white" }}>
            Signup
          </Link>
        </>
      )}
    </nav>
  );
}
