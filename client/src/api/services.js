// src/api/services.js
import { API_BASE_URL, handleResponse, authHeaders } from './apiClient';

export async function getServices({ includeInactive = false, signal } = {}) {
  const url = new URL(`${API_BASE_URL}/api/services`);
  if (includeInactive) {
    url.searchParams.set('includeInactive', 'true');
  }

  const res = await fetch(url, {
    headers: {
      ...authHeaders(),
    },
    signal,
  });
  return handleResponse(res);
}

export async function getServiceById(id, { signal } = {}) {
  const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
    headers: {
      ...authHeaders(),
    },
    signal,
  });
  return handleResponse(res);
}

export async function createService(payload) {
  const res = await fetch(`${API_BASE_URL}/api/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateService(id, payload) {
  const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteService(id) {
  const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res);
}
