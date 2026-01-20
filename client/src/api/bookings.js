// src/api/bookings.js
import { API_BASE_URL, handleResponse, authHeaders } from './apiClient';

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