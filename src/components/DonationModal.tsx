import React, { useState, useMemo } from 'react';

const resources = [
  { id: 'drone', name: 'Drone Battery Pack', description: 'Powers surveillance drones for 4 hours', price: 90 },
  { id: 'fuel', name: 'Rescue Vehicle Fuel', description: 'Fuel for one rescue vehicle for a day', price: 360 },
  { id: 'food', name: 'Emergency Food Kit', description: 'Feeds a family of 4 for one week.', price: 500 },
  { id: 'satellite', name: 'Satellite Data Feed', description: '1 hour of high-res satellite monitoring', price: 520 },
  { id: 'sensor', name: 'AI Sensor Deployment', description: 'Deploy and maintain one AI sensor unit', price: 380 },
];

interface DonationModalProps {
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState('specific');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 

  const toggleItem = (id: string): void => {
    if (isSuccess) return;
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId: string) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const totalAmount = useMemo(() => {
    if (mode === 'custom') {
      const parsedAmount = parseFloat(customAmount);
      return isNaN(parsedAmount) || parsedAmount < 0 ? 0 : parsedAmount;
    }

    return resources.filter(r => selectedItems.includes(r.id))
      .reduce((sum, r) => sum + r.price, 0);
  }, [mode, customAmount, selectedItems]);

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isSuccess) return;
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
  };

  const handleClose = () => {
    console.log("Cancel clicked or modal 'closed'. State has been reset.");
    setMode('specific');
    setSelectedItems([]);
    setCustomAmount('');
    setIsSuccess(false);
    onClose();
  };

  const handleCompleteDonation = () => {
    if (totalAmount <= 0) {
      console.error("Donation amount must be greater than $0.00");
      return;
    }
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      console.log(`Donation of $${totalAmount.toFixed(2)} completed!`);
    }, 1500);
  };

  const SuccessMessage = ({ amount, onRestart }: { amount: number; onRestart: () => void }) => (
    <div 
      key="success-view" 
      className="flex flex-col items-center justify-center p-8 text-center transition-all duration-500 ease-out animate-in fade-in zoom-in-50"
      style={{ height: '350px' }}
    >
      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
      <p className="text-gray-600 mb-4">Your generous donation of <span className="text-green-600 font-extrabold">${amount.toFixed(2)}</span> has been successfully processed.</p>
      <p className="text-sm text-gray-500 mb-8">You've directly funded life-saving resources for those impacted by the disaster.</p>
      <button
        onClick={onRestart}
        className="px-6 py-3 rounded-xl font-medium bg-gray-600 text-white hover:bg-gray-700 shadow-lg transition-all"
      >
        Donate Again
      </button>
    </div>
  );
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all animate-modal-appear"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Support Disaster Relief</h3>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 relative overflow-hidden min-h-[350px]">
          {isSuccess ? (
            <SuccessMessage amount={totalAmount} onRestart={handleClose} />
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4 transition-opacity duration-300">
                Choose how to support relief efforts in Bangladesh Delta
              </p>

              <div className="flex border-b border-gray-200 mb-6 transition-opacity duration-300">
                <button
                  onClick={() => setMode('specific')}
                  className={`pb-2 px-4 text-sm font-medium transition ${
                    mode === 'specific'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Fund Specific Resources
                </button>
                <button
                  onClick={() => setMode('custom')}
                  className={`pb-2 px-4 text-sm font-medium transition ${
                    mode === 'custom'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Custom Amount
                </button>
              </div>

              <div key={mode} className="transition-opacity duration-500 ease-in-out">
                {mode === 'specific' ? (
                  <div key="specific-content" className="space-y-4">
                    {resources.map((resource, index) => (
                      <div
                        key={resource.id}
                        style={{ animation: `slideUpFadeIn 0.5s ease-out forwards`, animationDelay: `${index * 0.08}s`, opacity: 0 }}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
                          selectedItems.includes(resource.id)
                            ? 'bg-red-50 border border-red-300 shadow-md transform scale-[1.01]'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-sm'
                        }`}
                        onClick={() => toggleItem(resource.id)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 mr-3 flex items-center justify-center rounded-sm border-2 transition-colors duration-200 ${selectedItems.includes(resource.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                            {selectedItems.includes(resource.id) && (
                              <svg
                                key={`${resource.id}-check`}
                                className="w-3 h-3 text-white transition-transform duration-200 ease-out transform scale-100 animate-scale-in"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{resource.name}</p>
                            <p className="text-xs text-gray-500">{resource.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 ml-4">${resource.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div key="custom-content" className="space-y-4">
                    <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700">
                      Enter Donation Amount
                    </label>
                    <div className="mt-1 relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        id="custom-amount"
                        value={customAmount}
                        onChange={handleCustomInputChange}
                        placeholder="0.00"
                        className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-lg font-mono text-right transition-colors duration-150"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">USD</span>
                      </div>
                    </div>
                    <div className='p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-200 mt-4'>
                      Your donation will be used where the need is greatest for this campaign.
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!isSuccess && (
          <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-100 transition-all duration-300">
            <div className="flex justify-between items-center mb-4 text-lg font-semibold text-gray-800">
              <span>Total Donation:</span>
              <span 
                key={totalAmount.toFixed(2)} 
                className="text-green-600 transition-all duration-300 ease-out transform scale-100"
                style={{
                  animation: 'totalPop 0.3s ease-out'
                }}
              >
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            
            <div className="text-xs text-gray-500 mb-6 p-3 bg-gray-100 rounded-lg">
              You'll receive real-time updates, including photos, videos, and sensor data, showing the direct impact of your contribution.
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCompleteDonation}
                disabled={isProcessing || totalAmount <= 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  totalAmount > 0
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                } ${isProcessing ? 'relative overflow-hidden' : ''}`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Complete Donation'}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-appear {
          animation: modalAppear 0.2s ease-out forwards;
        }
        @keyframes totalPop {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1.0); opacity: 1; }
        }
        @keyframes slideUpFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-once {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-15px);
          }
          60% {
            transform: translateY(-7px);
          }
        }
        .animate-in {
          animation-duration: 0.5s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in-50 {
          animation-name: zoom-in;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.5); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DonationModal;