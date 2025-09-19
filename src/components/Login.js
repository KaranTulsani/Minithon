// src/components/Login.js
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom"; // ✅ use Link instead of <a>
import "./../App.css";
import GoogleAuth from "./GoogleAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ✅ Password strength validation
  const validatePassword = (password) => {
    return (
      password.length >= 6 &&
      /\d/.test(password) && // contains number
      /[!@#$%^&*]/.test(password) // contains special char
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 6 characters, contain 1 number and 1 special character";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      {/* Email/Password Login Form */}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit">Login</button>
      </form>

      {/* Forgot Password Link */}
      <p style={{ marginTop: "12px", textAlign: "right" }}>
        <Link to="/forgot-password" style={{ color: "#ff5722", textDecoration: "none" }}>
          Forgot Password?
        </Link>
      </p>

     {/* Divider */}
{/* Divider */}
<div className="divider">
  <span>or</span>
</div>


      {/* Google Login Button */}
      <GoogleAuth />
    </div>
  );
}
