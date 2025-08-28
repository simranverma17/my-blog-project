import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function EditProfile() {
  const [user] = useAuthState(auth);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || "");
          setBio(data.bio || "");
          setPhotoURL(data.photoURL || "");
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { displayName, bio, photoURL });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!user) return <p>Please login to edit profile.</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", background: "#f9f9f9" }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Avatar URL"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px", borderRadius: "4px", background: "#282c34", color: "white", cursor: "pointer" }}>
          Save Changes
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default EditProfile;
