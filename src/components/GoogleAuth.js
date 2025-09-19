// src/components/GoogleAuth.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function GoogleAuth() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // User info
      const user = result.user;
      console.log("User info:", user);
      alert(`Welcome ${user.displayName}!`);

    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        padding: "12px 20px",
        backgroundColor: "#DB4437", // Google red
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "15px",
      }}
    >
      Continue with Google
    </button>
  );
}
