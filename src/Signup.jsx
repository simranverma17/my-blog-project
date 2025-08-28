import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(res.user, { displayName });

      // Save user info in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        displayName,
        bio: "",
        photoURL: "",
        createdAt: serverTimestamp(),
      });

      navigate("/home"); // redirect after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        textAlign: "left"
      }}
    >
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px"
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Signup
      </button>

      {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
    </form>
  );
}

export default Signup;
