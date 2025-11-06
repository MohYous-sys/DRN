import React from 'react';
import CampaignCard from './components/CampainCard.tsx';
import RecentDonations from './components/RecentDonations.tsx';

const campaigns = [
  {
    title: "Northern California Wildfire Emergency",
    location: "Northern California, USA",
    description: "Rapidly spreading wildfire threatening 12,000 residents. Immediate evacuation and aerial surveillance needed.",
    update: "47 residents evacuated. Deploying 5 additional drones for surveillance.",
    raised: 45000,
    goal: 100000,
    supporters: 342,
    time: "2 hours",
    isCritical: true,
    imageSrc: 'https://images.pexels.com/photos/3552472/pexels-photo-3552472.jpeg', // Placeholder image
  },
  {
    title: "Bangladesh Delta Monsoon Flooding Season",
    location: "Bangladesh Delta",
    description: "Severe monsoon flooding affecting 50,000 people. Emergency supplies and medical aid urgently needed.",
    update: "Water levels rising at 3cm/hour. Medical teams on-site, setting up clinics.",
    raised: 78000,
    goal: 150000,
    supporters: 521,
    time: "6 hours",
    isCritical: false,
    imageSrc: 'https://images.pexels.com/photos/2382896/pexels-photo-2382896.jpeg', // Placeholder image
  }
];

const donations = [
  { initial: 'M', name: 'Maria S.', amount: 1000, campaign: 'to California Wildfire', time: 'just now' },
  { initial: 'A', name: 'Alex K.', amount: 500, campaign: 'to Florida Hurricane', time: '2 min ago' },
  { initial: 'M', name: 'Maria S.', amount: 100 , campaign: 'to Bangladesh Flood Relief', time: '4 min ago' },
  { initial: 'A', name: 'Alex K.', amount: 100, campaign: 'to Bangladesh Flood Relief', time: '6 min ago' },
];

function CampaignsComponent() {
  return (
    <div className="pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
      
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
          {campaigns.map((campaign, index) => (
            <CampaignCard key={index} {...campaign} />
          ))}
        </section>

        <aside className="lg:col-span-1">
          <RecentDonations donations={donations} />
        </aside>

      </main>
    </div>
  );
}

export default CampaignsComponent;