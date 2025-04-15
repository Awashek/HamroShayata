import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Home/Hero';
import AdminDashboard from './components/Admin/AdminDashboard';
import Category from './components/Category/Category';
import Footer from './components/Footer/Footer';
import UserProfile from './components/Users/UserProfile';
import CreateCampaignForm from './components/Campaign/CreateCampaginForm';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './utils/PrivateRoute';
import LogIn from './components/LogIn/LogIn';
import { AuthProvider } from './context/AuthContext';
import { CampaignProvider } from './context/CampaignContext';
import CampaignList from './components/campaigntest/CampaignList';
import CampaignDetailTest from './components/campaigntest/CampaignDetailTest';
import SubscriptionPlans from './components/Subscription/SubscriptionPlan';
import { SubscriptionProvider } from './context/SubscriptionContext';
import AllCampaigns from './components/campaigntest/AllCampaigns';
import { DonationProvider } from './context/DonationContext';
import AllCampaignDonors from './components/campaigntest/AllCampaignDoners';
import CampaignDonors from './components/campaigntest/CampaginDonors';
import ResetPasswordPage from './components/LogIn/ResetPasswordPage';
import PaymentCallback from './components/Donation/PaymentCallback';
function App() {
  return (
    <Router>
      <AuthProvider>
        <CampaignProvider>
          <DonationProvider>
            <SubscriptionProvider>
              <Navbar />
              <div className="pt-[80px]">
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/" element={
                      <>
                        <Hero />
                        <Category />
                        <CampaignList isHomePage={true} />
                        <SubscriptionPlans />
                      </>
                    } />

                    <Route path="/campaigns/:id" element={<CampaignDetailTest />} />
                    <Route path="/all-campaigns" element={<AllCampaigns />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/payment/callback" element={<PaymentCallback />} />

                    {/* Updated donor routes */}
                    <Route path="/campaigns/:id/donors" element={<AllCampaignDonors />} />
                    <Route path="/campaigns/:id/donors/top" element={<CampaignDonors />} />

                    {/* Private Routes */}
                    <Route path="/dashboard" element={<PrivateRoute />} >
                      <Route path="/dashboard" element={<AdminDashboard />} />
                    </Route>
                    <Route path="/createcampaign" element={<PrivateRoute />}>
                      <Route path="/createcampaign" element={<CreateCampaignForm />} />
                    </Route>
                    <Route path="/userprofile" element={<PrivateRoute />} >
                      <Route path="/userprofile" element={<UserProfile />} />
                    </Route>
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </SubscriptionProvider>
          </DonationProvider>
        </CampaignProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;