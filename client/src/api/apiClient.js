// src/api/apiClient.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let msg = 'Request failed';
    if (data.message) msg = data.message;
    else if (data.error) msg = data.error;
    else if (Array.isArray(data.errors) && data.errors.length > 0) {
      msg = data.errors[0].msg || msg;
    }
    throw new Error(msg);
  }
  return data;
}

export function authHeaders() {
  const raw = localStorage.getItem('auth');
  const auth = raw ? JSON.parse(raw) : null;
  if (auth?.token) {
    return { Authorization: `Bearer ${auth.token}` };
  }
  return {};
}
