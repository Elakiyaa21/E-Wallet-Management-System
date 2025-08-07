import React, { useEffect, useState } from 'react';
import { getTransactionHistory } from '../utils/api';

const TransactionHistory = ({ walletId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletId) return;
      try {
        const data = await getTransactionHistory(walletId);
        setTransactions(data);
      } catch (err) {
        setTransactions([]);
      }
    };
    fetchData();
  }, [walletId]);

  return (
    <div data-testid="transaction-history">
      {walletId && transactions.length > 0 ? (
        <ul>
          {transactions.map((tx) => (
            <li key={tx.transactionId} data-testid={`tx-${tx.transactionId}`}>
              <p>{tx.transactionType}</p>
              <p>{tx.amount}</p>
              <p>{tx.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions</p>
      )}
    </div>
  );
};

export default TransactionHistory;
