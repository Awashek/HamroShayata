import Hero from './components/Home/Hero'
import CampaignCard from './components/Campaign/CampaignCard';
import CampaignDetail from './components/Campaign/CampaignDetail'
import AdminDashboard from './components/Admin/AdminDashboard';
import Category from './components/Category/Category';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <>
            <Hero />
            <Category />
            <CampaignCard />
          </>
        } />

        <Route path='admin' element={<AdminDashboard />} />
        <Route path='campaigns/:campaignId' element={<CampaignDetail
        />} />
      </Routes>
    </Router>
  )
}

export default App
