// src/utils/api.js
import axios from 'axios';

// Base URLs
const BASE_URL = 'http://localhost:8080/api';
const USER_URL = `${BASE_URL}/users`;
const WALLET_URL = `${BASE_URL}/wallets`;
const TRANSACTION_URL = `${BASE_URL}/transactions`;
const COMPLAINT_URL = `${BASE_URL}/complaints`;

// ===== User API =====
export const getAllUsers = () => axios.get(USER_URL);
export const getUserById = (id) => axios.get(`${USER_URL}/${id}`);
export const createUser = (user) => axios.post(USER_URL, user);
export const updateUser = (id, user) => axios.put(`${USER_URL}/${id}`, user);
export const deleteUser = (id) => axios.delete(`${USER_URL}/${id}`);

// ===== Wallet API =====
export const getAllWallets = () => axios.get(WALLET_URL);
export const getWalletById = (id) => axios.get(`${WALLET_URL}/${id}`);
export const createWallet = (wallet) => axios.post(WALLET_URL, wallet);
export const updateWallet = (id, wallet) => axios.put(`${WALLET_URL}/${id}`, wallet);
export const deleteWallet = (id) => axios.delete(`${WALLET_URL}/${id}`);

// ✅ Required for DepositForm.test.js
export const depositFunds = (walletId, amount) =>
  axios.post(`${WALLET_URL}/${walletId}/deposit?amount=${amount}`);

// ===== Transfer API =====
export const transferFunds = (sourceWalletId, targetWalletId, amount) =>
  axios.post(`${WALLET_URL}/${sourceWalletId}/transfer/${targetWalletId}?amount=${amount}`);

// ===== Transaction API =====
export const getTransactionsByWalletId = (walletId) =>
  axios.get(`${TRANSACTION_URL}/wallet/${walletId}`);

// ✅ Alias to satisfy TransactionHistory.test.js
export const getTransactionHistory = getTransactionsByWalletId;

// ===== Complaint API =====
export const getAllComplaints = () => axios.get(COMPLAINT_URL);
export const getComplaintById = (id) => axios.get(`${COMPLAINT_URL}/${id}`);
export const createComplaint = (complaint) => axios.post(COMPLAINT_URL, complaint);
export const updateComplaint = (id, complaint) => axios.put(`${COMPLAINT_URL}/${id}`, complaint);
export const deleteComplaint = (id) => axios.delete(`${COMPLAINT_URL}/${id}`);
export const getComplaintsByStatus = (status) =>
  axios.get(`${COMPLAINT_URL}/status/${encodeURIComponent(status)}`);
export const getComplaintsByCategory = (category) =>
  axios.get(`${COMPLAINT_URL}/category/${encodeURIComponent(category)}`);
