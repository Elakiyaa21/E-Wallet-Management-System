import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { getAdminTransactions } from "../utils/api";

const types = ["", "DEPOSIT", "TRANSFER"];
const statuses = ["", "SUCCESS", "FAILED"];

export default function TransactionAudit() {
  const [pageData, setPageData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    page: 0,
    size: 20,
  });
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    userId: "",
    from: "",
    to: "",
  });
  const [sort, setSort] = useState({ field: "timestamp", dir: "desc" });

  const load = async (page = 0) => {
    const q = {
      page,
      size: pageData.size,
      type: filters.type || undefined,
      status: filters.status || undefined,
      userId: filters.userId || undefined,
      from: filters.from ? new Date(filters.from).getTime() : undefined,
      to: filters.to ? new Date(filters.to).getTime() : undefined,
    };
    const res = await getAdminTransactions(q).catch(() => ({
      content: [],
      totalPages: 0,
      totalElements: 0,
      page: 0,
      size: pageData.size,
    }));
    setPageData(res);
  };

  useEffect(() => {
    // initial load
    // eslint-disable-next-line
    load(0);
  }, []);

  const sorted = useMemo(() => {
    const data = [...(pageData.content || [])];
    const { field, dir } = sort;
    data.sort((a, b) => {
      const va = a[field],
        vb = b[field];
      let cmp = 0;
      if (field === "timestamp") cmp = new Date(va) - new Date(vb);
      else if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va ?? "").localeCompare(String(vb ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [pageData, sort]);

  const headerSort = (field) => {
    setSort((s) =>
      s.field === field
        ? { field, dir: s.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );
  };

  const submitFilters = (e) => {
    e.preventDefault();
    load(0);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Transaction Audit</h2>

        <form onSubmit={submitFilters}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label>Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t || "Any"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s || "Any"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>User ID</label>
              <input
                value={filters.userId}
                onChange={(e) =>
                  setFilters({ ...filters, userId: e.target.value })
                }
              />
            </div>
            <div>
              <label>From</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) =>
                  setFilters({ ...filters, from: e.target.value })
                }
              />
            </div>
            <div>
              <label>To</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) =>
                  setFilters({ ...filters, to: e.target.value })
                }
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: ".5rem" }}>
            Apply Filters
          </button>
        </form>

        <div className="table-container" style={{ marginTop: "1rem" }}>
          <table>
            <thead>
              <tr>
                <th onClick={() => headerSort("id")}>ID</th>
                <th onClick={() => headerSort("amount")}>Amount</th>
                <th onClick={() => headerSort("transactionType")}>Type</th>
                <th onClick={() => headerSort("status")}>Status</th>
                <th onClick={() => headerSort("timestamp")}>Timestamp</th>
                <th>Source Wallet</th>
                <th>Destination Wallet</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
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
              {sorted.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No transactions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Simple pager */}
        <div style={{ marginTop: ".75rem", display: "flex", gap: ".5rem" }}>
          <button
            className="btn btn-secondary"
            onClick={() => load(pageData.page - 1)}
            disabled={pageData.page <= 0}
          >
            Prev
          </button>
          <div style={{ alignSelf: "center" }}>
            Page {pageData.page + 1} of {Math.max(1, pageData.totalPages)}
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => load(pageData.page + 1)}
            disabled={pageData.page + 1 >= pageData.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
