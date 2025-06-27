import { useState } from 'react';
import { Plus, X, Link as LinkIcon, Tag, Send } from 'lucide-react';
import { linkService } from '../services/linkService';
import toast from 'react-hot-toast';

const ShareLink = ({ refreshData }) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    tags: []
  });
  const [customTag, setCustomTag] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedTags = [
    'Entertainment', 'News', 'Technology', 'Sports', 'Music', 'Movies',
    'Education', 'Work', 'Gaming', 'Shopping', 'Social', 'Travel'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    
    try {
      await linkService.createLink(formData);
      toast.success('Link shared successfully!');
      setFormData({ url: '', title: '', tags: [] });
      refreshData();
    } catch (error) {
      toast.error('Failed to share link');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      addTag(customTag.trim());
      setCustomTag('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold metallic-text mb-2">Share Link</h1>
        <p className="text-gray-400">Add a new link to your collection</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <LinkIcon size={16} />
                URL *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Tag size={16} />
                Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a descriptive title"
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Tags Section */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Tags
              </label>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-black/20 rounded-lg border border-gray-700">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Predefined Tags */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Predefined Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={formData.tags.includes(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add custom tag..."
                  className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  disabled={!customTag.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.url.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send size={16} />
                  Share Link
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareLink;