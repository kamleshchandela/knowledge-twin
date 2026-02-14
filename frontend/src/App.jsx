import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import ChatWindow from './components/chat/ChatWindow';
import DocumentGrid from './components/documents/DocumentGrid';
import MediaViewer from './components/multimedia/MediaViewer';
import Analytics from './components/dashboard/Analytics';
import SettingsPanel from './components/settings/SettingsPanel';
import MemoryView from './components/memory/MemoryView';
import Loader from './components/ui/Loader';

import { fetchDashboardData } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Global Data State
  const [dashboardData, setDashboardData] = useState({
    stats: { total_queries: 0, docs_indexed: 0, active_users: 1, avg_latency_ms: 45 },
    recent_history: [],
    files: []
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      if (data) setDashboardData(data);
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Simulate initial load
    setTimeout(() => setIsLoading(false), 1500);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <ChatWindow />;
      case 'documents': return <DocumentGrid files={dashboardData.files} />;
      case 'multimedia': return <MediaViewer />;
      case 'memory': return <MemoryView />;
      case 'analytics': return <Analytics stats={dashboardData.stats} />;
      case 'settings': return <SettingsPanel />;
      default: return <ChatWindow />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-navy-900 text-white selection:bg-primary-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <motion.main
        layout
        className={`flex-1 relative z-10 transition-all duration-300 flex flex-col h-full overflow-hidden ${isSidebarOpen && !isMobile ? 'ml-[280px]' : isSidebarOpen && !isMobile === false && !isMobile ? 'ml-[80px]' : ''}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 h-full overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {!isMobile && <RightPanel data={dashboardData} />}
    </div>
  );
};

export default App;
