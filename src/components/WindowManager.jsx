import React from 'react';
import OutlookWindow from './OutlookWindow';
import './WindowManager.css';

function WindowManager({ windows, onClose, onUpdate, onBringToFront, onOpenOptions }) {
  return (
    <div className="window-manager">
      {windows.map((window) => (
        <OutlookWindow
          key={window.id}
          window={window}
          onClose={() => onClose(window.id)}
          onUpdate={(updates) => onUpdate(window.id, updates)}
          onBringToFront={() => onBringToFront(window.id)}
          onOpenOptions={onOpenOptions}
        />
      ))}
    </div>
  );
}

export default WindowManager;


