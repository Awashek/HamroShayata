import React, { useState, useContext, useCallback } from "react";
import { useSubscriptions } from "../../context/SubscriptionContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Crown, Target, Award, CheckCircle2, Loader2, X } from "lucide-react";

const SubscriptionPlans = () => {
  const { createSubscription } = useSubscriptions();
  const { authTokens, setShowSlider } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      type: "bronze",
      name: "Bronze",
      campaigns: 5,
      points: 50,
      icon: Award,
      features: ["5 Campaigns", "50 Points", "24/7 Support", "Custom Reports"],
      bgGradient: "bg-gradient-to-br from-[#cd7f32] to-[#b87333]",
      highlightColor: "bg-[#cd7f32]",
      textColor: "text-white"
    },
    {
      type: "silver",
      name: "Silver",
      campaigns: 10,
      points: 100,
      icon: Target,
      features: ["10 Campaigns", "100 Points", "24/7 Support", "Custom Reports"],
      bgGradient: "bg-gradient-to-br from-[#C0C0C0] to-[#a8a8a8]",
      highlightColor: "bg-[#C0C0C0]",
      textColor: "text-gray-800",
      recommended: true
    },
    {
      type: "gold",
      name: "Gold",
      campaigns: 15,
      points: 150,
      icon: Crown,
      features: ["15 Campaigns", "150 Points", "24/7 Support", "Custom Reports", "API Access"],
      bgGradient: "bg-gradient-to-br from-[#FFD700] to-[#daa520]",
      highlightColor: "bg-[#FFD700]",
      textColor: "text-gray-800"
    },
  ];

  const handleSubscribe = useCallback(async () => {
    if (loading) return;

    if (!authTokens) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedPlan) {
      setError("Please select a subscription plan.");
      return;
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const subscriptionData = {
      subscription_type: selectedPlan,
      end_date: endDate.toISOString().split('T')[0],
    };

    setLoading(true);
    setError("");

    try {
      const result = await createSubscription(subscriptionData);
      if (result.status === 201) {
        alert("Subscription created successfully!");
        setSelectedPlan("");
      } else {
        throw new Error(result.errorData || "Failed to create subscription.");
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, authTokens, selectedPlan, createSubscription]);

  const handleLoginClick = () => {
    setShowLoginModal(false);
    if (setShowSlider) {
      setShowSlider(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Login Required</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>You need to login to subscribe to a plan.</p>
                <p className="mt-2">Please login or sign up to continue.</p>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Choose Your <span className="text-[#1C9FDD]">Plan</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>

        {error && !showLoginModal && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.type}
                onClick={() => setSelectedPlan(plan.type)}
                className={`relative bg-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 ${selectedPlan === plan.type ? 'ring-4 ring-[#1C9FDD]' : ''
                  } ${plan.recommended ? 'scale-105 md:-mt-4' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#5c6367] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommended
                    </div>
                  </div>
                )}

                <div className={`${plan.bgGradient} rounded-t-2xl p-6 ${plan.textColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    <div className="text-right">
                      <div className="text-3xl font-bold">{plan.points} Points</div>
                      <div className="text-sm opacity-80">/month</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                </div>

                <div className="p-6">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-[#1C9FDD] mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan.type)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${selectedPlan === plan.type
                        ? 'bg-[#1C9FDD] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {selectedPlan === plan.type ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSubscribe}
            disabled={loading || !selectedPlan}
            className={`w-full py-4 px-8 rounded-xl text-white text-lg font-semibold transition-all ${!selectedPlan
                ? 'bg-gray-400 cursor-not-allowed'
                : loading
                  ? 'bg-[#1C9FDD]/80'
                  : 'bg-gradient-to-r from-[#1C9FDD] to-[#1C9FDD]/90 hover:from-[#1C9FDD]/90 hover:to-[#1C9FDD] hover:shadow-lg'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Processing...
              </span>
            ) : (
              "Subscribe Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;