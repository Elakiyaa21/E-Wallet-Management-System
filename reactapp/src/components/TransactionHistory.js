import React, { useEffect, useState } from 'react';
import { getTransactionHistory } from '../utils/api';

const TransactionHistory = ({ walletId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletId) return;

      try {
        const txs = await getTransactionHistory(walletId);
        setTransactions(txs);
      } catch (err) {
        console.error('Failed to load transactions', err);
      }
    };

    fetchData();
  }, [walletId]);

  return (
    <div data-testid="transaction-history">
      {!walletId ? (
        <p>No transactions available</p>
      ) : transactions.length === 0 ? (
        <p>Loading transactions...</p>
      ) : (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.transactionId} data-testid={`tx-${tx.transactionId}`}>
              <strong>{tx.transactionType}</strong> of ₹{tx.amount} - Status: {tx.status} <br />
              {tx.sourceWallet && <span>From: {tx.sourceWallet.walletName} </span>}
              {tx.destinationWallet && <span>To: {tx.destinationWallet.walletName} </span>}
              <br />
              <small>{new Date(tx.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
