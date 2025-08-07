import React, { useState } from 'react';
import { transferFunds } from '../utils/api';

const TransferForm = ({ wallets, onTransfer }) => {
  const [sourceWalletId, setSourceWalletId] = useState('');
  const [destinationWalletId, setDestinationWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!sourceWalletId || !destinationWalletId || !amount) {
      setError('All fields are required');
      return;
    }

    if (sourceWalletId === destinationWalletId) {
      setError('Source and destination wallets must differ');
      return;
    }

    try {
      const data = await transferFunds(sourceWalletId, destinationWalletId, amount);
      onTransfer && onTransfer(data);
      setMessage('Transfer successful');
      setSourceWalletId('');
      setDestinationWalletId('');
      setAmount('');
    } catch (err) {
      setError('Transfer failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>From Wallet</label>
      <select
        data-testid="source-wallet"
        value={sourceWalletId}
        onChange={(e) => setSourceWalletId(e.target.value)}
      >
        <option value="">--Select--</option>
        {wallets.map((w) => (
          <option key={w.walletId} value={w.walletId}>{w.walletName}</option>
        ))}
      </select>

      <label>To Wallet</label>
      <select
        data-testid="destination-wallet"
        value={destinationWalletId}
        onChange={(e) => setDestinationWalletId(e.target.value)}
      >
        <option value="">--Select--</option>
        {wallets.map((w) => (
          <option key={w.walletId} value={w.walletId}>{w.walletName}</option>
        ))}
      </select>

      <label>Amount</label>
      <input
        type="number"
        data-testid="transfer-amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button type="submit">Transfer</button>

      {error && <p data-testid="transfer-form-error">{error}</p>}
      {message && <p data-testid="transfer-form-success">{message}</p>}
    </form>
  );
};

export default TransferForm;
