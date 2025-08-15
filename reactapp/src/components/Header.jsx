import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email") || "";
  const username =
    localStorage.getItem("username") || (email ? email.split("@")[0] : "User");
  const nav = useNavigate();

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <header className="header">
      <h1>E-Wallet System</h1>
      <nav className="nav-links">
        {role === "USER" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
          </>
        )}
        {role === "ADMIN" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/transactions">Transactions</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/wallets">Wallets</Link>
          </>
        )}
        <span style={{ opacity: 0.9, marginLeft: ".5rem" }}>{username}</span>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
}
