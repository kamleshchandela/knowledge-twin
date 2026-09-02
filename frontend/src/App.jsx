import React, { useEffect, useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import ChatWindow from './components/chat/ChatWindow';
import DocumentGrid from './components/documents/DocumentGrid';
import MediaViewer from './components/multimedia/MediaViewer';
import Analytics from './components/dashboard/Analytics';
import SettingsPanel from './components/settings/SettingsPanel';
import MemoryView from './components/memory/MemoryView';
import HeroLanding from './components/landing/HeroLanding';
import Loader from './components/ui/Loader';
import { clearMemory, fetchDashboardData } from './services/api';
import { Menu, X } from 'lucide-react';

const tabs = [
  { id: 'chat', label: 'Chat' },
  { id: 'documents', label: 'Documents' },
  { id: 'multimedia', label: 'Media' },
  { id: 'memory', label: 'Memory' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

function App() {
  const defaultSettings = { theme: 'light', modelProfile: 'balanced', alerts: true };
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(() => {
    try {
      return !localStorage.getItem('kt_seen_landing_v1');
    } catch {
      return true;
    }
  });
  const [sessionResetToken, setSessionResetToken] = useState(0);
  const [settingsStatus, setSettingsStatus] = useState('');
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('kt_settings_v1');
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [dashboardData, setDashboardData] = useState({
    stats: { total_queries: 0, docs_indexed: 0, active_users: 1, avg_latency_ms: 0 },
    recent_history: [],
    files: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      if (data) {
        setDashboardData(data);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    const loadingTimer = setTimeout(() => setIsLoading(false), 500);
    return () => {
      clearInterval(interval);
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('kt_settings_v1', JSON.stringify(settings));
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings]);

  const pushStatus = (msg) => {
    setSettingsStatus(msg);
    setTimeout(() => setSettingsStatus(''), 2200);
  };

  const handleSaveSettings = () => {
    if (settings.alerts) {
      pushStatus('Settings saved');
    }
  };

  const handleResetSession = async () => {
    await clearMemory();
    setSessionResetToken((prev) => prev + 1);
    setDashboardData((prev) => ({
      ...prev,
      recent_history: [],
      files: [],
      stats: { ...prev.stats, total_queries: 0, docs_indexed: 0 },
    }));
    setActiveTab('chat');
    if (settings.alerts) {
      pushStatus('Session reset');
    }
  };

  const handleEnterApp = () => {
    setShowLanding(false);
    setActiveTab('chat');
    try {
      localStorage.setItem('kt_seen_landing_v1', '1');
    } catch {
      // no-op
    }
  };

  const handleGoToLanding = () => {
    setShowLanding(true);
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatWindow modelProfile={settings.modelProfile} resetToken={sessionResetToken} />;
      case 'documents':
        return <DocumentGrid files={dashboardData.files} />;
      case 'multimedia':
        return <MediaViewer />;
      case 'memory':
        return <MemoryView />;
      case 'analytics':
        return <Analytics stats={dashboardData.stats} />;
      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            onChangeSettings={setSettings}
            onSaveSettings={handleSaveSettings}
            onResetSession={handleResetSession}
          />
        );
      default:
        return <ChatWindow />;
    }
  };

  if (isLoading) {
    return (
      <div className="app-shell">
        <header className="navbar">
          <div className="navbar-brand">Knowledge Twin</div>
        </header>
        <main className="main-content">
          <div className="glass-card" style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <Loader size="lg" />
          </div>
        </main>
      </div>
    );
  }

  if (showLanding) {
    return <HeroLanding onEnter={handleEnterApp} />;
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <button type="button" className="navbar-brand" onClick={handleGoToLanding}>
          Knowledge Twin
        </button>
        <button
          type="button"
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <nav className="nav-links">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {tabs.map((tab) => (
            <button
              key={`mobile-${tab.id}`}
              className={`mobile-menu-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="system-status">
          <span className="status-dot" />
          System Online {settingsStatus ? `• ${settingsStatus}` : ''}
        </div>
      </header>

      <main className="main-content">
        <div className="terminal-grid">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <section className="content-wrap">
            <div className="glass-card scroll-area">{renderContent()}</div>
          </section>
          <RightPanel data={dashboardData} />
        </div>
      </main>
    </div>
  );
}

export default App;
