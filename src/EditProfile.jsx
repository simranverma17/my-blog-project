import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "./firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth"; // ✅ Correct import
import "./styles/Profile.css";

export default function EditProfile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        setDisplayName(data?.displayName || user.displayName || "");
        setBio(data?.bio || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setDisplayName(user.displayName || "");
        setBio("");
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) return <p className="text-center mt-3">Please login to edit your profile.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = null;

      // Upload photo if selected
      if (photoFile) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // ✅ Ensure Firestore has user document (if not, create it)
      const profileRef = doc(db, "users", user.uid);
      await setDoc(
        profileRef,
        {
          displayName,
          bio,
          email: user.email,
          ...(photoURL && { photoURL }),
        },
        { merge: true }
      );

      // ✅ Update Firebase Auth profile
      await updateProfile(user, {
        displayName,
        ...(photoURL && { photoURL }),
      });

      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error saving profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-heading">Edit Profile</h2>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <label>
            Display Name
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </label>

          <label>
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </label>

          <label>
            Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
