// src/api/users.js
import { API_BASE_URL, handleResponse, authHeaders } from './apiClient';

export async function fetchUsers({ page = 1, limit = 20 } = {}) {
  const url = new URL(`${API_BASE_URL}/api/users`);
  url.searchParams.set('page', page);
  url.searchParams.set('limit', limit);

  const res = await fetch(url, {
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res);
}

export async function createUser(payload) {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateUser(id, payload) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res);
}