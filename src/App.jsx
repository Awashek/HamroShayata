import Hero from './components/Home/Hero'
import CampaignCard from './components/Campaign/CampaignCard';
import CampaignDetail from './components/Campaign/CampaignDetail'
import AdminDashboard from './components/Admin/AdminDashboard';
import Category from './components/Category/Category';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfile from './components/Users/UserProfile';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <>
            <Hero />
            <Category />
            <CampaignCard />
            <Footer />
          </>
        } />

        <Route path='admin' element={<AdminDashboard />} />
        <Route path='userprofile' element={<UserProfile />} />
        <Route path='campaigns/:campaignId' element={<CampaignDetail
        />} />
      </Routes>
    </Router>
  )
}

export default App
