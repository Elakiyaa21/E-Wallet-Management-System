// import React, { useEffect, useMemo, useState } from "react";
// import Header from "./Header";
// import { getAdminTransactions } from "../utils/api";

// const types = ["", "DEPOSIT", "TRANSFER"];
// const statuses = ["", "SUCCESS", "FAILED"];

// export default function TransactionAudit() {
//   const [pageData, setPageData] = useState({
//     content: [],
//     totalPages: 0,
//     totalElements: 0,
//     page: 0,
//     size: 20,
//   });
//   const [filters, setFilters] = useState({
//     type: "",
//     status: "",
//     userId: "",
//     from: "",
//     to: "",
//   });
//   const [sort, setSort] = useState({ field: "timestamp", dir: "desc" });

//   const load = async (page = 0) => {
//     const q = {
//       page,
//       size: pageData.size,
//       type: filters.type || undefined,
//       status: filters.status || undefined,
//       userId: filters.userId || undefined,
//       from: filters.from ? new Date(filters.from).getTime() : undefined,
//       to: filters.to ? new Date(filters.to).getTime() : undefined,
//     };
//     const res = await getAdminTransactions(q).catch(() => ({
//       content: [],
//       totalPages: 0,
//       totalElements: 0,
//       page: 0,
//       size: pageData.size,
//     }));
//     setPageData(res);
//   };

//   useEffect(() => {
//     // initial load
//     // eslint-disable-next-line
//     load(0);
//   }, []);

//   const sorted = useMemo(() => {
//     const data = [...(pageData.content || [])];
//     const { field, dir } = sort;
//     data.sort((a, b) => {
//       const va = a[field],
//         vb = b[field];
//       let cmp = 0;
//       if (field === "timestamp") cmp = new Date(va) - new Date(vb);
//       else if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
//       else cmp = String(va ?? "").localeCompare(String(vb ?? ""));
//       return dir === "asc" ? cmp : -cmp;
//     });
//     return data;
//   }, [pageData, sort]);

//   const headerSort = (field) => {
//     setSort((s) =>
//       s.field === field
//         ? { field, dir: s.dir === "asc" ? "desc" : "asc" }
//         : { field, dir: "asc" }
//     );
//   };

//   const submitFilters = (e) => {
//     e.preventDefault();
//     load(0);
//   };

//   return (
//     <>
//       <Header />
//       <div className="container">
//         <h2>Transaction Audit</h2>

//         <form onSubmit={submitFilters}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
//               gap: "1rem",
//             }}
//           >
//             <div>
//               <label>Type</label>
//               <select
//                 value={filters.type}
//                 onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//               >
//                 {types.map((t) => (
//                   <option key={t} value={t}>
//                     {t || "Any"}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>Status</label>
//               <select
//                 value={filters.status}
//                 onChange={(e) =>
//                   setFilters({ ...filters, status: e.target.value })
//                 }
//               >
//                 {statuses.map((s) => (
//                   <option key={s} value={s}>
//                     {s || "Any"}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>User ID</label>
//               <input
//                 value={filters.userId}
//                 onChange={(e) =>
//                   setFilters({ ...filters, userId: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <label>From</label>
//               <input
//                 type="date"
//                 value={filters.from}
//                 onChange={(e) =>
//                   setFilters({ ...filters, from: e.target.value })
//                 }
//               />
//             </div>
//             <div>
//               <label>To</label>
//               <input
//                 type="date"
//                 value={filters.to}
//                 onChange={(e) =>
//                   setFilters({ ...filters, to: e.target.value })
//                 }
//               />
//             </div>
//           </div>
//           <button className="btn btn-primary" type="submit" style={{ marginTop: ".5rem" }}>
//             Apply Filters
//           </button>
//         </form>

//         <div className="table-container" style={{ marginTop: "1rem" }}>
//           <table>
//             <thead>
//               <tr>
//                 <th onClick={() => headerSort("id")}>ID</th>
//                 <th onClick={() => headerSort("amount")}>Amount</th>
//                 <th onClick={() => headerSort("transactionType")}>Type</th>
//                 <th onClick={() => headerSort("status")}>Status</th>
//                 <th onClick={() => headerSort("timestamp")}>Timestamp</th>
//                 <th>Source Wallet</th>
//                 <th>Destination Wallet</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sorted.map((t) => (
//                 <tr key={t.id}>
//                   <td>{t.id}</td>
//                   <td>₹{t.amount}</td>
//                   <td>{t.transactionType}</td>
//                   <td>{t.status}</td>
//                   <td>{new Date(t.timestamp).toLocaleString()}</td>
//                   <td>{t.sourceWallet?.walletId || "—"}</td>
//                   <td>{t.destinationWallet?.walletId || "—"}</td>
//                 </tr>
//               ))}
//               {sorted.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="empty-state">
//                     No transactions.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Simple pager */}
//         <div style={{ marginTop: ".75rem", display: "flex", gap: ".5rem" }}>
//           <button
//             className="btn btn-secondary"
//             onClick={() => load(pageData.page - 1)}
//             disabled={pageData.page <= 0}
//           >
//             Prev
//           </button>
//           <div style={{ alignSelf: "center" }}>
//             Page {pageData.page + 1} of {Math.max(1, pageData.totalPages)}
//           </div>
//           <button
//             className="btn btn-secondary"
//             onClick={() => load(pageData.page + 1)}
//             disabled={pageData.page + 1 >= pageData.totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }





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
  const [loading, setLoading] = useState(false);
  const [gotoValue, setGotoValue] = useState(pageData.page + 1);
  const pageSizeOptions = [10, 20, 50, 100];

  // Load: always include current sort & filters
  const load = async (page = 0, size = pageData.size) => {
    const targetPage = Math.max(0, page);
    const q = {
      page: targetPage,
      size,
      type: filters.type || undefined,
      status: filters.status || undefined,
      userId: filters.userId ? Number(filters.userId) : undefined,
      from: filters.from ? new Date(filters.from).getTime() : undefined,
      to: filters.to ? new Date(filters.to).getTime() : undefined,
      sortField: sort.field,
      sortDir: sort.dir,
    };

    try {
      setLoading(true);
      const res = await getAdminTransactions(q);
      setPageData({
        content: res.content || [],
        totalPages: typeof res.totalPages === "number" ? res.totalPages : 0,
        totalElements: typeof res.totalElements === "number" ? res.totalElements : 0,
        page: typeof res.page === "number" ? res.page : targetPage,
        size: typeof res.size === "number" ? res.size : size,
      });
      setGotoValue((res.page || targetPage) + 1);
    } catch (err) {
      console.error("Failed loading transactions", err);
      setPageData({ content: [], totalPages: 0, totalElements: 0, page: 0, size });
      setGotoValue(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    load(0, pageData.size);
    // eslint-disable-next-line
  }, []);

  // When sort changes, reload current page from server
  useEffect(() => {
    load(pageData.page, pageData.size);
    // eslint-disable-next-line
  }, [sort]);

  const startIndex = pageData.totalElements === 0 ? 0 : pageData.page * pageData.size + 1;
  const endIndex = Math.min(pageData.totalElements, (pageData.page + 1) * pageData.size);

  // Client-side fallback sorted view (if you want instant resort on current page)
  const sorted = useMemo(() => {
    const data = [...(pageData.content || [])];
    const { field, dir } = sort;
    data.sort((a, b) => {
      const va = a[field], vb = b[field];
      let cmp = 0;
      if (field === "timestamp") cmp = new Date(va) - new Date(vb);
      else if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va ?? "").localeCompare(String(vb ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [pageData.content, sort]);

  const headerSort = (field) => {
    setSort((s) =>
      s.field === field ? { field, dir: s.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" }
    );
    // reload triggered by effect on sort
  };

  const submitFilters = (e) => {
    e.preventDefault();
    load(0, pageData.size);
  };

  const onChangePageSize = (newSize) => {
    const sizeNum = Number(newSize);
    load(0, sizeNum);
  };

  const gotoPage = (oneBased) => {
    const target = Number(oneBased) || 1;
    const zeroBased = Math.max(0, Math.min(pageData.totalPages - 1, target - 1));
    load(zeroBased, pageData.size);
  };

  // styles (use your app variables instead if present)
  const styles = {
    primaryBtn: { background: "#0d6efd", color: "#fff", border: "none", padding: ".45rem .7rem", borderRadius: 6 },
    secondaryBtn: { background: "#6c757d", color: "#fff", border: "none", padding: ".45rem .7rem", borderRadius: 6 },
    container: { padding: "1rem", maxWidth: 1100, margin: "0 auto" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { cursor: "pointer", textAlign: "left", padding: ".5rem", borderBottom: "1px solid #e9ecef" },
    td: { padding: ".5rem", borderBottom: "1px solid #f1f3f5" },
    pager: { display: "flex", gap: ".5rem", alignItems: "center", marginTop: ".75rem" },
    smallMuted: { color: "#6c757d", fontSize: ".9rem" },
  };

  return (
    <>
      <Header />
      <div className="container" style={styles.container}>
        <h2>Transaction Audit</h2>

        <form onSubmit={submitFilters}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem" }}>
            <div>
              <label>Type</label>
              <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                {types.map((t) => (
                  <option key={t} value={t}>{t || "Any"}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s || "Any"}</option>
                ))}
              </select>
            </div>
            <div>
              <label>User ID</label>
              <input value={filters.userId} onChange={(e) => setFilters({ ...filters, userId: e.target.value })} placeholder="enter user id" />
            </div>
            <div>
              <label>From</label>
              <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
            </div>
            <div>
              <label>To</label>
              <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
            </div>
          </div>

          <div style={{ marginTop: ".5rem", display: "flex", gap: ".5rem", alignItems: "center" }}>
            <button className="btn" type="submit" style={styles.primaryBtn}>{loading ? "Loading..." : "Apply Filters"}</button>
            <button type="button" className="btn" style={styles.secondaryBtn} onClick={() => { setFilters({ type: "", status: "", userId: "", from: "", to: "" }); load(0, pageData.size); }}>
              Reset
            </button>
            <div style={{ marginLeft: "auto", ...styles.smallMuted }}>
              {startIndex}-{endIndex} of {pageData.totalElements}
            </div>
          </div>
        </form>

        <div className="table-container" style={{ marginTop: "1rem" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => headerSort("id")}>ID</th>
                <th style={styles.th} onClick={() => headerSort("amount")}>Amount</th>
                <th style={styles.th} onClick={() => headerSort("transactionType")}>Type</th>
                <th style={styles.th} onClick={() => headerSort("status")}>Status</th>
                <th style={styles.th} onClick={() => headerSort("timestamp")}>Timestamp</th>
                <th style={styles.th}>Source Wallet</th>
                <th style={styles.th}>Destination Wallet</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>{t.id}</td>
                  <td style={styles.td}>₹{t.amount}</td>
                  <td style={styles.td}>{t.transactionType}</td>
                  <td style={styles.td}>{t.status}</td>
                  <td style={styles.td}>{t.timestamp ? new Date(t.timestamp).toLocaleString() : "—"}</td>
                  <td style={styles.td}>{t.sourceWallet?.walletId ?? "—"}</td>
                  <td style={styles.td}>{t.destinationWallet?.walletId ?? "—"}</td>
                </tr>
              ))}

              {sorted.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state" style={{ padding: "1rem", textAlign: "center" }}>
                    No transactions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pager */}
        <div style={styles.pager}>
          <button
            className="btn"
            onClick={() => load(pageData.page - 1, pageData.size)}
            disabled={pageData.page <= 0}
            style={{ ...styles.secondaryBtn, opacity: pageData.page <= 0 ? 0.6 : 1 }}
          >
            Prev
          </button>

          <span style={styles.smallMuted}>Page {pageData.page + 1} of {Math.max(1, pageData.totalPages)}</span>

          <label style={styles.smallMuted}>| Go to:</label>
          <input
            type="number"
            min="1"
            max={Math.max(1, pageData.totalPages)}
            value={gotoValue}
            onChange={(e) => setGotoValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); gotoPage(gotoValue); } }}
            style={{ width: 70, padding: ".25rem" }}
          />
          <button className="btn" onClick={() => gotoPage(gotoValue)} style={styles.primaryBtn}>Go</button>

          <button
            className="btn"
            onClick={() => load(pageData.page + 1, pageData.size)}
            disabled={pageData.page + 1 >= pageData.totalPages}
            style={{ ...styles.secondaryBtn, opacity: pageData.page + 1 >= pageData.totalPages ? 0.6 : 1 }}
          >
            Next
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem", alignItems: "center" }}>
            <label style={styles.smallMuted}>Rows per page:</label>
            <select value={pageData.size} onChange={(e) => onChangePageSize(e.target.value)}>
              {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
