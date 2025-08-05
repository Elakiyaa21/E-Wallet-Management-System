import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TransferForm from '../components/TransferForm';
import * as api from '../utils/api';

jest.mock('axios'); // ESM-safe

describe('TransferForm', () => {
  const wallets = [
    { walletId: 1, walletName: 'Primary', balance: 100.00 },
    { walletId: 2, walletName: 'Savings', balance: 0.00 }
  ];
  beforeEach(() => {
    jest.spyOn(api, 'transferFunds').mockImplementation(jest.fn());
  });
  afterEach(() => jest.clearAllMocks());

  it('renders all fields and dropdowns', () => {
    render(<TransferForm wallets={wallets} />);
    expect(screen.getByLabelText(/source wallet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination wallet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transfer/i })).toBeInTheDocument();
  });

  it('validates form', async () => {
    render(<TransferForm wallets={wallets} />);
    fireEvent.click(screen.getByRole('button', { name: /transfer/i }));
    expect(await screen.findByTestId('transfer-form-error')).toHaveTextContent(/select source wallet/i);
  });

  it('calls api on valid submit & resets', async () => {
    api.transferFunds.mockResolvedValueOnce({ transactionId: 10, amount: 30, sourceWallet: { walletId: 1 }, destinationWallet: { walletId: 2 } });
    const onTransfer = jest.fn(tx => {});
    render(<TransferForm wallets={wallets} onTransfer={onTransfer} />);
    fireEvent.change(screen.getByTestId('source-wallet-select'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('destination-wallet-select'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('transfer-amount-input'), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /transfer/i }));
    await waitFor(() => expect(api.transferFunds).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onTransfer).toHaveBeenCalled());
    expect(onTransfer).toHaveBeenCalledWith({ transactionId: 10, amount: 30, sourceWallet: { walletId: 1 }, destinationWallet: { walletId: 2 } });
    expect(await screen.findByTestId('transfer-form-success')).toHaveTextContent(/transfer successful/i);
  });
});
