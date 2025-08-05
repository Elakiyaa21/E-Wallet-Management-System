import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletForm from '../components/WalletForm';
import * as api from '../utils/api';

jest.mock('axios');

describe('WalletForm', () => {
  const users = [
    { userId: 1, username: 'john_doe' },
    { userId: 2, username: 'jane_doe' }
  ];
  beforeEach(() => {
    jest.spyOn(api, 'createWallet').mockImplementation(jest.fn());
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and user dropdown', () => {
    render(<WalletForm users={users} />);
    expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/wallet name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create wallet/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<WalletForm users={users} />);
    fireEvent.click(screen.getByRole('button', { name: /create wallet/i }));
    expect(await screen.findByTestId('wallet-form-error')).toHaveTextContent(/User must be selected/);
  });

  it('submits on valid input and resets', async () => {
    api.createWallet.mockResolvedValueOnce({ walletId: 1, walletName: 'Savings', balance: 0 });
    const mockOnWalletCreated = jest.fn(wallet => {});
    render(<WalletForm users={users} onWalletCreated={mockOnWalletCreated} />);
    fireEvent.change(screen.getByTestId('user-select'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('wallet-name-input'), { target: { value: 'Savings' } });
    fireEvent.click(screen.getByRole('button', { name: /create wallet/i }));
    await waitFor(() => expect(api.createWallet).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockOnWalletCreated).toHaveBeenCalled());
    expect(mockOnWalletCreated).toHaveBeenCalledWith({ walletId: 1, walletName: 'Savings', balance: 0 });
    expect(await screen.findByTestId('wallet-form-success')).toHaveTextContent(/wallet created/i);
  });
});
