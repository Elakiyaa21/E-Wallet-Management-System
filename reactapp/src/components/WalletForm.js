import React, { useState } from 'react';
import { createWallet } from '../utils/api';

const WalletForm = ({ users, onWalletCreated }) => {
  const [userId, setUserId] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId || !walletName.trim()) {
      setError('User must be selected and Wallet Name must be provided');
      return;
    }

    try {
      const wallet = await createWallet({ userId: parseInt(userId), walletName });
      if (onWalletCreated) onWalletCreated(wallet);
      setSuccess('Wallet created successfully');
      setUserId('');
      setWalletName('');
    } catch (err) {
      setError('Error creating wallet');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="user">User</label>
        <select
          data-testid="user-select"
          id="user"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.userId} value={user.userId}>{user.username}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="walletName">Wallet Name</label>
        <input
          data-testid="wallet-name-input"
          id="walletName"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
        />
      </div>
      <button type="submit">Create Wallet</button>
      {error && <div data-testid="wallet-form-error">{error}</div>}
      {success && <div data-testid="wallet-form-success">{success}</div>}
    </form>
  );
};

export default WalletForm;
