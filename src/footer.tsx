import React from 'react';
import { Activity, ActivityIcon } from 'lucide-react';

const DisasterResponseFooter = () => {
  return (
    <footer className="bg-[#1a1c22] text-white pt-10 pb-12 px-4 sm:px-8 md:px-12 text-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center text-center gap-8 border-b border-gray-700/50 pb-8">

          <div className="w-full md:w-1/3 mb-8 md:mb-0 flex flex-col items-center">
            <div className="flex items-center mb-4 justify-center">
              <Activity className="text-red-500 w-5 h-5 mr-2" />
              <span className="font-semibold text-lg">Disaster Response Network</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Using <b>AI-powered sensors</b> to detect disasters early and coordinate rapid response to save lives worldwide.
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-white font-semibold mb-3 text-center mx-auto">Share Your Feedback</h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Name (optional)"
                  className="w-full bg-[#20232a] border border-gray-700/50 rounded-md p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-shadow"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  className="w-full bg-[#20232a] border border-gray-700/50 rounded-md p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-shadow"
                />
              </div>

              <div className="relative">
                <select
                  className="w-full appearance-none bg-[#20232a] border border-gray-700/50 rounded-md p-3 text-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-shadow"
                >
                  <option value="" disabled selected>
                    Select category
                  </option>
                  <option value="general" className="text-white bg-[#20232a]">General Feedback</option>
                  <option value="suggestion" className="text-white bg-[#20232a]">Suggestion</option>
                  <option value="bug" className="text-white bg-[#20232a]">Report a Bug</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l-.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <textarea
                placeholder="Share your thoughts."
                rows={4}
                className="w-full bg-[#20232a] border border-gray-700/50 rounded-md p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none transition-shadow"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-black/50 hover:bg-black transition-colors text-white font-semibold py-3 rounded-md flex items-center justify-center"
              >
                <span className="text-lg">Submit</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center text-center pt-4 text-xs text-gray-500 gap-4">
          <span>&copy; 2025 Disaster Response Network. All rights reserved.</span>
          <span>Powered by AI sensors and compassionate donors worldwide.</span>
        </div>
      </div>
    </footer>
  );
};

export default DisasterResponseFooter;