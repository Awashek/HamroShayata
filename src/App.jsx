import AdminDashboard from './components/admin/AdminDashboard';
import CampaignDetail from './components/Campaign/CampaignDetail'
import CampaignsList from './components/Campaign/CampaignsList'
import Hero from './components/Home/Hero'

function App() {
  const sampleCampaign = {
    title: "Help Build a School in Rural Nepal",
    coverImage: "https://via.placeholder.com/600x400",
    description: "This campaign aims to build a school in a rural area of Nepal.",
    goalAmount: 5000,
    raisedAmount: 4500,
  };

  const creator = {
    name: "John Doe",
    profileImage: "https://via.placeholder.com/150",
    bio: "Social activist and educator passionate about making education accessible.",
  };

  const relatedCampaigns = [
    {
      id: 1,
      title: "Healthcare for Rural Villages",
      raisedAmount: 1500,
      goalAmount: 3000,
      coverImage: "https://via.placeholder.com/600x400",
    },
    {
      id: 2,
      title: "Clean Water Initiative",
      raisedAmount: 1000,
      goalAmount: 2500,
      coverImage: "https://via.placeholder.com/600x400",
    },
  ];



  return (
    <>
      <Hero />
      <CampaignsList />
      <CampaignDetail
        campaign={sampleCampaign}
        creator={creator}
        relatedCampaigns={relatedCampaigns}
      />
      <AdminDashboard />
    </>
    
  )
}

export default App
