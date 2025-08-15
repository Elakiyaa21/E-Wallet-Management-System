import React, { useState } from "react";
import { register } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await register(name, email, password);

      // Store JWT & user info
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("email", res.email);
      localStorage.setItem("userId", res.userId);

      // Prefer provided name, fallback to email prefix
      const display = name || (res.email || "").split("@")[0] || "User";
      localStorage.setItem("username", display);

      nav(res.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (e) {
      setErr("Registration failed (email may already exist)");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 450, marginTop: "5rem" }}>
      <form onSubmit={onSubmit} className="form-container">
        <h2 style={{ marginTop: 0 }}>Create account</h2>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {err && (
          <div className="error" style={{ marginBottom: ".75rem" }}>
            {err}
          </div>
        )}
        <button className="btn btn-primary" type="submit">
          Register
        </button>
        <div style={{ marginTop: ".75rem" }}>
          Have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
