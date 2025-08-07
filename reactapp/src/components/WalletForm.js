import React, { useState } from 'react';
import { createWallet } from '../utils/api';

const WalletForm = ({ onCreate }) => {
  const [walletName, setWalletName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const wallet = await createWallet({ walletName });
      onCreate && onCreate(wallet);
      setMessage('Wallet created');
      setWalletName('');
    } catch (err) {
      setMessage('Failed to create wallet');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Wallet Name</label>
      <input
        data-testid="wallet-name"
        value={walletName}
        onChange={(e) => setWalletName(e.target.value)}
      />

      <button type="submit">Create</button>

      {message && <p data-testid="wallet-form-msg">{message}</p>}
    </form>
  );
};

export default WalletForm;
