import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TransactionHistory from '../components/TransactionHistory';
import * as api from '../utils/api';

jest.mock('axios');

describe('TransactionHistory', () => {
  beforeEach(() => {
    jest.spyOn(api, 'getTransactionHistory').mockImplementation(jest.fn());
  });
  afterEach(() => jest.clearAllMocks());

  it('shows empty state when no walletId', () => {
    render(<TransactionHistory walletId={null} />);
    expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    expect(screen.getByText(/no transactions/i)).toBeInTheDocument();
  });

  it('shows transaction list after successful fetch', async () => {
    const txs = [
      { transactionId: 1, transactionType: 'DEPOSIT', amount: 100, status: 'COMPLETED', sourceWallet: null, destinationWallet: { walletName: 'Primary' }, timestamp: new Date().toISOString() },
      { transactionId: 2, transactionType: 'TRANSFER', amount: 30, status: 'COMPLETED', sourceWallet: { walletName: 'Primary' }, destinationWallet: { walletName: 'Savings' }, timestamp: new Date().toISOString() }
    ];
    api.getTransactionHistory.mockResolvedValueOnce(txs);
    render(<TransactionHistory walletId={1} />);
    expect(await screen.findByTestId('tx-1')).toBeInTheDocument();
    expect(await screen.findByTestId('tx-2')).toBeInTheDocument();
    expect(screen.getByText('DEPOSIT')).toBeInTheDocument();
    expect(screen.getByText('TRANSFER')).toBeInTheDocument();
  });
});
