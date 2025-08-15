// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>E-Wallet System</h1>
        <p>Secure. Fast. Reliable. Your money, your control.</p>
      </header>

      <div className="home-buttons">
        <Link to="/login" className="btn-animated">Login</Link>
        <Link to="/register" className="btn-animated">Register</Link>
      </div>

      <section className="home-features">
        <div className="feature-card">
          <h3>💳 Multiple Wallets</h3>
          <p>Manage all your wallets in one place.</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Instant Transfers</h3>
          <p>Send and receive money instantly with low fees.</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Secure & Encrypted</h3>
          <p>Your funds and data are protected at all times.</p>
        </div>
      </section>
    </div>
  );
}
