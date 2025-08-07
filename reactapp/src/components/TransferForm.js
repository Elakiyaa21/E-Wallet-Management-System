import React, { useState } from 'react';
import { transferFunds } from '../utils/api';

const TransferForm = ({ wallets, onTransfer }) => {
  const [sourceId, setSourceId] = useState('');
  const [destId, setDestId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!sourceId || !destId || !amount) {
      setError('Please select source wallet, destination wallet, and enter an amount');
      return;
    }

    if (sourceId === destId) {
      setError('Source and destination wallets must be different');
      return;
    }

    try {
      const transfer = await transferFunds({
        sourceWalletId: parseInt(sourceId),
        destinationWalletId: parseInt(destId),
        amount: parseFloat(amount),
      });
      if (onTransfer) onTransfer(transfer);
      setSuccess('Transfer successful');
      setSourceId('');
      setDestId('');
      setAmount('');
    } catch (err) {
      setError('Transfer failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="source">Source Wallet</label>
        <select
          data-testid="source-wallet-select"
          id="source"
          value={sourceId}
          onChange={(e) => setSourceId(e.target.value)}
        >
          <option value="">Select Wallet</option>
          {wallets.map(w => (
            <option key={w.walletId} value={w.walletId}>
              {w.walletName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="destination">Destination Wallet</label>
        <select
          data-testid="destination-wallet-select"
          id="destination"
          value={destId}
          onChange={(e) => setDestId(e.target.value)}
        >
          <option value="">Select Wallet</option>
          {wallets.map(w => (
            <option key={w.walletId} value={w.walletId}>
              {w.walletName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="amount">Amount</label>
        <input
          data-testid="transfer-amount-input"
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button type="submit">Transfer</button>
      {error && <div data-testid="transfer-form-error">{error}</div>}
      {success && <div data-testid="transfer-form-success">{success}</div>}
    </form>
  );
};

export default TransferForm;
