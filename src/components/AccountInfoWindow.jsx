import React from 'react';
import { useTheme } from '../ThemeContext';
import './AccountInfoWindow.css';

function AccountInfoWindow({ onClose }) {
  const { settings } = useTheme();

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
        <div className="nav-item">
          <span>Save As</span>
        </div>
        <div className="nav-item">
          <span>Save Attachments</span>
        </div>
        <div className="nav-item">
          <span>Print</span>
        </div>
        <div className="nav-divider"></div>
        <div className="nav-item">
          <span>Office Account</span>
        </div>
        <div className="nav-item">
          <span>Options</span>
        </div>
        <div className="nav-item">
          <span>Exit</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="account-info-content">
        <h1 className="account-info-title">Account Information</h1>

        <div className="account-section">
          <div className="account-email">
            <svg className="email-icon" width="24" height="24" viewBox="0 0 24 24" fill="#0078d4">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="email-info">
              <div className="email-address">{settings?.email || 'alex.johnson@contoso.com'}</div>
              <div className="email-type">Microsoft Exchange</div>
            </div>
            <button className="add-account-button">+ Add Account</button>
          </div>
        </div>

        <div className="account-section">
          <h2 className="section-title">Account Settings</h2>
          <div className="section-description">Change settings for this account or set up more connections.</div>
          <div className="settings-item">
            <svg className="settings-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M5 16V15C5 12.7909 6.79086 11 9 11H11C13.2091 11 15 12.7909 15 15V16" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <span className="settings-label">Account Settings</span>
            <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="settings-links">
            <a href="#" className="settings-link">Access this account on the web.</a>
            <a href="#" className="settings-link">Get the Outlook app for iOS or Android.</a>
          </div>
          <div className="profile-picture-section">
            <div className="profile-picture-large">{settings?.initials || 'AJ'}</div>
            <a href="#" className="change-link">Change</a>
          </div>
        </div>

        <div className="account-section">
          <h2 className="section-title">Automatic Replies (Out of Office)</h2>
          <div className="section-description">Use automatic replies to notify others that you are out of office, on vacation, or not available to respond to email messages.</div>
          <div className="settings-item">
            <svg className="settings-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M3 6L10 11L17 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <span className="settings-label">Automatic Replies</span>
          </div>
        </div>

        <div className="account-section">
          <h2 className="section-title">Mailbox Settings</h2>
          <div className="section-description">Manage the size of your mailbox by emptying Deleted Items and archiving.</div>
          <div className="settings-item">
            <svg className="settings-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M6 8H14M6 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="settings-label">Tools</span>
            <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="storage-bar-container">
            <div className="storage-bar-label">94.5 GB free of 99 GB</div>
            <div className="storage-bar">
              <div className="storage-bar-fill" style={{ width: '4.5%' }}></div>
            </div>
          </div>
        </div>

        <div className="account-section">
          <h2 className="section-title">Rules and Alerts</h2>
          <div className="section-description">Use Rules and Alerts to help organize your incoming email messages, and receive updates when items are added, changed, or removed.</div>
          <div className="settings-item">
            <svg className="settings-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M7 10H13M10 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="settings-label">Manage Rules & Alerts</span>
          </div>
        </div>

        <div className="account-section">
          <h2 className="section-title">Manage Add-ins</h2>
          <div className="section-description">Manage and acquire Web Add-ins for Outlook.</div>
          <div className="settings-item">
            <svg className="settings-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 5H10V10H5V5Z" fill="currentColor" />
              <path d="M10 5H15V10H10V5Z" fill="currentColor" />
              <path d="M5 10H10V15H5V10Z" fill="currentColor" />
              <path d="M10 10H15V15H10V10Z" fill="currentColor" />
            </svg>
            <span className="settings-label">Manage Add-ins</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountInfoWindow;

