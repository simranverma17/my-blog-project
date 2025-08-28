import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

function Profile() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user]);

  if (!user) return <p>Please login to view your profile.</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        background: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center" }}>User Profile</h2>
      {userData.photoURL && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={userData.photoURL}
            alt="Avatar"
            width="100"
            style={{ borderRadius: "50%" }}
          />
        </div>
      )}
      <p>
        <strong>Name:</strong> {userData.displayName || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Bio:</strong> {userData.bio || "N/A"}
      </p>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => signOut(auth)}
          style={{
            padding: "10px 20px",
            borderRadius: "4px",
            background: "#282c34",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
