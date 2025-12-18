import React from 'react';
import './StatusBar.css';

function StatusBar({ postCount }) {
  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className="status-item">Items: {postCount} Unread: {postCount} Reminders: 0</span>
      </div>
      <div className="status-bar-right">
        <span className="status-item">All folders are up to date. Connected to Microsoft Exchange</span>
        <div className="status-zoom">
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;

