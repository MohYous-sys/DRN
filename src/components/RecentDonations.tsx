import { useEffect, useState } from 'react';

interface DonationItemProps {
  initial: string;
  name: string;
  amount: number;
  campaign: string;
  time: string;
}

const DonationItem = ({ initial, name, amount, campaign, time }: DonationItemProps) => (
  <div className="flex justify-between items-center border-b last:border-b-0 py-2">
    <div className="flex items-center">
      <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 font-bold rounded-full mr-3 text-sm">
        {initial}
      </span>
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-500">to {campaign}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
    <span className="font-bold text-gray-700">${amount.toLocaleString()}</span>
  </div>
);

interface RecentDonationsProps {
  donations?: DonationItemProps[];
}

const RecentDonations = ({ donations }: RecentDonationsProps) => {
  const [items, setItems] = useState<DonationItemProps[]>(donations || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (donations && donations.length > 0) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [donRes, campRes] = await Promise.all([
          fetch('/api/donations', { credentials: 'include' }),
          fetch('/api/campaigns', { credentials: 'include' })
        ]);
        if (!donRes.ok) throw new Error(`Donations status ${donRes.status}`);
        if (!campRes.ok) throw new Error(`Campaigns status ${campRes.status}`);
        const donData = await donRes.json();
        const campData = await campRes.json();

        const campaignMap = new Map<number, string>();
        campData.forEach((c: any) => campaignMap.set(c.ID, c.Title || 'Unknown'));

        // Backend returns donations ordered by ID DESC (newest first)
        // Take first 10 items (most recent) and display in same order
        // Result: newest donation appears first in the list, oldest of the 10 appears last
        const mapped = (donData || []).slice(0, 10).map((d: any) => {
          // Use DonorUsername if available (from backend JOIN), otherwise fall back to 'Anonymous'
          // Donor is the user ID (number), DonorUsername is the username (string)
          const name = d.DonorUsername || 'Anonymous';
          // Ensure name is a string before calling charAt
          const nameStr = String(name || 'Anonymous');
          const initial = nameStr ? nameStr.charAt(0).toUpperCase() : 'A';
          const amount = Number(d.Amount || 0);
          const campaign = campaignMap.get(Number(d.CampaignID)) || 'General Fund';
          const time = d.CreatedAt || d.created_at || 'just now';
          return { initial, name: nameStr, amount, campaign, time } as DonationItemProps;
        });

        if (mounted) setItems(mapped);
      } catch (err: any) {
        console.error('Failed to load recent donations', err);
        if (mounted) setError(err.message || 'Failed to load donations');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [donations]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        Recent Donations
      </h3>
      <div>
        {loading && <p className="text-sm text-gray-500">Loading recent donations...</p>}
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
        {items.map((d, index) => (
          <DonationItem key={index} {...d} />
        ))}
      </div>
    </div>
  );
};

export default RecentDonations;