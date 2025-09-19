// src/components/SignUp.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./../App.css";
import GoogleAuth from "./GoogleAuth"; // ✅ Import Google button

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ✅ Password validation
  const validatePassword = (password) => {
    return (
      password.length >= 6 &&
      /\d/.test(password) && // at least one number
      /[!@#$%^&*]/.test(password) // at least one special character
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 6 characters, contain 1 number and 1 special character";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup Successful!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>

      {/* Email/Password SignUp Form */}
      <form onSubmit={handleSignup}>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {/* Divider */}
      <div style={{ textAlign: "center", margin: "20px 0", color: "#666" }}>
        ─── or ───
      </div>

      {/* Google Signup/Login Button */}
      <GoogleAuth />
    </div>
  );
}
