const API_BASE = import.meta.env.VITE_API_BASE || '';

export interface StatsResponse {
  totalDonations: number;
  numberOfSupplies: number;
  donors: number;
  activeCampaigns: number;
}

async function handleRes(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/api/stats`, { credentials: 'include' });
  return handleRes(res);
}

export async function getCampaigns(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/campaigns`, { credentials: 'include' });
  return handleRes(res);
}

export async function getDonations(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/donations`, { credentials: 'include' });
  return handleRes(res);
}

export async function createCampaign(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/campaigns`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function updateCampaign(id: number | string, payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function deleteCampaign(id: number | string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleRes(res);
}

// Session status (useful for admin-only actions). Returns { loggedIn: boolean, user?: { id, username, isAdmin } }
export async function getSessionStatus(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/users/status`, { credentials: 'include' });
  return handleRes(res);
}

export default {
  getStats,
  getCampaigns,
  getDonations,
  getSessionStatus,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
