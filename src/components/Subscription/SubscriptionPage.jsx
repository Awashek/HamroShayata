import React, { useState } from 'react';

const SubscriptionPage = () => {
  const [subscriptionLevel, setSubscriptionLevel] = useState('free');
  const [campaignsLimit, setCampaignsLimit] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleSubscriptionChange = (level) => {
    let campaigns = 2; // Default to the free plan

    // Set the campaigns limit based on the subscription level selected
    switch (level) {
      case 'bronze':
        campaigns = 5;
        break;
      case 'silver':
        campaigns = 10;
        break;
      case 'gold':
        campaigns = 15;
        break;
      default:
        campaigns = 2;
    }

    setSubscriptionLevel(level);
    setCampaignsLimit(campaigns);
    setModalContent(`You have selected the ${level} plan. Now you can create up to ${campaigns} campaigns.`);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-300 py-10 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-center text-[#1C9FDD] mb-8">
          Choose Your Subscription Plan
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bronze Plan */}
          <div
            className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform duration-300 text-center border-2 ${
              subscriptionLevel === 'bronze' ? 'border-[#8B4513]' : 'border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bronze</h2>
            <p className="text-gray-600 mb-4">Create up to 5 campaigns</p>
            <p className="text-2xl font-semibold text-[#8B4513] mb-6">100 Points</p>
            <button
              onClick={() => handleSubscriptionChange('bronze')}
              className={`w-full py-3 rounded-xl text-white transition-all duration-300 ${
                subscriptionLevel === 'bronze'
                  ? 'bg-[#8B4513] cursor-not-allowed'
                  : 'bg-[#A52A2A] hover:bg-[#8B4513]'
              }`}
              disabled={subscriptionLevel === 'bronze'}
            >
              {subscriptionLevel === 'bronze' ? 'Selected' : 'Select Bronze'}
            </button>
          </div>

          {/* Silver Plan */}
          <div
            className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform duration-300 text-center border-2 ${
              subscriptionLevel === 'silver' ? 'border-gray-600' : 'border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Silver</h2>
            <p className="text-gray-600 mb-4">Create up to 10 campaigns</p>
            <p className="text-2xl font-semibold text-gray-800 mb-6">250 Points</p>
            <button
              onClick={() => handleSubscriptionChange('silver')}
              className={`w-full py-3 rounded-xl text-white transition-all duration-300 ${
                subscriptionLevel === 'silver'
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              disabled={subscriptionLevel === 'silver'}
            >
              {subscriptionLevel === 'silver' ? 'Selected' : 'Select Silver'}
            </button>
          </div>

          {/* Gold Plan */}
          <div
            className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform duration-300 text-center border-2 ${
              subscriptionLevel === 'gold' ? 'border-[#FFD700]' : 'border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gold</h2>
            <p className="text-gray-600 mb-4">Create up to 15 campaigns</p>
            <p className="text-2xl font-semibold text-[#FFD700] mb-6">500 Points</p>
            <button
              onClick={() => handleSubscriptionChange('gold')}
              className={`w-full py-3 rounded-xl text-white transition-all duration-300 ${
                subscriptionLevel === 'gold'
                  ? 'bg-[#FFD700] cursor-not-allowed'
                  : 'bg-[#FFD700] hover:bg-[#FFA500]'
              }`}
              disabled={subscriptionLevel === 'gold'}
            >
              {subscriptionLevel === 'gold' ? 'Selected' : 'Select Gold'}
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-lg text-gray-700">
            Your current subscription: <span className="font-bold text-blue-600">{subscriptionLevel.toUpperCase()}</span>
          </p>
          <p className="text-lg text-gray-700 mt-4">
            You can create up to <span className="font-bold text-blue-600">{campaignsLimit}</span> campaigns.
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity"
          onClick={() => setShowModal(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-96 md:w-[500px] lg:w-[600px] text-center transform transition-all duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subscription Updated</h2>
            <p className="text-lg text-gray-700 mb-6">{modalContent}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white py-2 px-6 rounded-xl hover:bg-blue-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
