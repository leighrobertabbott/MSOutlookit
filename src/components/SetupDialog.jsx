import React, { useState } from 'react';
import './SetupDialog.css';

function SetupDialog({ onComplete }) {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [initials, setInitials] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        // Auto-generate name and initials from email
        if (newEmail.includes('@')) {
            const localPart = newEmail.split('@')[0];
            // Try to parse first.last format
            const parts = localPart.split(/[._-]/);
            if (parts.length >= 2) {
                const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                const lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
                setFullName(`${firstName} ${lastName}`);
                setInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`);
            } else {
                setFullName(localPart.charAt(0).toUpperCase() + localPart.slice(1));
                setInitials(localPart.substring(0, 2).toUpperCase());
            }
        }
    };

    const handleConnect = () => {
        if (!email) return;

        const domain = email.includes('@') ? email.split('@')[1] : '';

        onComplete({
            email,
            fullName: fullName || email.split('@')[0],
            initials: initials || email.substring(0, 2).toUpperCase(),
            domain
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConnect();
        }
    };

    return (
        <div className="setup-dialog-overlay">
            <div className="setup-dialog">
                <button className="setup-close-btn" onClick={() => onComplete(null)}>×</button>

                <div className="setup-logo">
                    <svg className="setup-logo-icon" width="48" height="48" viewBox="0 0 48 48" fill="none">
                        {/* Modern Outlook envelope logo */}
                        <defs>
                            <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0078d4" />
                                <stop offset="100%" stopColor="#005a9e" />
                            </linearGradient>
                        </defs>
                        {/* Envelope body */}
                        <path d="M4 14C4 12.9 4.9 12 6 12H42C43.1 12 44 12.9 44 14V38C44 39.1 43.1 40 42 40H6C4.9 40 4 39.1 4 38V14Z" fill="url(#envGrad)" />
                        {/* Envelope flap */}
                        <path d="M4 14L24 28L44 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        {/* Paper sliding out */}
                        <rect x="12" y="4" width="24" height="20" rx="2" fill="#ffffff" stroke="#0078d4" strokeWidth="1" />
                        {/* Paper lines */}
                        <line x1="16" y1="10" x2="32" y2="10" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="16" y1="15" x2="28" y2="15" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round" />
                        {/* O badge */}
                        <circle cx="12" cy="32" r="8" fill="#0078d4" stroke="#ffffff" strokeWidth="2" />
                        <text x="12" y="36" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">O</text>
                    </svg>
                    <span className="setup-logo-text">Outlook</span>
                </div>

                <div className="setup-form">
                    <label className="setup-label">Email address</label>
                    <input
                        type="email"
                        className="setup-input"
                        placeholder="someone@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />

                    <button
                        className="setup-advanced-btn"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        Advanced options {showAdvanced ? '˄' : '˅'}
                    </button>

                    {showAdvanced && (
                        <div className="setup-advanced-fields">
                            <label className="setup-label">Full Name</label>
                            <input
                                type="text"
                                className="setup-input"
                                placeholder="John Smith"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <label className="setup-label">Initials</label>
                            <input
                                type="text"
                                className="setup-input"
                                placeholder="JS"
                                value={initials}
                                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                                maxLength={3}
                            />
                        </div>
                    )}

                    <div className="setup-checkbox-row">
                        <input type="checkbox" id="manual-setup" className="setup-checkbox" />
                        <label htmlFor="manual-setup">Let me set up my account manually</label>
                    </div>

                    <button
                        className="setup-connect-btn"
                        onClick={handleConnect}
                        disabled={!email}
                    >
                        Connect
                    </button>

                    <div className="setup-footer">
                        <span>No account?</span>
                        <a href="https://outlook.com" target="_blank" rel="noopener noreferrer">
                            Create an Outlook.com email address to get started.
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetupDialog;
