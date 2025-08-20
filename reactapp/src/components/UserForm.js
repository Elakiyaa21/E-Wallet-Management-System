
import React, { useState } from 'react';
import { createUser } from '../utils/api';

const UserForm = ({ onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email');
      return;
    }

    try {
      const response = await createUser({ username, email });
      setSuccess('User created');
      setUsername('');
      setEmail('');
      if (onUserCreated) onUserCreated(response);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        data-testid="username-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        data-testid="email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Create User</button>

      {error && <p data-testid="form-error">{error}</p>}
      {success && <p data-testid="form-success">{success}</p>}
    </form>
  );
};

export default UserForm;
