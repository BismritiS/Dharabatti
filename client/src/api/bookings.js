// src/api/bookings.js
import { getAuth } from './auth';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function authHeaders() {
  const auth = getAuth();
  if (auth?.token) {
    return { Authorization: `Bearer ${auth.token}` };
  }
  return {};
}

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

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * Fetches the current user's bookings
 * @param {Object} options - Optional parameters
 * @param {AbortSignal} [options.signal] - Optional AbortSignal to cancel the request
 * @returns {Promise<Object>} The response data
 */
export async function getMyBookings({ signal } = {}) {
  const res = await fetch(`${API_BASE_URL}/api/bookings/me`, {
    headers: {
      ...authHeaders(),
    },
    signal,
  });
  return handleResponse(res);
}