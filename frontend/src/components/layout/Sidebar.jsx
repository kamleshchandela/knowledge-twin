import React from 'react';
import { BarChart2, Brain, FileText, Image as ImageIcon, MessageSquare, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'multimedia', label: 'Multimedia', icon: ImageIcon },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="side-column">
      <div className="glass-card scroll-area">
        <div className="label-mono" style={{ marginBottom: 10 }}>
          Navigation
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`action-btn ${activeTab === item.id ? 'btn-submit' : ''}`}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 8,
              }}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ marginTop: 14 }}>
          <div className="label-mono">System Build</div>
          <p className="mono" style={{ margin: '8px 0 0', fontSize: 12 }}>
            KT-V2.4 Tactical
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
