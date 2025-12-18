import React, { useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import OutlookLayout from './components/OutlookLayout';
import WindowManager from './components/WindowManager';
import './theme.css';
import './App.css';

function App() {
  const [windows, setWindows] = useState([]);
  const [windowZIndex, setWindowZIndex] = useState(1000);

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

  return (
    <ThemeProvider>
      <div className="app">
        <OutlookLayout onOpenWindow={openWindow} />
        <WindowManager
          windows={windows}
          onClose={closeWindow}
          onUpdate={updateWindow}
          onBringToFront={bringToFront}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
