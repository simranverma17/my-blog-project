import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import "./styles/Profile.css";

function Profile() {
  const [user] = useAuthState(auth);

  if (!user) return <p>No user found</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1 className="brand-title">BlogSphere</h1>
        <h2 className="profile-heading">Your Profile</h2>

        {user.photoURL && (
          <img src={user.photoURL} alt="avatar" className="profile-avatar" />
        )}
        <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <button onClick={() => signOut(auth)} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
