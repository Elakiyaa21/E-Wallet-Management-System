import React, { useEffect, useState } from "react";
import Header from "./Header";
import { getWalletsLegacy } from "../utils/api";
import { FaFilter } from "react-icons/fa";

export default function WalletList() {
  const [wallets, setWallets] = useState([]);
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    getWalletsLegacy().then(setWallets).catch(() => setWallets([]));
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filtered = wallets.filter((w) => {
    return (
      (!filters.walletId || String(w.walletId).includes(filters.walletId)) &&
      (!filters.walletName || (w.walletName || "").toLowerCase().includes(filters.walletName.toLowerCase())) &&
      (!filters.balance || String(w.balance).includes(filters.balance)) &&
      (!filters.userId || String(w.user?.userId || "").includes(filters.userId)) &&
      (!filters.username || (w.user?.username || "").toLowerCase().includes(filters.username.toLowerCase()))
    );
  });

  const columns = [
    { key: "walletId", label: "Wallet ID" },
    { key: "walletName", label: "Name" },
    { key: "balance", label: "Balance" },
    { key: "userId", label: "User ID" },
    { key: "username", label: "Username" },
  ];

  return (
    <>
      <Header />
      <div className="container">
        <h2>Wallets</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} style={{ position: "relative", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      {col.label} 
                      <FaFilter
                        style={{ cursor: "pointer", fontSize: "0.8rem" }}
                        onClick={() => setActiveFilter(activeFilter === col.key ? null : col.key)}
                      />
                      {activeFilter === col.key && (
                        <input
                          type="text"
                          value={filters[col.key] || ""}
                          onChange={(e) => handleFilterChange(col.key, e.target.value)}
                          placeholder="Filter"
                          style={{
                            fontSize: "0.75rem",
                            marginLeft: "4px",
                            width: "80px",
                            padding: "1px 4px",       // smaller vertical padding
                            lineHeight: "1rem",       // reduce line height
                            height: "18px",            // optional fixed height
                          }}
                        />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.walletId}>
                  <td>{w.walletId}</td>
                  <td>{w.walletName}</td>
                  <td>₹{w.balance}</td>
                  <td>{w.user?.userId}</td>
                  <td>{w.user?.username}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="empty-state">
                    No wallets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
