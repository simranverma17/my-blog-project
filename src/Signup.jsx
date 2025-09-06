import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./styles/Form.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        createdAt: new Date(),
      });
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Signup</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default Signup;
