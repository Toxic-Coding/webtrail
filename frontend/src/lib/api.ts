const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export type Site = {
  _id: string;
  address: string;
  title: string;
  html: string;
  author: string;
  createdAt: string;
};

export type Person = {
  _id: string;
  name: string;
};

export type Visit = {
  _id: string;
  person: string;
  address: string;
  arrivedVia: 'typed' | 'link' | 'back' | 'forward' | 'history';
  visitedAt: string;
};

export type ArrivedVia = Visit['arrivedVia'];

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getSite: (address: string) =>
    request<Site>(`/sites/${encodeURIComponent(address)}`),

  publishSite: (data: { address: string; title: string; html: string; author: string }) =>
    request<Site>('/sites', { method: 'POST', body: JSON.stringify(data) }),

  searchSites: (query: string) =>
    request<Site[]>(`/sites/search/${encodeURIComponent(query)}`),

  getPeople: () => request<Person[]>('/people'),

  recordVisit: (data: { person: string; address: string; arrivedVia: ArrivedVia }) =>
    request<Visit>('/visits', { method: 'POST', body: JSON.stringify(data) }),

  getHistory: (person: string) =>
    request<Visit[]>(`/visits/${encodeURIComponent(person)}`),
};