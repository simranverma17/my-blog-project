import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./styles/Profile.css";

export default function Profile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile({
            displayName: docSnap.data()?.displayName || user.displayName || "Anonymous",
            email: docSnap.data()?.email || user.email,
            bio: docSnap.data()?.bio || "",
            photoURL: docSnap.data()?.photoURL || null,
          });
        } else {
          setProfile({
            displayName: user.displayName || "Anonymous",
            email: user.email,
            bio: "",
            photoURL: null,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile({
          displayName: user.displayName || "Anonymous",
          email: user.email,
          bio: "",
          photoURL: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return <p className="text-center mt-3">Please login to view your profile.</p>;
  if (loading) return <p className="text-center mt-3">Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-heading">Your Profile</h2>

        <div className="profile-card">
          <div className="profile-avatar">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {profile?.displayName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="profile-info">
            <p><strong>Name:</strong> {profile?.displayName || "Anonymous"}</p>
            <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
            <p><strong>Bio:</strong> {profile?.bio || "No bio yet."}</p>
          </div>
        </div>

        <Link to="/edit-profile" className="edit-profile-btn">
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
