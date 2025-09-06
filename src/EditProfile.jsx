import { useState } from "react";
import { auth, db } from "./firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./styles/Form.css";

function EditProfile() {
  const [user] = useAuthState(auth);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile(user, { displayName });
      await updateDoc(doc(db, "users", user.uid), { displayName, bio });
      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
      <input type="text" placeholder="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
      <button type="submit">Save</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default EditProfile;
