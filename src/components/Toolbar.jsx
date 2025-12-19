import React, { useState, useEffect, useRef } from 'react';
import { searchSubreddits } from '../services/redditApi';
import { useTheme } from '../ThemeContext';
import './Toolbar.css';

function Toolbar({ onNewMessage, onOpenAccountInfo, onSearch, onOpenAddressBook, onOpenOptions, onShareToTeams, selectedPost }) {
  const { settings } = useTheme();
  const [activeTab, setActiveTab] = useState('Home');
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search for subreddit suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchValue.trim().length >= 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await searchSubreddits(searchValue);
          if (results?.data?.children) {
            const subs = results.data.children.map(child => ({
              name: child.data.display_name,
              title: child.data.title,
              subscribers: child.data.subscribers,
              icon: child.data.icon_img || child.data.community_icon
            })).slice(0, 8);
            setSuggestions(subs);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        selectSuggestion(suggestions[selectedIndex].name);
      } else if (searchValue.trim()) {
        onSearch?.(searchValue);
        setSearchValue('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setSelectedIndex(-1);
  };

  const selectSuggestion = (name) => {
    onSearch?.(name);
    setSearchValue('');
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const formatSubscribers = (count) => {
    if (!count) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <>
      {/* Quick Access Toolbar */}
      <div className="quick-access-toolbar">
        <div className="qat-left">
          <div className="outlook-icon">
            <svg width="16" height="16" viewBox="0 0 256 256" fill="none">
              <defs>
                <linearGradient id="envelopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#28A8EA" />
                  <stop offset="100%" stopColor="#0078D4" />
                </linearGradient>
              </defs>
              <rect x="75" y="20" width="150" height="200" rx="6" fill="#FFFFFF" />
              <path d="M75 28 Q75 20 83 20 H217 Q225 20 225 28 V56 H75 Z" fill="#106EBE" />
              <rect x="75" y="56" width="102" height="130" fill="#2B88D8" />
              <rect x="177" y="56" width="48" height="56" fill="#4CD6F7" />
              <rect x="177" y="112" width="48" height="74" fill="#005A9E" />
              <rect x="75" y="112" width="150" height="4" fill="#FFFFFF" />
              <rect x="173" y="56" width="4" height="130" fill="#FFFFFF" />
              <path d="M75 160 L150 195 L225 155 V225 Q225 236 215 236 H85 Q75 236 75 225 Z" fill="url(#envelopeGrad)" />
              <path d="M225 155 L225 236 L150 195 Z" fill="#004C87" opacity="0.4" />
              <path d="M75 160 L225 155 L225 158 L75 170 Z" fill="#000000" opacity="0.15" />
              <rect x="25" y="85" width="140" height="140" rx="10" fill="#0F6CBD" />
              <path d="M 95, 120 A 35,35 0 1,1 95, 190 A 35,35 0 1,1 95, 120 Z M 95, 143 A 12,12 0 1,0 95, 167 A 12,12 0 1,0 95, 143 Z" fill="#FFFFFF" />
            </svg>
          </div>
          <button className="qat-button" title="Refresh">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 3.5C5.51472 3.5 3.5 5.51472 3.5 8C3.5 10.4853 5.51472 12.5 8 12.5C10.4853 12.5 12.5 10.4853 12.5 8C12.5 5.51472 10.4853 3.5 8 3.5Z" />
              <path d="M8 5V8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button className="qat-button" title="Undo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 4L2 7L5 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 7H10C11.6569 7 13 8.34315 13 10V11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          <button className="qat-button" title="Redo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 4L14 7L11 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 7H6C4.34315 7 3 8.34315 3 10V11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>
          <div className="qat-dropdown" title="Customize Quick Access Toolbar">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="qat-center">
          <div className="search-container" ref={searchRef}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26808 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8204 10.4424 11.8566L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8566 10.4424C11.8204 10.4062 11.7822 10.3734 11.7422 10.3439ZM12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            {isLoading && <span className="search-loading">...</span>}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((sub, index) => (
                  <div
                    key={sub.name}
                    className={`search-suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => selectSuggestion(sub.name)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="suggestion-icon">
                      {sub.icon ? (
                        <img src={sub.icon} alt="" />
                      ) : (
                        <span>📁</span>
                      )}
                    </div>
                    <div className="suggestion-info">
                      <div className="suggestion-name">{sub.name}</div>
                      <div className="suggestion-meta">{formatSubscribers(sub.subscribers)} items</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="qat-right">
          <span className="try-new-outlook-inline">Try the new Outlook</span>
          <div className="toggle-switch-inline">
            <div className="toggle-switch-track">
              <div className="toggle-switch-thumb"></div>
            </div>
          </div>
          <button className="copilot-button-inline">
            <svg className="copilot-icon" width="16" height="16" viewBox="0 0 16 16">
              <defs>
                <linearGradient id="copilotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0078D4" />
                  <stop offset="25%" stopColor="#00BCF2" />
                  <stop offset="50%" stopColor="#00A4A6" />
                  <stop offset="75%" stopColor="#00B294" />
                  <stop offset="100%" stopColor="#00CC6A" />
                </linearGradient>
              </defs>
              <path d="M8 2L10 6L14 7L10 8L8 12L6 8L2 7L6 6L8 2Z" fill="url(#copilotGradient)" />
            </svg>
            Copilot
          </button>
          <div className="user-avatar-small">{settings?.initials || 'AJ'}</div>
          <button className="qat-button notification-button" title="Notifications">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1.5C6.34315 1.5 5 2.84315 5 4.5V7.5C5 8.05228 4.55228 8.5 4 8.5H3.5V13.5H12.5V8.5H12C11.4477 8.5 11 8.05228 11 7.5V4.5C11 2.84315 9.65685 1.5 8 1.5ZM3.5 14.5H12.5C13.0523 14.5 13.5 14.0523 13.5 13.5V8.5C13.5 7.94772 13.0523 7.5 12.5 7.5H12V4.5C12 2.29086 10.2091 0.5 8 0.5C5.79086 0.5 4 2.29086 4 4.5V7.5H3.5C2.94772 7.5 2.5 7.94772 2.5 8.5V13.5C2.5 14.0523 2.94772 14.5 3.5 14.5Z" />
            </svg>
          </button>
          <button className="qat-button window-minimize" title="Minimize"></button>
          <button className="qat-button window-maximize" title="Maximize"></button>
          <button className="qat-button window-close" title="Close"></button>
        </div>
      </div>

      {/* Ribbon Tabs */}
      <div className="ribbon-tabs">
        <button
          className={`ribbon-tab ${activeTab === 'File' ? 'active' : ''}`}
          onClick={() => setActiveTab('File')}
        >
          File
        </button>
        <button
          className={`ribbon-tab ${activeTab === 'Home' ? 'active' : ''}`}
          onClick={() => setActiveTab('Home')}
        >
          Home
        </button>
        <button
          className={`ribbon-tab ${activeTab === 'SendReceive' ? 'active' : ''}`}
          onClick={() => setActiveTab('SendReceive')}
        >
          Send / Receive
        </button>
        <button
          className={`ribbon-tab ${activeTab === 'View' ? 'active' : ''}`}
          onClick={() => setActiveTab('View')}
        >
          View
        </button>
        <button
          className={`ribbon-tab ${activeTab === 'Help' ? 'active' : ''}`}
          onClick={() => setActiveTab('Help')}
        >
          Help
        </button>
      </div>

      {/* Ribbon Content */}
      <div className="ribbon-content">
        {activeTab === 'Home' && <HomeRibbon onNewMessage={onNewMessage} onOpenAddressBook={onOpenAddressBook} onShareToTeams={onShareToTeams} selectedPost={selectedPost} />}
        {activeTab === 'SendReceive' && <SendReceiveRibbon />}
        {activeTab === 'View' && <ViewRibbon />}
        {activeTab === 'Help' && <HelpRibbon />}
        {activeTab === 'File' && <FileRibbon onOpenAccountInfo={onOpenAccountInfo} />}
      </div>
    </>
  );
}

function HomeRibbon({ onNewMessage, onOpenAddressBook, onShareToTeams, selectedPost }) {
  return (
    <div className="ribbon-panel">
      {/* New Email Button */}
      <button className="ribbon-button new-email-button" onClick={onNewMessage}>
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="4" width="12" height="9" rx="1" fill="white" />
          <path d="M2 5L8 9L14 5" stroke="#0078d4" strokeWidth="1.5" fill="none" />
        </svg>
        <span>New Email</span>
        <svg className="dropdown-arrow" width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
          <path d="M1 2.5L4 5.5L7 2.5" stroke="white" strokeWidth="1" fill="none" />
        </svg>
      </button>

      <div className="ribbon-separator"></div>

      {/* Delete */}
      <button className="ribbon-button icon-only" title="Delete">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5.5 2L6 1H10L10.5 2H14V3H2V2H5.5Z" />
          <path d="M3 4H13V14C13 14.5 12.5 15 12 15H4C3.5 15 3 14.5 3 14V4Z" />
        </svg>
      </button>

      {/* Archive */}
      <button className="ribbon-button icon-only" title="Archive">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="12" height="4" rx="1" />
          <path d="M3 6V13C3 13.5 3.5 14 4 14H12C12.5 14 13 13.5 13 13V6" fill="currentColor" />
          <rect x="6" y="8" width="4" height="2" rx="0.5" fill="#1e1e1e" />
        </svg>
      </button>

      {/* Move to */}
      <button className="ribbon-button" title="Move to">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 3H7L8 4H14V13H2V3Z" />
          <path d="M8 7V11M8 11L6 9M8 11L10 9" stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Move to: ?</span>
        <svg className="dropdown-arrow" width="8" height="8" viewBox="0 0 8 8">
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </button>

      <div className="ribbon-separator"></div>

      {/* Share to Teams */}
      <button
        className="ribbon-button"
        title="Share to Teams"
        onClick={onShareToTeams}
        disabled={!selectedPost}
      >
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 2229 2074" xmlns="http://www.w3.org/2000/svg">
          <path fill="#5059C9" d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483c0,0,0,0,0,0v524.398 c0,199.901-162.051,361.952-361.952,361.952h0h-1.711c-199.901,0.028-361.975-162-362.004-361.901c0-0.017,0-0.034,0-0.052V828.971 C1503.167,800.544,1526.211,777.5,1554.637,777.5L1554.637,777.5z" />
          <circle fill="#5059C9" cx="1943.75" cy="440.583" r="233.25" />
          <circle fill="#7B83EB" cx="1218.083" cy="336.917" r="336.917" />
          <path fill="#7B83EB" d="M1667.323,777.5H717.01c-53.743,1.33-96.257,45.931-95.01,99.676v598.105 c-7.505,322.519,247.657,590.16,570.167,598.053c322.51-7.893,577.671-275.534,570.167-598.053V877.176 C1763.579,823.431,1721.066,778.83,1667.323,777.5z" />
          <linearGradient id="a_toolbar" gradientUnits="userSpaceOnUse" x1="198.099" y1="1683.0726" x2="942.2344" y2="394.2607" gradientTransform="matrix(1 0 0 -1 0 2075.3333)">
            <stop offset="0" stopColor="#5a62c3" />
            <stop offset=".5" stopColor="#4d55bd" />
            <stop offset="1" stopColor="#3940ab" />
          </linearGradient>
          <path fill="url(#a_toolbar)" d="M95.01,466.5h950.312c52.473,0,95.01,42.538,95.01,95.01v950.312c0,52.473-42.538,95.01-95.01,95.01 H95.01c-52.473,0-95.01-42.538-95.01-95.01V561.51C0,509.038,42.538,466.5,95.01,466.5z" />
          <path fill="#FFF" d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844h500.088V828.193z" />
        </svg>
        <span>Share to Teams</span>
        <svg className="dropdown-arrow" width="8" height="8" viewBox="0 0 8 8">
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </button>

      <div className="ribbon-separator"></div>

      {/* Unread/Read */}
      <button className="ribbon-button" title="Unread/Read">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="4" width="12" height="9" rx="1" />
          <path d="M2 5L8 9L14 5" stroke="#1e1e1e" strokeWidth="1" fill="none" />
        </svg>
        <span>Unread/ Read</span>
        <svg className="dropdown-arrow" width="8" height="8" viewBox="0 0 8 8">
          <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </button>

      <div className="ribbon-separator"></div>

      {/* Flag */}
      <button className="ribbon-button icon-only" title="Flag">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 2V14" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 3H12L9 6L12 9H3" fill="#e74856" />
        </svg>
      </button>

      {/* Pin */}
      <button className="ribbon-button icon-only" title="Pin">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2L10 4L9 8L12 11H10L8 14L6 11H4L7 8L6 4L8 2Z" />
        </svg>
      </button>

      <div className="ribbon-separator"></div>

      {/* Search People */}
      <button className="ribbon-button" title="Search People" onClick={onOpenAddressBook}>
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M9 9L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Search People</span>
      </button>

      <div className="ribbon-separator"></div>

      {/* Reply */}
      <button className="ribbon-button icon-only" title="Reply">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 4L2 8L6 12V9C10 9 12 10 13 14C13 10 11 6 6 6V4Z" />
        </svg>
      </button>

      {/* Reply All */}
      <button className="ribbon-button icon-only" title="Reply All">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 4L4 8L8 12V9.5C11 9.5 13 10.5 14 14C14 10.5 12.5 6.5 8 6.5V4Z" />
          <path d="M4 6L1 8.5L4 11" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </button>

      {/* Forward */}
      <button className="ribbon-button icon-only" title="Forward">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 4L14 8L10 12V9C6 9 4 10 3 14C3 10 5 6 10 6V4Z" />
        </svg>
      </button>

      <div className="ribbon-separator"></div>

      {/* More actions */}
      <button className="ribbon-button icon-only" title="More">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="3" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="13" cy="8" r="1.5" />
        </svg>
      </button>

      {/* Reply with Scheduling Poll */}
      <button className="ribbon-button" title="Reply with Scheduling Poll">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="#0078d4">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="#0078d4" strokeWidth="1" fill="none" />
          <path d="M2 5H14" stroke="#0078d4" strokeWidth="1" />
          <rect x="4" y="7" width="2" height="2" fill="#0078d4" />
          <rect x="7" y="7" width="2" height="2" fill="#0078d4" />
          <rect x="10" y="7" width="2" height="2" fill="#0078d4" />
          <rect x="4" y="10" width="2" height="2" fill="#0078d4" />
        </svg>
        <span>Reply with Scheduling Poll</span>
      </button>
    </div>
  );
}

function SendReceiveRibbon() {
  return (
    <div className="ribbon-panel">
      <button className="ribbon-button large">
        <svg className="ribbon-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M10 5V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Send/Receive All Folders</span>
      </button>
    </div>
  );
}

function ViewRibbon() {
  return (
    <div className="ribbon-panel">
      <button className="ribbon-button">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Show Focused Inbox</span>
      </button>
      <button className="ribbon-button">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Change View</span>
      </button>
      <button className="ribbon-button">
        <svg className="ribbon-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="2" fill="currentColor" />
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        <span>Current View</span>
      </button>
    </div>
  );
}

function HelpRibbon() {
  return (
    <div className="ribbon-panel help-ribbon">
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M7.5 7.5a2.5 2.5 0 115 0c0 1.5-1.5 2-1.5 3M10 14h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Help</span>
      </button>
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        <span>Contact Support</span>
      </button>
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2v4M10 14v4M4.93 4.93l2.83 2.83M12.24 12.24l2.83 2.83M2 10h4M14 10h4M4.93 15.07l2.83-2.83M12.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Troubleshoot</span>
      </button>
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4h12a1 1 0 011 1v9a1 1 0 01-1 1h-5l-3 3v-3H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        <span>Feedback</span>
      </button>
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3v3M10 14v3M5 10H2M18 10h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M10 2l1.5 1.5M10 2l-1.5 1.5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Suggest a Feature</span>
      </button>
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="4" y="6" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M7 4h6M10 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Show Training</span>
      </button>
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2l2 4h4l-3 3 1 5-4-3-4 3 1-5-3-3h4l2-4z" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
        </svg>
        <span>What's New</span>
      </button>
      <div className="ribbon-separator"></div>
      <button className="ribbon-button-vertical">
        <svg className="ribbon-icon-large" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Support Tool</span>
      </button>
      <button className="ribbon-button-more">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="12" cy="8" r="1.5" />
        </svg>
      </button>
    </div>
  );
}

function FileRibbon({ onOpenAccountInfo }) {
  return (
    <div className="ribbon-panel">
      <button className="ribbon-button" onClick={onOpenAccountInfo}>
        <span>Info</span>
      </button>
    </div>
  );
}

export default Toolbar;
