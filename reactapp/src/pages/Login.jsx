import React, { useState } from "react";
import { login } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await login(email, password);

      // Save token + user info so axios can send it in Authorization header
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("email", res.email);
      localStorage.setItem("userId", res.userId);

      // Derive a simple username from email for header display
      const simpleName = (res.email || "").split("@")[0] || "User";
      localStorage.setItem("username", simpleName);

      // Redirect based on role
      nav(res.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (e) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 450, marginTop: "5rem" }}>
      <form onSubmit={onSubmit} className="form-container">
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ewallet.local"
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
          Login
        </button>
        <div style={{ marginTop: ".75rem" }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
