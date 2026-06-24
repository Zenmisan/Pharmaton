const BASE = import.meta.env.VITE_API_URL || '/api'

export function getToken() {
  return localStorage.getItem('pc_token')
}

export function setToken(token) {
  if (token) localStorage.setItem('pc_token', token)
  else localStorage.removeItem('pc_token')
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  signup: (payload) => apiFetch('/auth/signup', { method: 'POST', body: payload }),
  me: () => apiFetch('/auth/me'),

  search: (q) => apiFetch(`/search?q=${encodeURIComponent(q)}`),

  inventory: () => apiFetch('/inventory'),
  updateInventoryItem: (id, payload) => apiFetch(`/inventory/${id}`, { method: 'PATCH', body: payload }),
  addInventoryItem: (payload) => apiFetch('/inventory', { method: 'POST', body: payload }),

  orders: () => apiFetch('/orders'),
  createOrder: (payload) => apiFetch('/orders', { method: 'POST', body: payload }),
  updateOrder: (id, payload) => apiFetch(`/orders/${id}`, { method: 'PATCH', body: payload }),

  supplierRequests: () => apiFetch('/supplier-requests'),
  createSupplierRequest: (payload) => apiFetch('/supplier-requests', { method: 'POST', body: payload }),
  updateSupplierRequest: (id, status) => apiFetch(`/supplier-requests/${id}`, { method: 'PATCH', body: { status } }),

  alerts: () => apiFetch('/alerts'),
  markAllAlertsRead: () => apiFetch('/alerts/mark-all-read', { method: 'POST' }),

  hospitalNeeds: () => apiFetch('/hospital-needs'),
  updateHospitalNeed: (id, status) => apiFetch(`/hospital-needs/${id}`, { method: 'PATCH', body: { status } }),

  pharmacies: (type) => apiFetch(`/pharmacies${type ? `?type=${type}` : ''}`),
  pharmacy: (id) => apiFetch(`/pharmacies/${id}`),

  ai: (system, user) => apiFetch('/ai', { method: 'POST', body: { system, user } }),

  prescriptionScan: (payload) => apiFetch('/prescription/scan', { method: 'POST', body: payload }),
  prescriptionSearch: (drugs, lat, lng) => apiFetch('/prescription/search', { method: 'POST', body: { drugs, lat, lng } }),
}

export async function adminFetch(path, secret, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': secret,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const adminApi = {
  list:   (secret, status) => adminFetch(`/admin/pharmacists${status ? `?status=${status}` : ''}`, secret),
  verify: (secret, id, notes) => adminFetch(`/admin/pharmacists/${id}/verify`, secret, { method: 'POST', body: { notes } }),
  reject: (secret, id, notes) => adminFetch(`/admin/pharmacists/${id}/reject`, secret, { method: 'POST', body: { notes } }),
  reset:  (secret, id) => adminFetch(`/admin/pharmacists/${id}/reset`, secret, { method: 'POST' }),
}
