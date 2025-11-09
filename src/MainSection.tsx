
import { useEffect, useState } from 'react';
import { Heart, Users, MapPin, Package, Radio, TrendingUp } from "lucide-react";

type Stats = {
  totalDonations: number;
  numberOfSupplies: number;
  donors: number;
  activeCampaigns: number;
};

function formatCurrencyShort(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K+`;
  return `$${n}`;
}

export default function MainSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load fresh stats from the server
  const loadStats = async (mounted = true) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stats', { credentials: 'include' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (mounted) setStats({
        totalDonations: Number(data.totalDonations || 0),
        numberOfSupplies: Number(data.numberOfSupplies || 0),
        donors: Number(data.donors || 0),
        activeCampaigns: Number(data.activeCampaigns || 0),
      });
    } catch (err: any) {
      console.error('Failed to load stats', err);
      if (mounted) setError(err.message || 'Failed to load stats');
    } finally {
      if (mounted) setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    loadStats(mounted);
    return () => { mounted = false; };
  }, []);

  // Refresh stats from server when a donation is completed
  useEffect(() => {
    const handler = async (e: Event) => {
      try {
        // Give the backend a moment to process the donation
        await new Promise(resolve => setTimeout(resolve, 500));
        // Fetch fresh stats that include the new donation
        await loadStats(true);
      } catch (err) {
        console.warn('Failed to refresh stats after donation', err);
      }
    };
    window.addEventListener('donation:completed', handler as EventListener);
    return () => window.removeEventListener('donation:completed', handler as EventListener);
  }, []);

  const displayed = {
    totalRaised: stats ? formatCurrencyShort(stats.totalDonations) : '$0',
    peopleHelped: stats ? stats.donors.toLocaleString() : '0',
    activeDisasters: stats ? String(stats.activeCampaigns) : '0',
    suppliesSent: stats ? stats.numberOfSupplies.toLocaleString() : '0'
  };

  return (
    <div className="pb-12 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-6xl mt-12 rounded-xl overflow-hidden shadow-md relative">
        <img
          src="https://images.pexels.com/photos/68138/fire-danger-dangerous-fight-68138.jpeg"
          className="w-full h-[425px] object-cover"
        />
        <div className="absolute inset-0 bg-orange-400/70 flex flex-col justify-center items-center text-center px-6 text-white">
          <span className="mb-4 bg-white/20 text-sm px-6 py-2 rounded-full">
          4 Active Disasters Need Your Help Now
          </span>
          <h1 className="text-5xl font-normal leading-tight mb-3">
            Every Second Counts. <br /> Every Donation Saves Lives.
          </h1>
          <p className="max-w-2xl text-white/90 mb-6">
            AI-powered disaster response connecting your donations directly to
            people in crisis. Track real-time impact. See exactly where your
            money goes.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-md shadow hover:bg-gray-100 transition">
              Donate Now
            </button>
            <button className="bg-transparent border border-white px-6 py-2 rounded-md hover:bg-white/20 transition">
              Track Impact
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 max-w-6xl w-full">
        {[
          { label: "Total Raised", value: displayed.totalRaised, icon: Heart, color: "text-red-500" },
          { label: "People Helped", value: displayed.peopleHelped, icon: Users, color: "text-blue-500" },
          { label: "Active Disasters", value: displayed.activeDisasters, icon: MapPin, color: "text-orange-500" },
          { label: "Supplies Sent", value: displayed.suppliesSent, icon: Package, color: "text-green-500" },
          { label: "AI Sensors", value: "156", icon: Radio, color: "text-purple-500" },
          { label: "Response Time", value: "12min", icon: TrendingUp, color: "text-teal-500" },
        ].map((item, i) => (
          
          <div
            key={i}
            className="rounded-xl border-2 border-gray-200 p-6 text-center flex flex-col items-center hover:shadow-md transition-shadow"
          >
            <item.icon className={`mb-4 ${item.color}`} size={32} />
            <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
            <p className="text-gray-600 text-sm">{item.label}</p>
          </div>
        ))}
          {loading && (
            <div className="col-span-full text-center text-sm text-gray-500 mt-4">Loading stats...</div>
          )}
          {error && (
            <div className="col-span-full text-center text-sm text-red-500 mt-4">Error loading stats: {error}</div>
          )}
      </div>
    </div>
  );
}