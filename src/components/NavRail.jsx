import React from 'react';
import './NavRail.css';

function NavRail({ activeView = 'mail', onViewChange }) {
  return (
    <div className="nav-rail">
      <div className="nav-rail-icons">
        <button 
          className={`nav-rail-icon ${activeView === 'mail' ? 'active' : ''}`}
          onClick={() => onViewChange?.('mail')}
          title="Mail"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 15.5v-11zM4.5 3A1.5 1.5 0 003 4.5v.7l7 4.2 7-4.2v-.7A1.5 1.5 0 0015.5 3h-11zM17 6.3l-6.64 3.98a.75.75 0 01-.72 0L3 6.3v9.2A1.5 1.5 0 004.5 17h11a1.5 1.5 0 001.5-1.5V6.3z"/>
          </svg>
        </button>
        <button 
          className={`nav-rail-icon ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => onViewChange?.('calendar')}
          title="Calendar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 2a1 1 0 00-1 1v1H4.5A2.5 2.5 0 002 6.5v9A2.5 2.5 0 004.5 18h11a2.5 2.5 0 002.5-2.5v-9A2.5 2.5 0 0015.5 4H14V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4.5 5H6v1a1 1 0 102 0V5h4v1a1 1 0 102 0V5h1.5A1.5 1.5 0 0117 6.5V8H3V6.5A1.5 1.5 0 014.5 5zM3 9h14v6.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 15.5V9z"/>
          </svg>
        </button>
        <button 
          className={`nav-rail-icon ${activeView === 'people' ? 'active' : ''}`}
          onClick={() => onViewChange?.('people')}
          title="People"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM7 6a3 3 0 116 0 3 3 0 01-6 0zM3.5 18a6.5 6.5 0 0113 0 .5.5 0 01-.5.5H4a.5.5 0 01-.5-.5zm1.02-.5h10.96a5.5 5.5 0 00-10.96 0z"/>
          </svg>
        </button>
        <button 
          className={`nav-rail-icon ${activeView === 'tasks' ? 'active' : ''}`}
          onClick={() => onViewChange?.('tasks')}
          title="To Do"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 4.5a2.5 2.5 0 012.5-2.5h5A2.5 2.5 0 0116 4.5v11a2.5 2.5 0 01-2.5 2.5h-5A2.5 2.5 0 016 15.5v-11zm2.5-1.5A1.5 1.5 0 007 4.5v11A1.5 1.5 0 008.5 17h5a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0013.5 3h-5z"/>
            <path d="M4 5.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM4.5 8a.5.5 0 000 1h1a.5.5 0 000-1h-1zM4 11.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM4.5 14a.5.5 0 000 1h1a.5.5 0 000-1h-1z"/>
            <path d="M12.854 7.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L9.5 9.793l2.646-2.647a.5.5 0 01.708 0z"/>
          </svg>
        </button>
      </div>
      <div className="nav-rail-bottom">
        <button className="nav-rail-icon" title="Settings">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a4 4 0 100 8 4 4 0 000-8zm-2 4a2 2 0 114 0 2 2 0 01-4 0z"/>
            <path d="M11.25 2.29a1.9 1.9 0 00-2.5 0l-.59.53a.4.4 0 01-.33.1l-.79-.13a1.9 1.9 0 00-2.16 1.25l-.27.75a.4.4 0 01-.23.23l-.75.27A1.9 1.9 0 002.4 7.45l.12.79a.4.4 0 01-.1.33l-.52.59a1.9 1.9 0 000 2.5l.53.59a.4.4 0 01.1.33l-.13.79a1.9 1.9 0 001.25 2.16l.75.27a.4.4 0 01.23.23l.27.75a1.9 1.9 0 002.16 1.25l.79-.12a.4.4 0 01.33.1l.59.52a1.9 1.9 0 002.5 0l.59-.53a.4.4 0 01.33-.1l.79.13a1.9 1.9 0 002.16-1.25l.27-.75a.4.4 0 01.23-.23l.75-.27a1.9 1.9 0 001.25-2.16l-.12-.79a.4.4 0 01.1-.33l.52-.59a1.9 1.9 0 000-2.5l-.53-.59a.4.4 0 01-.1-.33l.13-.79a1.9 1.9 0 00-1.25-2.16l-.75-.27a.4.4 0 01-.23-.23l-.27-.75A1.9 1.9 0 0012.63 2.4l-.79.12a.4.4 0 01-.33-.1l-.26-.23zm-1.82.75a.9.9 0 011.18 0l.6.53c.3.27.7.4 1.1.34l.79-.13a.9.9 0 011.02.6l.27.74c.12.36.4.64.76.77l.75.27a.9.9 0 01.59 1.02l-.13.79a1.4 1.4 0 00.35 1.1l.52.59a.9.9 0 010 1.18l-.53.6a1.4 1.4 0 00-.34 1.1l.13.79a.9.9 0 01-.6 1.02l-.74.27a1.4 1.4 0 00-.77.76l-.27.75a.9.9 0 01-1.02.59l-.79-.13a1.4 1.4 0 00-1.1.35l-.59.52a.9.9 0 01-1.18 0l-.6-.53a1.4 1.4 0 00-1.1-.34l-.79.13a.9.9 0 01-1.02-.6l-.27-.74a1.4 1.4 0 00-.76-.77l-.75-.27a.9.9 0 01-.59-1.02l.13-.79a1.4 1.4 0 00-.35-1.1l-.52-.59a.9.9 0 010-1.18l.53-.6c.27-.3.4-.7.34-1.1l-.13-.79a.9.9 0 01.6-1.02l.74-.27c.36-.13.64-.4.77-.76l.27-.75a.9.9 0 011.02-.59l.79.13c.4.06.8-.07 1.1-.35l.59-.52z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NavRail;
