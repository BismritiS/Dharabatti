// src/api/auth.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function handleResponse(res) {
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

export async function loginRequest(credentials) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res); // { token, user }
}

const AUTH_KEY = 'auth';

export function saveAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}