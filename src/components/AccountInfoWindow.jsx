import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import AccountSettingsDropdown from './AccountSettingsDropdown';
import RedditAccountSettings from './RedditAccountSettings';
import './AccountInfoWindow.css';

function AccountInfoWindow({ onClose, onOpenOptions }) {
  const { settings } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const handleOptionsClick = () => {
    onClose?.();
    onOpenOptions?.();
  };

  return (
    <div className="account-info-window">
      {/* Left Navigation */}
      <div className="account-info-nav">
        <button className="nav-back-button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="nav-item active">
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2L10 6L14 7L10 8L8 12L6 8L2 7L6 6L8 2Z" />
          </svg>
          <span>Info</span>
        </div>
        <div className="nav-item">
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 4H13V12H3V4Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <span>Open & Export</span>
        </div>
        <div className="nav-item"><span>Save As</span></div>
        <div className="nav-item"><span>Save Attachments</span></div>
        <div className="nav-item"><span>Print</span></div>
        <div className="nav-divider"></div>
        <div className="nav-item"><span>Office Account</span></div>
        <div className="nav-item" onClick={handleOptionsClick}><span>Options</span></div>
        <div className="nav-item"><span>Exit</span></div>
      </div>

      {/* Main Content */}
      <div className="account-info-content">
        <h1 className="account-info-title">Account Information</h1>

        {/* Email Account Box */}
        <div className="email-account-box">
          <div className="email-account-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="2" fill="#0078d4" />
              <text x="8" y="22" fontSize="16" fontWeight="bold" fill="white">E</text>
              <path d="M18 8L24 16L18 24" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="email-account-info">
            <div className="email-account-address">{settings?.email || 'alex.johnson@contoso.com'}</div>
            <div className="email-account-type">Microsoft Exchange</div>
          </div>
          <svg className="email-account-chevron" width="16" height="16" viewBox="0 0 16 16">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <button className="add-account-btn">+ Add Account</button>

        {/* Account Settings Section */}
        <div className="info-section">
          <div className="section-button-wrapper" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="section-button">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 22v-1c0-3 2-5 6-5s6 2 6 5v1" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="22" cy="11" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M18 22v-1c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5v1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <div className="section-button-label">
                Account<br />Settings <span className="chevron-text">˅</span>
              </div>
            </div>
            {showDropdown && (
              <AccountSettingsDropdown
                onOpenAccountSettings={() => {
                  setShowDropdown(false);
                  setShowAccountSettings(true);
                }}
                onClose={() => setShowDropdown(false)}
              />
            )}
          </div>
          <div className="section-content">
            <h2 className="section-title">Account Settings</h2>
            <p className="section-description">Change settings for this account or set up more connections.</p>
            <ul className="section-links">
              <li><a href="#">Access this account on the web.</a></li>
              <li className="link-url">https://outlook.office365.com/{settings?.email?.split('@')[1] ? `...${settings.email.split('@')[1]}/` : ''}</li>
              <li><a href="#">Get the Outlook app for iOS or Android.</a></li>
            </ul>
          </div>
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">{settings?.initials || 'LA'}</div>
            <a href="#" className="change-link">Change</a>
          </div>
        </div>

        {/* Automatic Replies Section */}
        <div className="info-section">
          <div className="section-button">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="10" width="24" height="16" rx="2" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
              <path d="M8 12L20 22L32 12" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
              <path d="M20 6v4M24 8l-4 4-4-4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="section-button-label">
              Automatic<br />Replies
            </div>
          </div>
          <div className="section-content">
            <h2 className="section-title">Automatic Replies (Out of Office)</h2>
            <p className="section-description">Use automatic replies to notify others that you are out of office, on vacation, or not available to respond to email messages.</p>
          </div>
        </div>

        {/* Mailbox Settings / Tools Section */}
        <div className="info-section">
          <div className="section-button">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="10" width="24" height="16" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
              <path d="M8 12L20 20L32 12" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
              <path d="M12 28h16" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>
            <div className="section-button-label">
              Tools<br /><span className="chevron-text">˅</span>
            </div>
          </div>
          <div className="section-content">
            <h2 className="section-title">Mailbox Settings</h2>
            <p className="section-description">Manage the size of your mailbox by emptying Deleted Items and archiving.</p>
            <div className="storage-bar">
              <div className="storage-bar-fill" style={{ width: '5%' }}></div>
            </div>
            <div className="storage-label">■ 94.4 GB free of 99 GB</div>
          </div>
        </div>

        {/* Rules and Alerts Section */}
        <div className="info-section">
          <div className="section-button">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M20 20l6 6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M22 8h12M22 14h8M22 20h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="section-button-label">
              Manage Rules<br />& Alerts
            </div>
          </div>
          <div className="section-content">
            <h2 className="section-title">Rules and Alerts</h2>
            <p className="section-description">Use Rules and Alerts to help organize your incoming email messages, and receive updates when items are added, changed, or removed.</p>
          </div>
        </div>

        {/* Manage Add-ins Section */}
        <div className="info-section">
          <div className="section-button">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="10" stroke="#0078d4" strokeWidth="1.5" fill="none" />
              <path d="M20 12v16M12 20h16" stroke="#0078d4" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="3" fill="#0078d4" />
            </svg>
            <div className="section-button-label">
              Manage Add-<br />ins
            </div>
          </div>
          <div className="section-content">
            <h2 className="section-title">Manage Add-ins</h2>
            <p className="section-description">Manage and acquire Web Add-ins for Outlook.</p>
          </div>
        </div>

      </div>
      {showAccountSettings && (
        <RedditAccountSettings onClose={() => setShowAccountSettings(false)} />
      )}
    </div>
  );
}

export default AccountInfoWindow;
