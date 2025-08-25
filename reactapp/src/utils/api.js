import axios from "axios";

// const BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const BASE_URL = "https://e-wallet-management-system.onrender.com";

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ===== AUTH =====
export const login = (email, password) =>
  API.post("/api/auth/login", { email, password }).then((res) => res.data);

export const register = (username, email, password) =>
  API.post("/api/auth/register", {
    name: username,
    email,
    password,
    role: "USER"
  }).then((res) => res.data);

export const getProfile = () => API.get("/api/auth/me").then((res) => res.data);

// ===== USER =====
export const getAdminUsers = () => API.get("/users").then((res) => res.data);

// ===== WALLET (JWT) =====
export const createWallet = (walletName) =>
  API.post("/api/wallet/create", { walletName }).then((res) => res.data);

export const getMyWallets = () =>
  API.get("/api/wallet/me").then((res) => res.data);

export const checkBalance = (walletId) =>
  API.get(`/api/wallet/${walletId}/balance`).then((res) => res.data);

export const topUpWallet = (amount) =>
  API.post("/api/wallet/top-up", { amount }).then((res) => res.data);

export const transferByEmail = (recipientEmail, amount) =>
  API.post("/api/wallet/transfer", { recipientEmail, amount }).then((res) => res.data);

// ===== TRANSACTIONS (JWT) =====
export const getMyTransactions = (params) =>
  API.get("/api/transactions", { params }).then((res) => res.data);

export const getAdminTransactions = (params) =>
  API.get("/api/admin/transactions", { params }).then((res) => res.data);

export const getAdminTransactionsByUser = (userId) =>
  API.get(`/api/admin/transactions/user/${userId}`).then((res) => res.data);

export const getTransactionDetails = (id) =>
  API.get(`/api/admin/transactions/${id}`).then((res) => res.data);

// ===== ADMIN STATS =====
export const getAdminStats = () =>
  API.get("/api/admin/stats").then((res) => res.data);

// ===================== LEGACY (NO AUTH) =====================
// Users
export const createUserLegacy = (name, email) =>
  axios
    .post(
      `${BASE_URL}/users?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
    )
    .then((res) => res.data);

export const getUsersLegacy = () =>
  axios.get(`${BASE_URL}/users`).then((res) => res.data);

export const updateUserLegacy = (id, name, email) =>
  axios
    .put(
      `${BASE_URL}/users/${id}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
    )
    .then((res) => res.data);

export const deleteUserLegacy = (id) =>
  axios.delete(`${BASE_URL}/users/${id}`);

// Wallets
export const createWalletLegacy = (userId, walletName) =>
  axios
    .post(
      `${BASE_URL}/wallets?userId=${userId}&walletName=${encodeURIComponent(walletName)}`
    )
    .then((res) => res.data);

export const depositLegacy = (walletId, amount) =>
  axios
    .post(`${BASE_URL}/wallets/${walletId}/deposit?amount=${amount}`)
    .then((res) => res.data);

export const transferLegacy = (sourceId, destinationId, amount) =>
  axios
    .post(
      `${BASE_URL}/wallets/transfer?sourceId=${sourceId}&destinationId=${destinationId}&amount=${amount}`
    )
    .then((res) => res.data);

export const getWalletsLegacy = () =>
  axios.get(`${BASE_URL}/wallets`).then((res) => res.data);

export const getWalletLegacy = (walletId) =>
  axios.get(`${BASE_URL}/wallets/${walletId}`).then((res) => res.data);

export const updateWalletLegacy = (walletId, name) =>
  axios
    .put(`${BASE_URL}/wallets/${walletId}?name=${encodeURIComponent(name)}`)
    .then((res) => res.data);

export const deleteWalletLegacy = (walletId) =>
  axios.delete(`${BASE_URL}/wallets/${walletId}`);

// Transactions (legacy)
export const getTransactionsByWalletLegacy = (walletId) =>
  axios
    .get(`${BASE_URL}/transactions/wallet/${walletId}`)
    .then((res) => res.data);

// ===== ALIASES FOR OLD IMPORTS =====
export const getAuthProfile = getProfile;
export const getAuthProfileSync = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");

  if (!token || !role) return null;
  return { token, role, email, userId };
};
export const getUserTransactions = getMyTransactions;
export const getMyWallet = getMyWallets;
export const createWalletJWT = createWallet;

export const getTransactionHistory = (walletId) =>
  API.get(`/wallets/${walletId}/transactions`).then((res) => res.data);

export const depositFunds = (walletId, amount) =>
  API.post(`/wallets/${walletId}/deposit`, { amount }).then((res) => res.data);

export const transferFunds = (walletId, recipientId, amount) =>
  API.post(`/wallets/${walletId}/transfer`, { recipientId, amount }).then((res) => res.data);

export const createUser = (user) =>
  API.post(`/users`, user).then((res) => res.data);