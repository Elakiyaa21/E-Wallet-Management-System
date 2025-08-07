import React, { useState } from 'react';
import { depositFunds } from '../utils/api';

const DepositForm = ({ wallets = [], onDeposit }) => {
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!walletId) {
      setError('Wallet must be selected');
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    try {
      const response = await depositFunds(walletId, Number(amount));
      if (onDeposit) onDeposit(response);
      setSuccess('Deposit successful');
      setAmount('');
      setWalletId('');
    } catch (err) {
      setError('Deposit failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="wallet">Wallet:</label>
        <select
          id="wallet"
          data-testid="wallet-select"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
        >
          <option value="">Select Wallet</option>
          {wallets.map((w) => (
            <option key={w.walletId} value={w.walletId}>
              {w.walletName} (Balance: ₹{w.balance})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          data-testid="deposit-amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button type="submit">Deposit</button>

      {error && <div data-testid="deposit-form-error" style={{ color: 'red' }}>{error}</div>}
      {success && <div data-testid="deposit-form-success" style={{ color: 'green' }}>{success}</div>}
    </form>
  );
};

export default DepositForm;
