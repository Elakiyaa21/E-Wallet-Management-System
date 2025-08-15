import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getWalletLegacy,
  getTransactionsByWalletLegacy,
  depositLegacy,
  transferLegacy,
  deleteWalletLegacy,
  getProfile,
} from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom confirmation modal component
function ConfirmationModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: "1.5rem", borderRadius: "8px", width: "320px", textAlign: "center"
      }}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-around" }}>
          <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function WalletDetails() {
  const { walletId } = useParams();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [txs, setTxs] = useState([]);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState({ field: "timestamp", dir: "desc" });

  const [confirmData, setConfirmData] = useState({ show: false, type: "", amount: 0, recipient: "" });

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const loadWallet = useCallback(async () => {
    getWalletLegacy(walletId).then(setWallet).catch(() => setWallet(null));
    getTransactionsByWalletLegacy(walletId).then(setTxs).catch(() => setTxs([]));
  }, [walletId]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  // ===== User actions =====
  const handleTopUp = (e) => {
    e.preventDefault();
    if (!topUpAmount) return;

    setConfirmData({ show: true, type: "topup", amount: parseFloat(topUpAmount) });
  };

  const handleTransfer = (e) => {
  e.preventDefault();
  if (!transferAmount || !recipientId) return;

  if (recipientId === walletId) {
    toast.error("Cannot transfer to the same wallet!");
    return;
  }

  setConfirmData({ show: true, type: "transfer", amount: parseFloat(transferAmount), recipient: recipientId });
};


  const handleConfirm = async () => {
    try {
      if (confirmData.type === "topup") {
        await depositLegacy(walletId, confirmData.amount);
        toast.success(`₹${confirmData.amount} successfully added!`);
        setTopUpAmount("");
      } else if (confirmData.type === "transfer") {
        await transferLegacy(walletId, confirmData.recipient, confirmData.amount);
        toast.success(`₹${confirmData.amount} sent to wallet ${confirmData.recipient}!`);
        setTransferAmount("");
        setRecipientId("");
      }
      loadWallet();
    } catch (err) {
      console.error(err);
      toast.error(`${confirmData.type === "topup" ? "Top up" : "Transfer"} failed!`);
    } finally {
      setConfirmData({ show: false, type: "", amount: 0, recipient: "" });
    }
  };

  const handleCancel = () => {
    setConfirmData({ show: false, type: "", amount: 0, recipient: "" });
  };

  const handleDelete = async () => {
    if (wallet.balance > 0) {
      toast.warning("Wallet balance must be 0 to delete!");
      return;
    }
    setConfirmData({ show: true, type: "delete" });
  };

  const handleConfirmDelete = async () => {
    await deleteWalletLegacy(walletId);
    toast.success("Wallet deleted successfully!");
    navigate(profile?.role === "ADMIN" ? "/admin/wallets" : "/dashboard");
    setConfirmData({ show: false, type: "", amount: 0, recipient: "" });
  };

  // ===== Transactions filtering & sorting =====
  const display = useMemo(() => {
    let data = [...txs];
    const f = filter.trim().toLowerCase();
    if (f) {
      data = data.filter(
        (r) =>
          String(r.id).includes(f) ||
          (r.transactionType || "").toLowerCase().includes(f) ||
          (r.status || "").toLowerCase().includes(f) ||
          String(r.sourceWallet?.walletId || "").includes(f) ||
          String(r.destinationWallet?.walletId || "").includes(f)
      );
    }

    data.sort((a, b) => {
      const { field, dir } = sort;
      const va = a[field], vb = b[field];
      let cmp = 0;
      if (field === "timestamp") cmp = new Date(va) - new Date(vb);
      else if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va ?? "").localeCompare(String(vb ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [txs, filter, sort]);

  const headerSort = (field) => {
    setSort((s) =>
      s.field === field ? { field, dir: s.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }
    );
  };

  return (
    <>
      <Header />
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <Link to={profile?.role === "ADMIN" ? "/admin/wallets" : "/dashboard"} className="btn btn-secondary">
            Back
          </Link>
          <h2 style={{ margin: 0 }}>Wallet #{walletId}</h2>
        </div>

        {/* Wallet Info */}
        <div className="dashboard-cards" style={{ marginTop: "1rem" }}>
          <div className="card">
            <h3>Name</h3>
            <p>{wallet?.walletName || "—"}</p>
          </div>
          <div className="card">
            <h3>Balance</h3>
            <p>₹{wallet?.balance ?? "—"}</p>
          </div>
          {wallet?.user && (
            <div className="card">
              <h3>User</h3>
              <p>{wallet.user.username} (ID {wallet.user.userId})</p>
            </div>
          )}
        </div>

        {/* User-only forms */}
        {profile?.role === "USER" && (
          <>
            <form onSubmit={handleTopUp} className="form-container" style={{ maxWidth: 320, marginTop: "1rem" }}>
              <h4>Top Up Wallet</h4>
              <input type="number" placeholder="Amount" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} />
              <button className="btn btn-primary" type="submit">Top Up</button>
            </form>

            <form onSubmit={handleTransfer} className="form-container" style={{ maxWidth: 320, marginTop: "1rem" }}>
              <h4>Transfer</h4>
              <input placeholder="Recipient Wallet ID" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} />
              <input type="number" placeholder="Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
              <button className="btn btn-primary" type="submit">Transfer</button>
            </form>
          </>
        )}

        {/* Transactions Table */}
        <h3 style={{ marginTop: "1rem" }}>Transactions</h3>
        <input
          className="filter-input"
          placeholder="Filter by ID/type/status/src/dst..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => headerSort("id")}>ID</th>
                <th onClick={() => headerSort("amount")}>Amount</th>
                <th onClick={() => headerSort("transactionType")}>Type</th>
                <th onClick={() => headerSort("status")}>Status</th>
                <th onClick={() => headerSort("timestamp")}>Timestamp</th>
                <th onClick={() => headerSort("sourceWallet")}>Src</th>
                <th onClick={() => headerSort("destinationWallet")}>Dst</th>
              </tr>
            </thead>
            <tbody>
              {display.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.transactionType}</td>
                  <td>{t.status}</td>
                  <td>{new Date(t.timestamp).toLocaleString()}</td>
                  <td>{t.sourceWallet?.walletId || "—"}</td>
                  <td>{t.destinationWallet?.walletId || "—"}</td>
                </tr>
              ))}
              {display.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">No transactions for this wallet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button className="btn btn-danger" onClick={handleDelete} style={{ minWidth: 140 }}>Delete Wallet</button>
        </div>
      </div>

      {/* Confirmation modal */}
      <ConfirmationModal
        show={confirmData.show}
        title={
          confirmData.type === "topup" ? "Confirm Top Up" :
          confirmData.type === "transfer" ? "Confirm Transfer" :
          "Confirm Delete"
        }
        message={
          confirmData.type === "topup" ? `Are you sure you want to top up ₹${confirmData.amount}?` :
          confirmData.type === "transfer" ? `Are you sure you want to transfer ₹${confirmData.amount} to wallet ${confirmData.recipient}?` :
          "Are you sure you want to delete this wallet?"
        }
        onConfirm={confirmData.type === "delete" ? handleConfirmDelete : handleConfirm}
        onCancel={handleCancel}
      />

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}
