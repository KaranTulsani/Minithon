// src/components/Navbar.js
import { Link } from "react-router-dom";
import "./../App.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Cooksy</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
}
