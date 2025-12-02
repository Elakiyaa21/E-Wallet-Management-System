// // src/pages/Home.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import "./Home.css";

// export default function Home() {
//   return (
//     <div className="home-container">
//       <header className="home-header">
//         <h1>E-Wallet System</h1>
//         <p>Secure. Fast. Reliable. Your money, your control.</p>
//       </header>

//       <div className="home-buttons">
//         <Link to="/login" className="btn-animated">Login</Link>
//         <Link to="/register" className="btn-animated">Register</Link>
//       </div>

//       <section className="home-features">
//         <div className="feature-card">
//           <h3>💳 Multiple Wallets</h3>
//           <p>Manage all your wallets in one place.</p>
//         </div>
//         <div className="feature-card">
//           <h3>⚡ Instant Transfers</h3>
//           <p>Send and receive money instantly with low fees.</p>
//         </div>
//         <div className="feature-card">
//           <h3>🔒 Secure & Encrypted</h3>
//           <p>Your funds and data are protected at all times.</p>
//         </div>
//       </section>
//     </div>
//   );
// }


"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Home.css"

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null)

  return (
    <div className="home-wrapper">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <div className="logo-icon">₳</div>
            <span>E-Wallet</span>
          </div>
          <div className="navbar-actions">
            <Link to="/login" className="nav-link">
              Sign In
            </Link>
            <Link to="/register" className="nav-button">
              Register
              <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Trust Badge */}
          <div className="trust-badge">
            <div className="badge-dot"></div>
            <span>Trusted by 50,000+ users worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">Your Money, Your Control</h1>

          {/* Subheading */}
          {/* <p className="hero-subtitle">
            Experience seamless money management with instant transfers, multiple wallets, and bank-level security. All
            in one beautiful app.
          </p> */}

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
              <span className="arrow">→</span>
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="section-title">Powerful Features Built for You</h2>
          <p className="section-subtitle">Everything you need to manage your finances with confidence</p>
        </div>

        <div className="features-grid">
          {[
            {
              id: 1,
              icon: "💳",
              title: "Multiple Wallets",
              description:
                "Manage all your wallets in one place. Organize your finances the way that works best for you.",
            },
            {
              id: 2,
              icon: "⚡",
              title: "Instant Transfers",
              description:
                "Send and receive money instantly with minimal fees. Experience lightning-fast transactions.",
            },
            {
              id: 3,
              icon: "🔒",
              title: "Secure & Encrypted",
              description: "Military-grade encryption protects your funds and data. Your security is our priority.",
            },
            {
              id: 4,
              icon: "📈",
              title: "Real-time Analytics",
              description: "Track your spending patterns and get insights into your financial habits.",
            },
            {
              id: 5,
              icon: "👥",
              title: "Easy Sharing",
              description: "Share wallets with family or teams. Manage shared expenses effortlessly.",
            },
            {
              id: 6,
              icon: "🛡️",
              title: "Fraud Protection",
              description: "Advanced algorithms detect suspicious activity. Your money stays safe.",
            },
          ].map((feature) => (
            <div
              key={feature.id}
              className="feature-card"
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-subtitle">Join thousands of users who trust E-Wallet for their financial needs.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Create Account
              <span className="arrow">→</span>
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Already Have Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
            {/* <div className="footer-column"> */}
              <div className="footer-logo">
                <div className="logo-icon">₳</div>
                <span>E-Wallet</span>
              </div>
              <p className="footer-description">Your money, your control.</p>
            {/* </div> */}
          <div className="footer-bottom">
            <p>&copy; 2025 E-Wallet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
