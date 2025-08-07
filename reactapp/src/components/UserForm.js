import React, { useState } from 'react';
import { createUser } from '../utils/api';

const UserForm = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await createUser({ name, email });
      onCreate && onCreate(user);
      setMessage('User created');
      setName('');
      setEmail('');
    } catch (err) {
      setMessage('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        data-testid="user-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Email</label>
      <input
        data-testid="user-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Create</button>

      {message && <p data-testid="user-form-msg">{message}</p>}
    </form>
  );
};

export default UserForm;
