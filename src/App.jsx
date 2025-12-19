import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import OutlookLayout from './components/OutlookLayout';
import WindowManager from './components/WindowManager';
import OutlookOptions from './components/OutlookOptions';
import SetupDialog from './components/SetupDialog';
import { useNotifications, NotificationContainer } from './components/ToastNotification';
import './theme.css';
import './App.css';

function AppContent() {
  const [windows, setWindows] = useState([]);
  const [windowZIndex, setWindowZIndex] = useState(1000);
  const [showOptions, setShowOptions] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const { settings: appSettings, updateSettings: setAppSettings } = useTheme();

  // Toast notifications - every 2 minutes
  const { notifications, dismissNotification, deleteNotification, flagNotification } = useNotifications(true, 120000);

  // Check if setup is needed on first load
  useEffect(() => {
    const hasSetup = sessionStorage.getItem('msoutlookit-setup-complete');
    if (!hasSetup) {
      setShowSetup(true);
    }
  }, []);

  const handleSetupComplete = (userDetails) => {
    if (userDetails) {
      // Save to theme settings
      setAppSettings({
        ...appSettings,
        email: userDetails.email,
        userName: userDetails.fullName,  // Map fullName to userName
        initials: userDetails.initials,
        domain: userDetails.domain
      });
    }
    // Mark setup as complete for this session
    sessionStorage.setItem('msoutlookit-setup-complete', 'true');
    setShowSetup(false);
  };

  const openWindow = (windowConfig) => {
    const newWindow = {
      ...windowConfig,
      id: `window-${Date.now()}-${Math.random()}`,
      zIndex: windowZIndex,
      isMaximized: false,
      position: windowConfig.position || { x: 100 + windows.length * 30, y: 50 + windows.length * 30 },
      size: windowConfig.size || { width: 800, height: 600 }
    };
    setWindows([...windows, newWindow]);
    setWindowZIndex(windowZIndex + 1);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const updateWindow = (id, updates) => {
    setWindows(windows.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const bringToFront = (id) => {
    const newZIndex = windowZIndex + 1;
    setWindowZIndex(newZIndex);
    updateWindow(id, { zIndex: newZIndex });
  };

  const handleOpenOptions = () => {
    setShowOptions(true);
  };

  return (
    <div className="app">
      <OutlookLayout onOpenWindow={openWindow} />
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onUpdate={updateWindow}
        onBringToFront={bringToFront}
        onOpenOptions={handleOpenOptions}
      />
      {showOptions && (
        <OutlookOptions
          onClose={() => setShowOptions(false)}
          settings={appSettings}
          onSaveSettings={(newSettings) => setAppSettings(newSettings)}
        />
      )}
      {showSetup && (
        <SetupDialog onComplete={handleSetupComplete} />
      )}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
        onDelete={deleteNotification}
        onFlag={flagNotification}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;


