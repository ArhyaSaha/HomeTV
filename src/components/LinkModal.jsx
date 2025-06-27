import { useState, useEffect } from 'react';
import { X, Plus, Tag, Link as LinkIcon } from 'lucide-react';

const LinkModal = ({ link, onClose, onSave, title }) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    tags: []
  });
  const [customTag, setCustomTag] = useState('');

  const predefinedTags = [
    'Entertainment', 'News', 'Technology', 'Sports', 'Music', 'Movies',
    'Education', 'Work', 'Gaming', 'Shopping', 'Social', 'Travel'
  ];

  useEffect(() => {
    if (link) {
      setFormData({
        url: link.url || '',
        title: link.title || '',
        tags: link.tags || []
      });
    }
  }, [link]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass rounded-2xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <LinkIcon size={16} />
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Title Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Tag size={16} />
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Tags</label>
            
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-2 bg-black/20 rounded-lg">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Predefined Tags */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {predefinedTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
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
                placeholder="Custom tag..."
                className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-2 py-1 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={addCustomTag}
                disabled={!customTag.trim()}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;