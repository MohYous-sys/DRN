import { useEffect, useState } from 'react';
import CampaignCard from './components/CampainCard.tsx';
import RecentDonations from './components/RecentDonations.tsx';

type CampaignRow = {
  ID?: number;
  Title?: string;
  Location?: string;
  Description?: string;
  Image?: string;
  Goal?: number;
  CurrentAmount?: number;
  Due?: string;
  Urgency?: string;
  numberOfDonators?: number;
};


function CampaignsComponent() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/campaigns');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (mounted) setCampaigns(data || []);
      } catch (err: any) {
        console.error('Failed to load campaigns', err);
        if (mounted) setError(err.message || 'Failed to load campaigns');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    const handleDonationCompleted = () => {
      if (mounted) {
        load(); 
      }
    };
    window.addEventListener('donation:completed', handleDonationCompleted);

    return () => { 
      mounted = false;
      window.removeEventListener('donation:completed', handleDonationCompleted);
    };
  }, []);

  return (
    <div id="campains" className="pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
      
      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Urgent Campaigns Need Your Help
        </h1>
        <p className="text-lg text-gray-600">
          These disasters are happening right now. Your donation makes an immediate impact.
        </p>
      </header>
      
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((row, index) => {
            const campaignProps = {
                title: row.Title || 'Untitled Campaign',
                location: row.Location || 'Unknown',
                description: row.Description || '',
                update: row.Urgency || 'No updates',
                raised: Number(row.CurrentAmount || 0),
                goal: Number(row.Goal || 0),
                supporters: Number((row as any).numberOfDonators || 0),
                time: row.Due || 'N/A',
                isCritical: (row.Urgency || '').toLowerCase() === 'critical',
                imageSrc: row.Image || ''
            };
            return <CampaignCard key={row.ID ?? index} {...campaignProps} campaignId={row.ID} />;
          })}
          {loading && <div className="col-span-full text-center text-sm text-gray-500 mt-4">Loading campaigns...</div>}
          {error && <div className="col-span-full text-center text-sm text-red-500 mt-4">Error: {error}</div>}
        </section>

        <aside className="lg:col-span-1">
          <RecentDonations />
        </aside>

      </main>
    </div>
  );
}

export default CampaignsComponent;