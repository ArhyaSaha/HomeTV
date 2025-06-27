import { useState } from 'react';
import { Search, ExternalLink, Trash2, Edit } from 'lucide-react';
import { linkService } from '../services/linkService';
import toast from 'react-hot-toast';
import LinkModal from './LinkModal';

const Favourites = ({ favouriteLinks, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLink, setEditingLink] = useState(null);

  const filteredLinks = favouriteLinks.filter(link =>
    link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenLink = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  };

  const handleRemoveFromFavourites = async (linkId) => {
    try {
      await linkService.removeFromFavourites(linkId);
      toast.success('Removed from favourites!');
      refreshData();
    } catch (error) {
      toast.error('Failed to remove from favourites');
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold metallic-text mb-2">Favourites</h1>
        <p className="text-gray-400">Your saved links collection</p>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search favourites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/30 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Favourites List */}
      {filteredLinks.length > 0 ? (
        <div className="glass rounded-xl p-6">
          <div className="grid gap-4">
            {filteredLinks.map((link) => (
              <div
                key={link._id}
                className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">
                      {link.title || link.url}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 break-all">{link.url}</p>
                    
                    {link.tags && link.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {link.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Added on {new Date(link.createdAt).toLocaleDateString()}
                    </div>
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
                      onClick={() => setEditingLink(link)}
                      className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors"
                      title="Edit Link"
                    >
                      <Edit size={16} className="text-yellow-400" />
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromFavourites(link._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Remove from Favourites"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="glass rounded-xl p-8">
            {searchTerm ? (
              <>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No favourites yet</h3>
                <p className="text-gray-500">Add some links to your favourites to see them here</p>
              </>
            )}
          </div>
        </div>
      )}

      {editingLink && (
        <LinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onSave={handleUpdateLink}
          title="Edit Favourite Link"
        />
      )}
    </div>
  );
};

export default Favourites;