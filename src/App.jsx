import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Home/Hero';
import CampaignCard from './components/Campaign/CampaignCard';
import CampaignDetail from './components/Campaign/CampaignDetail';
import AdminDashboard from './components/Admin/AdminDashboard';
import Category from './components/Category/Category';
import Footer from './components/Footer/Footer';
import UserProfile from './components/Users/UserProfile';
import CreateCampaignForm from './components/Campaign/CreateCampaginForm';
import Navbar from './components/Navbar/Navbar';
import SubscriptionPage from './components/Subscription/SubscriptionPage';
import PrivateRoute from './utils/PrivateRoute';
import LogIn from './components/LogIn/LogIn';
import { AuthProvider } from './context/Authcontext';
import { CampaignProvider } from './context/campaignContext';
import Form from './components/campaigntest/Form';
import CampaignList from './components/campaigntest/CampaignList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CampaignProvider>
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
                  <CampaignCard />
                  <SubscriptionPage />
                  <Form />
                  <CampaignList />
                </>
              } />
              <Route path="/campaigns/:campaignId" element={<CampaignDetail />} />

              {/* Private Routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
              </Route>
              <Route path="/createcampaign" element={<PrivateRoute />}>
                <Route path="/createcampaign" element={<CreateCampaignForm />} />
              </Route>
              <Route path="/userprofile" element={<PrivateRoute />}>
                <Route path="/userprofile" element={<UserProfile />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
        <Footer />
        </CampaignProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
