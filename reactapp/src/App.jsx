import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import MyTransactions from "./components/MyTransactions";
import TransactionAudit from "./components/TransactionAudit";
import UserList from "./components/UserList";
import WalletList from "./components/WalletList";
import WalletDetails from "./components/WalletDetails";

import { getAuthProfile, getAuthProfileSync } from "./utils/api";
import Home from "./pages/Home";


function PrivateRoute({ children, role }) {
  const profile = getAuthProfileSync();
  if (!profile) return <Navigate to="/login" replace />;
  if (role && profile.role !== role) {
    // If wrong role, send to their default landing
    return (
      <Navigate
        to={profile.role === "ADMIN" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }
  return children;
}

export default function App() {
  const profile = getAuthProfileSync();
  const defaultLanding = profile
    ? profile.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/login";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect root based on state */}
        <Route path="/" element={<Navigate to={defaultLanding} replace />} />

        {/* User */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="USER">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/:walletId"
          element={
            <PrivateRoute role="USER">
              <WalletDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute role="USER">
              <MyTransactions />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <PrivateRoute role="ADMIN">
              <TransactionAudit />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="ADMIN">
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/wallets"
          element={
            <PrivateRoute role="ADMIN">
              <WalletList />
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/:walletId"
          element={
            <PrivateRoute role="ADMIN">
              <WalletDetails />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={defaultLanding} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
