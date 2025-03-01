import React from 'react';
import Hero from './components/Home/Hero';
import CampaignCard from './components/Campaign/CampaignCard';
import CampaignDetail from './components/Campaign/CampaignDetail';
import AdminDashboard from './components/Admin/AdminDashboard';
import Category from './components/Category/Category';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserProfile from './components/Users/UserProfile';
import CreateCampaignForm from './components/Campaign/CreateCampaginForm';
import Navbar from './components/Navbar/Navbar';
import SubscriptionPage from './components/Subscription/SubscriptionPage';
import PrivateRoute from './utils/PrivateRoute';
import LogIn from './components/LogIn/LogIn'; // Import the LogIn component
import { AuthProvider } from './context/Authcontext';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Navbar appears on every page */}
        <Navbar />
        <div className="pt-[80px]">
          <Routes>
            {/* Public Route - LogIn */}
            <Route path="/login" element={<LogIn />} />

            {/* Public Route */}
            <Route path="/" element={
              <>
                <Hero />
                <Category />
                <CampaignCard />
                <SubscriptionPage />
              </>
            } />

            {/* Private Routes */}
            <Route path='admin' element={<PrivateRoute element={<AdminDashboard />} />} />
            <Route path='createcampaign' element={<PrivateRoute element={<CreateCampaignForm />} />} />
            <Route path='userprofile' element={<PrivateRoute element={<UserProfile />} />} />
            <Route path='campaigns/:campaignId' element={<PrivateRoute element={<CampaignDetail />} />} />
          </Routes>
        </div>

        {/* Footer appears on every page */}
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;