const API_BASE = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API-virhe: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getData: () => request('/data'),
  updateSiteInfo: (payload) =>
    request('/site-info', { method: 'PUT', body: JSON.stringify(payload) }),
  createItem: (collection, payload) =>
    request(`/${collection}`, { method: 'POST', body: JSON.stringify(payload) }),
  updateItem: (collection, id, payload) =>
    request(`/${collection}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteItem: (collection, id) => request(`/${collection}/${id}`, { method: 'DELETE' })
};
