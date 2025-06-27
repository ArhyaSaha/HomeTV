import { useState } from 'react';
import { ExternalLink, Heart, Edit, Trash2, Clock } from 'lucide-react';
import { linkService } from '../services/linkService';
import toast from 'react-hot-toast';
import LinkModal from './LinkModal';

const Home = ({ links, loading, refreshData }) => {
  const [editingLink, setEditingLink] = useState(null);

  const featuredLink = links[0];
  const recentLinks = links.slice(1, 6);

  const handleOpenLink = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  };

  const handleAddToFavourites = async (linkId) => {
    try {
      await linkService.addToFavourites(linkId);
      toast.success('Added to favourites!');
      refreshData();
    } catch (error) {
      toast.error('Failed to add to favourites');
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await linkService.deleteLink(linkId);
      toast.success('Link deleted successfully!');
      refreshData();
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const handleUpdateLink = async (linkData) => {
    try {
      await linkService.updateLink(editingLink._id, linkData);
      toast.success('Link updated successfully!');
      setEditingLink(null);
      refreshData();
    } catch (error) {
      toast.error('Failed to update link');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold metallic-text mb-2">Welcome to MyTV</h1>
        <p className="text-gray-400">Your personal link sharing hub</p>
      </div>

      {/* Featured Link */}
      {featuredLink && (
        <div className="glass rounded-2xl p-8 animate-scale-in">
          <h2 className="text-xl font-semibold mb-4 metallic-gold-text">Featured Link</h2>
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">
                  {featuredLink.title || featuredLink.url}
                </h3>
                <p className="text-gray-400 text-sm mb-4 break-all">{featuredLink.url}</p>
                
                {featuredLink.tags && featuredLink.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredLink.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleOpenLink(featuredLink.url)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} />
                    Open Link
                  </button>
                  
                  <button
                    onClick={() => handleAddToFavourites(featuredLink._id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Add to Favourites"
                  >
                    <Heart size={16} className="text-red-400" />
                  </button>
                  
                  <button
                    onClick={() => setEditingLink(featuredLink)}
                    className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors"
                    title="Edit Link"
                  >
                    <Edit size={16} className="text-yellow-400" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteLink(featuredLink._id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock size={12} />
                  {new Date(featuredLink.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Links */}
      {recentLinks.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 metallic-gold-text">Recent Links</h2>
          <div className="grid gap-4">
            {recentLinks.map((link) => (
              <div
                key={link._id}
                className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">
                      {link.title || link.url}
                    </h3>
                    <p className="text-gray-400 text-sm truncate break-all">{link.url}</p>
                    
                    {link.tags && link.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {link.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {link.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
                            +{link.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleOpenLink(link.url)}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Open Link"
                    >
                      <ExternalLink size={16} className="text-blue-400" />
                    </button>
                    
                    <button
                      onClick={() => handleAddToFavourites(link._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Add to Favourites"
                    >
                      <Heart size={16} className="text-red-400" />
                    </button>
                    
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors"
                      title="Edit Link"
                    >
                      <Edit size={16} className="text-yellow-400" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteLink(link._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {links.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-medium text-gray-300 mb-2">No links yet</h3>
            <p className="text-gray-500">Start by sharing your first link!</p>
          </div>
        </div>
      )}

      {editingLink && (
        <LinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onSave={handleUpdateLink}
          title="Edit Link"
        />
      )}
    </div>
  );
};

export default Home;