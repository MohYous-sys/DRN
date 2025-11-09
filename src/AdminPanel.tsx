import React, { useEffect, useState } from 'react';
import { DollarSign, AlertTriangle, Users, MessageSquare, ArrowUp } from 'lucide-react';
import api from './api/adminApi';
import { useAuth } from './auth/AuthContext';

interface StatsCardProps {
  title: string;
  value: string;
  detail?: string;
  icon: React.ElementType;
  valueColor?: string;
}

const StatsCard = ({ title, value, detail, icon: Icon, valueColor = 'text-gray-900' }: StatsCardProps) => {
  const iconBgColor = {
    'Total Donations': 'bg-red-600 text-white',
    'Active Disasters': 'bg-orange-600 text-white',
    'Registered Users': 'bg-gray-700 text-white',
    'Pending Feedback': 'bg-red-700 text-white',
  }[title] || 'bg-gray-600 text-white';

  const detailColor = detail?.includes('+') ? 'text-green-500' : 'text-gray-500';

  return (
  <div className="flex flex-col p-5 bg-white rounded-xl shadow-lg border border-gray-200 transition-shadow hover:shadow-xl">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
        {detail && (
          <p className={`text-sm font-medium ${detailColor} flex items-center pt-2`}>
            {title === 'Total Donations' && <ArrowUp className="w-4 h-4 mr-1" />}
            {detail}
          </p>
        )}
      </div>
    </div>
  );
};

interface TabsNavigationProps {
  activeTab: string;
  tabs: string[];
  onTabClick: (tab: string) => void;
}

const TabsNavigation = ({ activeTab, tabs, onTabClick }: TabsNavigationProps) => {
  return (
    <div className="flex flex-wrap border-b border-gray-200 bg-white rounded-t-xl shadow-sm overflow-x-auto whitespace-nowrap">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={`py-3 px-6 text-sm font-medium transition-all duration-200 border-b-2 rounded-t-lg 
            ${tab === activeTab
              ? 'border-red-600 text-red-700 bg-red-50 shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
              : 'border-transparent text-gray-600 hover:text-red-700 hover:bg-red-50' 
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};


const AdminPanelComponent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // If not logged in as admin, don't render anything
  if (!user?.isAdmin) {
    return null;
  }
  
  // Hide other content when in admin panel
  useEffect(() => {
    const nonAdminContent = document.querySelectorAll('header, #main-section, #campaigns, #trust-section, #testimonials, #live-updates');
    nonAdminContent.forEach(el => {
      if (el && el instanceof HTMLElement) {
        el.style.display = 'none';
      }
    });
    
    return () => {
      nonAdminContent.forEach(el => {
        if (el && el instanceof HTMLElement) {
          el.style.display = '';
        }
      });
    };
  }, []);

  // Live data from backend
  const [statsData, setStatsData] = useState<null | { totalDonations: number; activeCampaigns: number; donors: number; numberOfSupplies: number }>(null);
  const [campaigns, setCampaigns] = useState<any[] | null>(null);
  const [donations, setDonations] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = ['Disasters', 'Campaigns', 'Donations', 'Needs', 'Users', 'Feedback'];

  // Build displayable stats used by the UI (falls back to placeholders)
  const summaryStats = statsData
    ? [
        { title: 'Total Donations', value: `$${statsData.totalDonations}`, detail: `${statsData.numberOfSupplies} supplies`, icon: DollarSign, valueColor: 'text-black' },
        { title: 'Active Disasters', value: `${statsData.activeCampaigns}`, detail: `${statsData.activeCampaigns} total events`, icon: AlertTriangle, valueColor: 'text-orange-700' },
        { title: 'Registered Users', value: `${statsData.donors}`, detail: `donors`, icon: Users, valueColor: 'text-black' },
        { title: 'Pending Feedback', value: '—', detail: 'Requires attention', icon: MessageSquare, valueColor: 'text-red-700' },
      ]
    : [
        { title: 'Total Donations', value: '$0', detail: '—', icon: DollarSign, valueColor: 'text-black' },
        { title: 'Active Disasters', value: '0', detail: '—', icon: AlertTriangle, valueColor: 'text-orange-700' },
        { title: 'Registered Users', value: '0', detail: '—', icon: Users, valueColor: 'text-black' },
        { title: 'Pending Feedback', value: '0', detail: '—', icon: MessageSquare, valueColor: 'text-red-700' },
      ];

  useEffect(() => {
    // Fetch key datasets for the overview when the panel mounts
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([api.getStats(), api.getCampaigns(), api.getDonations()])
      .then(([s, c, d]) => {
        if (!mounted) return;
        setStatsData({
          totalDonations: s.totalDonations ?? 0,
          activeCampaigns: s.activeCampaigns ?? 0,
          donors: s.donors ?? 0,
          numberOfSupplies: s.numberOfSupplies ?? 0,
        });
        setCampaigns(c || []);
        setDonations(d || []);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message || 'Failed to load admin data');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Disasters':
        return (
          <div className="mt-6 p-12 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Disaster Management Panel</h2>
            <p className="text-gray-600">This section will contain a list of all active and historical disaster events, including location, severity, and required resources. Use this area to quickly log a new event or view the live status of existing crises.</p>
          </div>
        );
      case 'Campaigns':
        return (
          <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Campaigns & Outreach</h2>
            {loading && <p className="text-gray-500">Loading campaigns...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {campaigns && (
              <div className="space-y-3">
                {campaigns.map(c => (
                  <div key={c.ID} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{c.Title}</h3>
                      <span className="text-sm text-gray-500">Goal: ${c.Goal}</span>
                    </div>
                    <p className="text-sm text-gray-600">{c.Description}</p>
                    <div className="text-xs text-gray-400 mt-2">Location: {c.Location} • Due: {c.Due}</div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !campaigns && <p className="text-gray-500">No campaigns data available.</p>}
          </div>
        );
      case 'Donations':
        return (
          <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Donation Records & Analytics</h2>
            {loading && <p className="text-gray-500">Loading donations...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {donations && (
              <div className="space-y-3">
                {donations.map(d => (
                  <div key={d.ID} className="p-3 border rounded-md flex justify-between">
                    <div>
                      <div className="font-medium">${d.Amount}</div>
                      <div className="text-sm text-gray-500">Donor ID: {d.Donor} • Campaign ID: {d.CampaignID}</div>
                    </div>
                    <div className="text-sm text-gray-600">Supplies: {(d.Supplies || []).join(', ')}</div>
                  </div>
                ))}
              </div>
            )}
            {!loading && !donations && <p className="text-gray-500">No donations data available.</p>}
          </div>
        );
      case 'Needs':
        return (
          <div className="mt-6 p-12 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Resource Needs Tracking</h2>
            <p className="text-gray-600">Manage the real-time resource requirements (e.g., medical supplies, food, temporary shelter) for each active disaster event. This panel helps match incoming donations with immediate critical needs.</p>
          </div>
        );
      case 'Users':
        return (
          <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">User Account Management</h2>
            <p className="text-gray-600">The backend currently exposes session status but not a public "list users" endpoint. You can use the session status to confirm admin login.</p>
            {/* Try session status */}
            <button
              onClick={async () => {
                setLoading(true); setError(null);
                try {
                  const s = await api.getSessionStatus();
                  alert(JSON.stringify(s));
                } catch (err: any) {
                  setError(err.message || 'Failed to fetch session');
                } finally { setLoading(false); }
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
            >
              Check Session Status
            </button>
          </div>
        );
      case 'Feedback':
        return (
          <div className="mt-6 p-12 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">User Feedback and Support Tickets</h2>
            <p className="text-gray-600">Review and respond to all platform feedback, bug reports, and support inquiries submitted by users. Tickets can be prioritized and assigned to team members here.</p>
          </div>
        );
      default:
        return (
          <div className="mt-6 p-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <p className="text-xl font-medium text-gray-500">Select a tab to view content.</p>
          </div>
        );
    }
  };


  return (
  <div className="min-h-screen bg-gray-50 font-sans antialiased p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat: any) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <TabsNavigation 
        activeTab={activeTab} 
        tabs={tabs} 
        onTabClick={setActiveTab}
      />

      {renderTabContent()}
      
    </div>
  );
};

export default AdminPanelComponent;