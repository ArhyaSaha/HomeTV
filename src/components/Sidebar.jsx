import { Home, Heart, Share, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'favourites', label: 'Favourites', icon: Heart },
    { id: 'share', label: 'Share Link', icon: Share },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full glass-dark transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-2xl font-bold metallic-gold-text">MyTV</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                  : 'hover:bg-white/10'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon 
                size={20} 
                className={isActive ? 'text-blue-400' : 'text-gray-300'} 
              />
              {!collapsed && (
                <span 
                  className={`font-medium ${
                    isActive ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">
              MyTV v1.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;