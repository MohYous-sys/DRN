import React, { useState } from 'react';
import DonationModal from './DonationModal';
import AuthModal from './authmodule';
import { useAuth } from '../auth/AuthContext';

interface CampaignCardProps {
  title: string;
  location: string;
  description: string;
  update: string;
  raised: number;
  goal: number;
  supporters: number;
  time: string;
  isCritical: boolean;
  imageSrc: string;
  campaignId?: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  title, 
  location, 
  description, 
  update, 
  raised, 
  goal, 
  supporters, 
  time, 
  isCritical, 
  imageSrc,
  campaignId
}) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const safeRaised = Number(raised || 0);
  const safeGoal = Number(goal || 0);
  const safeSupporters = Number(supporters || 0);
  const percentage = safeGoal > 0 ? Math.round(Math.min(1, safeRaised / safeGoal) * 100) : 100;
  const goalRemaining = Math.max(0, safeGoal - safeRaised);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 max-w-sm">
      <div 
        className="relative h-56 bg-cover bg-center" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${imageSrc})` }} 
        aria-label={`Image related to ${title}`}
      >
        {isCritical && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Critical
          </span>
        )}
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          Due: {time}
        </div>
      </div>

      <div className="p-2">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {location}
        </p>

        <p className="text-gray-700 mb-4 text-sm">{description}</p>
        <p className="text-xs text-gray-600 mb-4">
          <b>Latest Update:</b> {update}
        </p>

        <div className="mb-1" role="progressbar" aria-valuenow={safeRaised} aria-valuemin={0} aria-valuemax={safeGoal}>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-gray-800">${safeRaised.toLocaleString()}</span>
            <span className="text-gray-500">of ${safeGoal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-6">
          <span className="font-semibold">{safeSupporters.toLocaleString()} supporters</span>
          {goalRemaining <= 0 ? (
            <span className="text-green-600 font-bold">Done!</span>
          ) : (
            <span>${goalRemaining.toLocaleString()} to go</span>
          )}
        </div>

        <button 
          className={`w-full py-3 rounded-md font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
            user ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          type="button"
          onClick={() => user ? setShowDonationModal(true) : setShowAuthModal(true)}
        >
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            {user ? 'Donate To This Campaign' : 'Sign in to Donate'}
          </span>
        </button>
      </div>
      {showDonationModal && <DonationModal campaignId={campaignId} onClose={() => setShowDonationModal(false)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default CampaignCard;