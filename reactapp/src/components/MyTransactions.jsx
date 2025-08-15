import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { getMyTransactions } from "../utils/api";

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState({ field: "timestamp", dir: "desc" });

  useEffect(() => {
    getMyTransactions({ size: 200 })
      .then((res) => {
        setTransactions(Array.isArray(res.content) ? res.content : []);
      })
      .catch(() => setTransactions([]));
  }, []);

  const display = useMemo(() => {
    let data = [...transactions];
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
      const va = a[field],
        vb = b[field];
      let cmp = 0;
      if (field === "timestamp") cmp = new Date(va) - new Date(vb);
      else if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va ?? "").localeCompare(String(vb ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });

    return data;
  }, [transactions, filter, sort]);

  const headerSort = (field) => {
    setSort((s) =>
      s.field === field ? { field, dir: s.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }
    );
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>All My Transactions</h2>

        <input
          className="filter-input"
          placeholder="Filter by ID/type/status/source/destination..."
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
                <th>Source Wallet ID</th>
                <th>Destination Wallet ID</th>
                <th onClick={() => headerSort("timestamp")}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {display.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.transactionType}</td>
                  <td>{t.status}</td>
                  <td>{t.sourceWallet?.walletId ?? "-"}</td>
                  <td>{t.destinationWallet?.walletId ?? "-"}</td>
                  <td>{new Date(t.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {display.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No transactions found.
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
