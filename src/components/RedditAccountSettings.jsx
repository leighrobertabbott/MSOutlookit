import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import './RedditAccountSettings.css';

function RedditAccountSettings({ onClose }) {
    const { settings, updateSettings } = useTheme();
    const [activeTab, setActiveTab] = useState('Email');
    const [selectedAccount, setSelectedAccount] = useState(0);
    const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('reddit_accounts');
        return saved ? JSON.parse(saved) : [
            { name: settings?.email || 'alex.johnson@contoso.com', type: 'Reddit API (send from this account by default)', isDefault: true }
        ];
    });

    // Dragging state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const windowRef = useRef(null);

    useEffect(() => {
        if (windowRef.current) {
            const windowWidth = windowRef.current.offsetWidth;
            const windowHeight = windowRef.current.offsetHeight;
            setPosition({
                x: (window.innerWidth - windowWidth) / 2,
                y: (window.innerHeight - windowHeight) / 2
            });
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: Math.max(0, e.clientY - dragStart.y)
                });
            }
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart]);

    const handleTitleBarMouseDown = (e) => {
        if (e.target.closest('.reddit-settings-titlebar') && !e.target.closest('.titlebar-close')) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const saveAccounts = (newAccounts) => {
        setAccounts(newAccounts);
        localStorage.setItem('reddit_accounts', JSON.stringify(newAccounts));
    };

    const handleAddAccount = () => {
        if (newUsername.trim()) {
            const username = newUsername.trim().replace(/^u\//, '');
            const newAccount = {
                name: `u/${username}`,
                type: 'Reddit API',
                isDefault: false
            };
            saveAccounts([...accounts, newAccount]);
            setNewUsername('');
            setShowNewAccountDialog(false);
        }
    };

    const handleRemoveAccount = () => {
        if (accounts.length > 1 && !accounts[selectedAccount].isDefault) {
            const newAccounts = accounts.filter((_, i) => i !== selectedAccount);
            saveAccounts(newAccounts);
            setSelectedAccount(0);
        }
    };

    const handleSetDefault = () => {
        const newAccounts = accounts.map((acc, i) => ({
            ...acc,
            isDefault: i === selectedAccount,
            type: i === selectedAccount ? 'Reddit API (send from this account by default)' : 'Reddit API'
        }));
        saveAccounts(newAccounts);
    };

    const tabs = ['Email', 'Data Files', 'RSS Feeds', 'SharePoint Lists', 'Internet Calendars', 'Published Calendars', 'Address Books'];

    return (
        <div className="reddit-settings-overlay">
            <div
                ref={windowRef}
                className="reddit-settings-window"
                style={{
                    left: position.x || '50%',
                    top: position.y || '50%',
                    transform: position.x ? 'none' : 'translate(-50%, -50%)'
                }}
                onMouseDown={handleTitleBarMouseDown}
            >
                {/* Title Bar */}
                <div className="reddit-settings-titlebar">
                    <span className="titlebar-text">Account Settings</span>
                    <button className="titlebar-close" onClick={onClose} title="Close">✕</button>
                </div>

                {/* Header */}
                <div className="reddit-settings-header">
                    <h2 className="settings-main-title">Email Accounts</h2>
                    <p className="settings-description">
                        You can add or remove an account. You can select an account and change its settings.
                    </p>
                </div>

                {/* Tabs */}
                <div className="reddit-settings-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="reddit-settings-toolbar">
                    <button className="toolbar-btn" onClick={() => setShowNewAccountDialog(true)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="4" width="10" height="8" rx="1" stroke="#dcb67a" strokeWidth="1.5" fill="none" />
                            <path d="M14 6v6a1 1 0 01-1 1H5" stroke="#dcb67a" strokeWidth="1" fill="none" />
                        </svg>
                        New...
                    </button>
                    <button className="toolbar-btn disabled">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Repair...
                    </button>
                    <button className="toolbar-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="3" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M6 6h4v4H6z" stroke="currentColor" strokeWidth="1" fill="none" />
                        </svg>
                        Change...
                    </button>
                    <button className="toolbar-btn" onClick={handleSetDefault}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="#0078d4" strokeWidth="1.5" fill="none" />
                            <path d="M5 8l2 2 4-4" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        Set as Default
                    </button>
                    <button className="toolbar-btn" onClick={handleRemoveAccount}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="#d32f2f" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Remove
                    </button>
                    <button className="toolbar-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 8l4 4 4-4M8 12V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button className="toolbar-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 8l4-4 4 4M8 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 2h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Account List */}
                <div className="reddit-settings-content">
                    <div className="account-list-header">
                        <div className="col-name">Name</div>
                        <div className="col-type">Type</div>
                    </div>
                    <div className="account-list">
                        {accounts.map((account, index) => (
                            <div
                                key={index}
                                className={`account-item ${selectedAccount === index ? 'selected' : ''}`}
                                onClick={() => setSelectedAccount(index)}
                            >
                                <div className="account-indicator">
                                    {account.isDefault && (
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <circle cx="7" cy="7" r="5" stroke="#0078d4" strokeWidth="1.5" fill="none" />
                                            <path d="M4 7l2 2 4-4" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    )}
                                </div>
                                <div className="account-name">{account.name}</div>
                                <div className="account-type">{account.type}</div>
                            </div>
                        ))}
                    </div>

                    {/* Status Text */}
                    <div className="account-status">
                        <p className="status-label">Selected account delivers new messages to the following location:</p>
                        <p className="status-location">
                            <strong>{accounts[selectedAccount]?.name}\Inbox</strong>
                        </p>
                        <p className="status-path">
                            in data file C:\Users\...\Reddit\{accounts[selectedAccount]?.name.replace(/[^a-zA-Z0-9]/g, '')}.rdt
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="reddit-settings-footer">
                    <button className="settings-btn primary" onClick={onClose}>Close</button>
                </div>
            </div>

            {/* New Account Dialog */}
            {showNewAccountDialog && (
                <div className="new-account-overlay">
                    <div className="new-account-dialog">
                        <div className="new-account-titlebar">
                            <span>Add Reddit Account</span>
                            <button className="titlebar-close" onClick={() => setShowNewAccountDialog(false)}>✕</button>
                        </div>
                        <div className="new-account-content">
                            <div className="account-type-section">
                                <h3>Account Type</h3>
                                <select className="account-type-select">
                                    <option>Reddit (Public API)</option>
                                </select>
                            </div>
                            <div className="account-login-section">
                                <h3>Your Reddit Username</h3>
                                <p className="login-description">
                                    Enter your Reddit username to add your profile. This will allow you to view your saved posts,
                                    profile information, and personalized subreddit suggestions.
                                </p>
                                <div className="login-form">
                                    <label htmlFor="reddit-username">Username:</label>
                                    <input
                                        id="reddit-username"
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="u/your_username"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()}
                                    />
                                </div>
                                <div className="login-buttons">
                                    <button className="settings-btn primary" onClick={handleAddAccount}>Add Account</button>
                                    <button className="settings-btn" onClick={() => setShowNewAccountDialog(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RedditAccountSettings;
