import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  getProfile,
  getMyWallets,
  createWalletJWT,
  getAdminStats,
} from "../utils/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [walletName, setWalletName] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  useEffect(() => {
  if (!profile) return; // prevent running code before profile exists
  if (profile.role === "USER") {
    getMyWallets()
      .then((data) => setWallets(Array.isArray(data) ? data : [data]))
      .catch(() => setWallets([]));
  }else if (profile.role === "ADMIN") {
    getAdminStats().then(setStats).catch(() => setStats(null));
  }
}, [profile]);


  const handleCreateWallet = async (e) => {
  e.preventDefault();
  if (!walletName.trim()) return;

  await createWalletJWT(walletName.trim());

  const fresh = await getMyWallets().catch(() => []);
  // ensure fresh is always an array
  setWallets(Array.isArray(fresh) ? fresh : [fresh]);
  setWalletName("");
};



  if (!profile) return null;

  return (
    <>
      <Header />
      <div className="container">
        <h2 style={{ marginTop: "1rem" }}>
          Welcome, {profile.username || profile.email}
        </h2>

        {profile.role === "USER" && (
          <>
            {/* Create Wallet Form */}
            <form
              onSubmit={handleCreateWallet}
              className="form-container"
              style={{ maxWidth: 480 }}
            >
              <label>New Wallet Name</label>
              <input
                placeholder="e.g., My Primary Wallet"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Create Wallet
              </button>
            </form>

            {/* Wallet List */}
            <h3 style={{ marginTop: "1rem" }}>My Wallets</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Wallet ID</th>
                    <th>Name</th>
                    <th>Balance</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((w) => (
                    <tr key={w.walletId}>
                      <td>{w.walletId}</td>
                      <td>{w.walletName}</td>
                      <td>₹{w.balance}</td>
                      <td>
                        <Link
                          className="btn btn-secondary"
                          to={`/wallet/${w.walletId}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {wallets.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        No wallets yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Link to Combined Transactions */}
            {/* {wallets.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <Link className="btn btn-primary" to="/transactions">
                  View All Transactions
                </Link>
              </div>
            )} */}
          </>
        )}

        {profile.role === "ADMIN" && (
          <div className="dashboard-cards">
            <div className="card">
              <h3>Total Users</h3>
              <p>{stats?.totalUsers ?? "—"}</p>
            </div>
            <div className="card">
              <h3>Total Transactions</h3>
              <p>{stats?.totalTransactions ?? "—"}</p>
            </div>
            <div className="card">
              <h3>Total Funds</h3>
              <p>₹{stats?.totalFunds ?? "—"}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
