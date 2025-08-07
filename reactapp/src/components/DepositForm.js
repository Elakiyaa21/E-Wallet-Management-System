import React, { useState } from 'react';
import { depositFunds } from '../utils/api';

const DepositForm = ({ wallets, onDeposit }) => {
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!walletId) {
      setError('Wallet must be selected');
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    try {
      const data = await depositFunds(walletId, amount);
      onDeposit && onDeposit(data);
      setMessage('Deposit successful');
      setWalletId('');
      setAmount('');
    } catch (err) {
      setError('Failed to deposit');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="wallet">Wallet</label>
      <select
        id="wallet"
        data-testid="wallet-select"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
      >
        <option value="">-- Select Wallet --</option>
        {wallets.map((wallet) => (
          <option key={wallet.walletId} value={wallet.walletId}>
            {wallet.walletName}
          </option>
        ))}
      </select>

      <label htmlFor="amount">Amount</label>
      <input
        type="number"
        id="amount"
        data-testid="deposit-amount-input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button type="submit">Deposit</button>

      {error && <p data-testid="deposit-form-error">{error}</p>}
      {message && <p data-testid="deposit-form-success">{message}</p>}
    </form>
  );
};

export default DepositForm;
