import React, { useEffect, useState } from "react";
import Header from "./Header";
import { getUsersLegacy, getAdminTransactionsByUser } from "../utils/api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userTx, setUserTx] = useState([]);

  useEffect(() => {
    getUsersLegacy().then(setUsers).catch(() => setUsers([])
    );
  }, []);

  const openUserTx = async (u) => {
    setSelected(u);
    const page = await getAdminTransactionsByUser(u.userId, {
      size: 50,
      page: 0,
    }).catch(() => ({ content: [] }));
    setUserTx(page.content || []);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Users</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => openUserTx(u)}
                    >
                      View Transactions
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <div style={{ marginTop: "1rem" }}>
            <h3>
              Transactions for {selected.username} (ID {selected.userId})
            </h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {userTx.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>₹{t.amount}</td>
                      <td>{t.transactionType}</td>
                      <td>{t.status}</td>
                      <td>{new Date(t.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                  {userTx.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No transactions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
