// src/components/RecentDonations.jsx

import React from 'react';

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
  donations: DonationItemProps[];
}

const RecentDonations = ({ donations }: RecentDonationsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        Recent Donations
      </h3>
      <div>
        {donations.map((d, index) => (
          <DonationItem key={index} {...d} />
        ))}
      </div>
    </div>
  );
};

export default RecentDonations;