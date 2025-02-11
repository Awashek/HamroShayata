import Hero from './components/Home/Hero';
import CampaignCard from './components/Campaign/CampaignCard';
import CampaignDetail from './components/Campaign/CampaignDetail';
import AdminDashboard from './components/Admin/AdminDashboard';
import Category from './components/Category/Category';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfile from './components/Users/UserProfile';
import CreateCampaignForm from './components/Campaign/CreateCampaginForm';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <Router>
      {/* Navbar appears on every page */}
      <Navbar />
      <div className="pt-[80px]">
        <Routes>
          <Route path='/' element={
            <>
              <Hero />
              <Category />
              <CampaignCard />
            </>
          } />

          <Route path='admin' element={<AdminDashboard />} />
          <Route path='createcampaign' element={<CreateCampaignForm />} />
          <Route path='userprofile' element={<UserProfile />} />
          <Route path='campaigns/:campaignId' element={<CampaignDetail />} />
        </Routes>
      </div>

      {/* Footer appears on every page */}
      <Footer />
    </Router>
  );
}

export default App;
