import React, { useEffect, useState } from 'react';
import { getTransactionHistory } from '../utils/api';

const TransactionHistory = ({ walletId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTxs = async () => {
      if (!walletId) return;
      try {
        const txs = await getTransactionHistory(walletId);
        setTransactions(txs);
      } catch (err) {
        console.error('Failed to load transactions');
      }
    };
    fetchTxs();
  }, [walletId]);

  return (
    <div data-testid="transaction-history">
      {!walletId || transactions.length === 0 ? (
        <p>No transactions available</p>
      ) : (
        <ul>
          {transactions.map(tx => (
            <li key={tx.transactionId} data-testid={`tx-${tx.transactionId}`}>
              <strong>{tx.transactionType}</strong> of ₹{tx.amount} — Status: {tx.status}
              <br />
              {tx.sourceWallet && <span>From: {tx.sourceWallet.walletName} </span>}
              {tx.destinationWallet && <span>To: {tx.destinationWallet.walletName} </span>}
              <br />
              <em>{new Date(tx.timestamp).toLocaleString()}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
