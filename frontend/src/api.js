export async function api(path, opts) {
  const base = import.meta.env.VITE_API_BASE || '';
  const res = await fetch(base + path, opts);
  if (!res.ok) {
    try { return await res.json(); } catch(e) { throw new Error('API error'); }
  }
  return await res.json();
}

export const apiClient = api;
