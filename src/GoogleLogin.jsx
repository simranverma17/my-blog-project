import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function GoogleLogin() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google login successful 🎉");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <button onClick={handleGoogleLogin} style={{marginTop:"10px"}}>
      Sign in with Google
    </button>
  );
}

export default GoogleLogin;
