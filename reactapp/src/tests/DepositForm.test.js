import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import DepositForm from '../components/DepositForm';
import * as api from '../utils/api';

jest.mock('axios');

describe('DepositForm', () => {
  const wallets = [
    { walletId: 1, walletName: 'Primary', balance: 100.00 },
    { walletId: 2, walletName: 'Savings', balance: 0.00 }
  ];
  beforeEach(() => {
    jest.spyOn(api, 'depositFunds').mockImplementation(jest.fn());
  });
  afterEach(() => jest.clearAllMocks());

  it('renders all fields and dropdown', () => {
    render(<DepositForm wallets={wallets} />);
    expect(screen.getByLabelText(/wallet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deposit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<DepositForm wallets={wallets} />);
    fireEvent.click(screen.getByRole('button', { name: /deposit/i }));
    expect(await screen.findByTestId('deposit-form-error')).toHaveTextContent(/wallet must be selected/i);
  });

  it('calls api on valid submit & resets', async () => {
    api.depositFunds.mockResolvedValueOnce({ walletId: 1, balance: 150.00, walletName: 'Primary' });
    const onDeposit = jest.fn((wallet) => {});
    render(<DepositForm wallets={wallets} onDeposit={onDeposit} />);
    fireEvent.change(screen.getByTestId('wallet-select'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('deposit-amount-input'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /deposit/i }));
    await waitFor(() => expect(api.depositFunds).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onDeposit).toHaveBeenCalled());
    expect(onDeposit).toHaveBeenCalledWith({ walletId: 1, balance: 150.00, walletName: 'Primary' });
    expect(await screen.findByTestId('deposit-form-success')).toHaveTextContent(/deposit successful/i);
  });
});
