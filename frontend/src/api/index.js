import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginWithTelegram = (data) => api.post('/auth/telegram-login', data);
export const getSubscriptionStatus = () => api.get('/subscription/status');
export const checkPro = () => api.get('/subscription/check');
export const getEditorConfig = () => api.get('/editor/config');
export const exportProject = (data) => api.post('/editor/export', data);
export const grantSubscription = (telegramId, days) => api.post('/admin/grant', { telegramId, days });
export const getUsers = () => api.get('/admin/users');