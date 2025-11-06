import React, { useState } from 'react';
import { DollarSign, AlertTriangle, Users, MessageSquare, Briefcase, Database, Lock, Activity, ArrowUp, Zap, Clock } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('Overview'); 

  const stats = [
    { title: 'Total Donations', value: '$1,750', detail: '+12% from last month', icon: DollarSign, valueColor: 'text-black' },
    { title: 'Active Disasters', value: '2', detail: '3 total events', icon: AlertTriangle, valueColor: 'text-orange-700' },
    { title: 'Registered Users', value: '3', detail: '+3 this week', icon: Users, valueColor: 'text-black' },
    { title: 'Pending Feedback', value: '1', detail: 'Requires attention', icon: MessageSquare, valueColor: 'text-red-700' },
  ];

  const tabs = ['Disasters', 'Campaigns', 'Donations', 'Needs', 'Users', 'Feedback'];

  const recentActivity = [
    { text: 'New donation of $500 received', time: '2 min ago', icon: DollarSign, iconClass: 'text-white bg-red-600' },
    { text: 'New disaster event created', time: '15 min ago', icon: AlertTriangle, iconClass: 'text-white bg-orange-600' },
    { text: 'New user registered', time: '1 hour ago', icon: Users, iconClass: 'text-white bg-gray-700' },
    { text: 'New feedback submitted', time: '2 hours ago', icon: MessageSquare, iconClass: 'text-white bg-red-700' },
  ];

  const systemStatus = [
    { metric: 'API Status', status: 'Operational', icon: Zap, statusColor: 'text-white bg-red-600', dot: 'bg-red-500' },
    { metric: 'Database', status: 'Healthy', icon: Database, statusColor: 'text-white bg-red-600', dot: 'bg-red-500' },
    { metric: 'Security', status: 'Secure', icon: Lock, statusColor: 'text-white bg-gray-700', dot: 'bg-gray-700' },
    { metric: 'Active Users', status: '247', icon: Activity, statusColor: 'text-white bg-gray-400', dot: 'bg-gray-400' },
  ];
  
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
          <div className="mt-6 p-12 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Campaigns & Outreach</h2>
            <p className="text-gray-600">Here you can manage fundraising campaigns, track their progress against goals, and initiate new public awareness initiatives. Key metrics like participation rate and total funds raised per campaign will be displayed.</p>
          </div>
        );
      case 'Donations':
        return (
          <div className="mt-6 p-12 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Donation Records & Analytics</h2>
            <p className="text-gray-600">This panel provides a searchable table of all monetary and in-kind donations. You can filter by donor, amount, date, or target campaign, and generate financial reports here.</p>
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
          <div className="mt-6 p-12 bg-white rounded-xl shadow-lg border border-gray-100 transition-opacity duration-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">User Account Management</h2>
            <p className="text-gray-600">Access and modify registered user and volunteer accounts. Tools for authentication resets, role assignments, and activity logging are available in this view.</p>
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
        {stats.map(stat => (
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