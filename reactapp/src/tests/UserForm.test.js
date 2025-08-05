import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from '../components/UserForm';
import * as api from '../utils/api';

jest.mock('axios'); // <-- KEY for modern ESM axios use in each test!

describe('UserForm', () => {
  beforeEach(() => {
    jest.spyOn(api, 'createUser').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<UserForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<UserForm />);
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));
    expect(await screen.findByTestId('form-error')).toHaveTextContent(/required/i);
  });

  it('shows error for invalid email', async () => {
    render(<UserForm />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'john' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'invalidemail' } });
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));
    expect(await screen.findByTestId('form-error')).toHaveTextContent(/invalid email/i);
  });

  it('calls api on valid submit & resets', async () => {
    api.createUser.mockResolvedValueOnce({ userId: 1, username: 'johnny', email: 'john@example.com' });
    const mockOnUserCreated = jest.fn((user) => {});
    render(<UserForm onUserCreated={mockOnUserCreated} />);
    fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'johnny' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));
    await waitFor(() => expect(api.createUser).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockOnUserCreated).toHaveBeenCalled());
    expect(mockOnUserCreated).toHaveBeenCalledWith({ userId: 1, username: 'johnny', email: 'john@example.com' });
    expect(await screen.findByTestId('form-success')).toHaveTextContent(/User created/i);
  });
});
