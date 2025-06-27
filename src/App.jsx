import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Favourites from './components/Favourites';
import ShareLink from './components/ShareLink';
import { linkService } from './services/linkService';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [links, setLinks] = useState([]);
  const [favouriteLinks, setFavouriteLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
    fetchFavourites();
  }, []);

  const fetchLinks = async () => {
    try {
      const data = await linkService.getLinks();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavourites = async () => {
    try {
      const data = await linkService.getFavouriteLinks();
      setFavouriteLinks(data);
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const refreshData = () => {
    fetchLinks();
    fetchFavourites();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            links={links}
            loading={loading}
            refreshData={refreshData}
          />
        );
      case 'favourites':
        return (
          <Favourites 
            favouriteLinks={favouriteLinks}
            refreshData={refreshData}
          />
        );
      case 'share':
        return (
          <ShareLink 
            refreshData={refreshData}
          />
        );
      default:
        return <Home links={links} loading={loading} refreshData={refreshData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        
        <main 
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  );
}

export default App;