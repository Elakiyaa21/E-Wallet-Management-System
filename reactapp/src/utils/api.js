import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/complaints';

const ComplaintService = {
  getAllComplaints: () => axios.get(BASE_URL),
  getComplaintById: (id) => axios.get(`${BASE_URL}/${id}`),
  createComplaint: (complaint) => axios.post(BASE_URL, complaint),
  updateComplaint: (id, complaint) => axios.put(`${BASE_URL}/${id}`, complaint),
  deleteComplaint: (id) => axios.delete(`${BASE_URL}/${id}`),
  getComplaintsByStatus: (status) => axios.get(`${BASE_URL}/status/${encodeURIComponent(status)}`),
  getComplaintsByCategory: (category) => axios.get(`${BASE_URL}/category/${encodeURIComponent(category)}`)
};
export default ComplaintService;
