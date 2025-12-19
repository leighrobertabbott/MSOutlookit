import React, { useState } from 'react';
import './ShareToTeams.css';

function ShareToTeams({ onClose, email, settings }) {
    const [shareToValue, setShareToValue] = useState('');
    const [message, setMessage] = useState('');
    const [includeAttachments, setIncludeAttachments] = useState(false);

    const handleShare = () => {
        // In a real app, this would share to Teams
        console.log('Sharing to Teams:', { shareToValue, message, includeAttachments, email });
        onClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="teams-overlay">
            <div className="teams-window">
                {/* Title Bar */}
                <div className="teams-titlebar">
                    <div className="teams-titlebar-left">
                        <svg className="teams-title-icon" width="16" height="16" viewBox="0 0 2229 2074" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#5059C9" d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483c0,0,0,0,0,0v524.398 c0,199.901-162.051,361.952-361.952,361.952h0h-1.711c-199.901,0.028-361.975-162-362.004-361.901c0-0.017,0-0.034,0-0.052V828.971 C1503.167,800.544,1526.211,777.5,1554.637,777.5L1554.637,777.5z" />
                            <circle fill="#5059C9" cx="1943.75" cy="440.583" r="233.25" />
                            <circle fill="#7B83EB" cx="1218.083" cy="336.917" r="336.917" />
                            <path fill="#7B83EB" d="M1667.323,777.5H717.01c-53.743,1.33-96.257,45.931-95.01,99.676v598.105 c-7.505,322.519,247.657,590.16,570.167,598.053c322.51-7.893,577.671-275.534,570.167-598.053V877.176 C1763.579,823.431,1721.066,778.83,1667.323,777.5z" />
                            <linearGradient id="a_icon" gradientUnits="userSpaceOnUse" x1="198.099" y1="1683.0726" x2="942.2344" y2="394.2607" gradientTransform="matrix(1 0 0 -1 0 2075.3333)">
                                <stop offset="0" stopColor="#5a62c3" />
                                <stop offset=".5" stopColor="#4d55bd" />
                                <stop offset="1" stopColor="#3940ab" />
                            </linearGradient>
                            <path fill="url(#a_icon)" d="M95.01,466.5h950.312c52.473,0,95.01,42.538,95.01,95.01v950.312c0,52.473-42.538,95.01-95.01,95.01 H95.01c-52.473,0-95.01-42.538-95.01-95.01V561.51C0,509.038,42.538,466.5,95.01,466.5z" />
                            <path fill="#FFF" d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844h500.088V828.193z" />
                        </svg>
                        <span>Share to Teams</span>
                    </div>
                    <div className="teams-titlebar-right">
                        <span className="teams-more-btn">•••</span>
                        <span className="teams-org">{settings?.domain?.split('.')[0] || 'Organization'}</span>
                        <div className="teams-title-avatar">{settings?.initials || 'U'}</div>
                        <button className="teams-title-btn minimize">─</button>
                        <button className="teams-title-btn maximize">□</button>
                        <button className="teams-title-btn close" onClick={onClose}>×</button>
                    </div>
                </div>

                {/* Content */}
                <div className="teams-content">
                    {/* Header */}
                    <div className="teams-header">
                        <div className="teams-logo">
                            <svg width="40" height="40" viewBox="0 0 2229 2074" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#5059C9" d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483c0,0,0,0,0,0v524.398 c0,199.901-162.051,361.952-361.952,361.952h0h-1.711c-199.901,0.028-361.975-162-362.004-361.901c0-0.017,0-0.034,0-0.052V828.971 C1503.167,800.544,1526.211,777.5,1554.637,777.5L1554.637,777.5z" />
                                <circle fill="#5059C9" cx="1943.75" cy="440.583" r="233.25" />
                                <circle fill="#7B83EB" cx="1218.083" cy="336.917" r="336.917" />
                                <path fill="#7B83EB" d="M1667.323,777.5H717.01c-53.743,1.33-96.257,45.931-95.01,99.676v598.105 c-7.505,322.519,247.657,590.16,570.167,598.053c322.51-7.893,577.671-275.534,570.167-598.053V877.176 C1763.579,823.431,1721.066,778.83,1667.323,777.5z" />
                                <linearGradient id="a_logo" gradientUnits="userSpaceOnUse" x1="198.099" y1="1683.0726" x2="942.2344" y2="394.2607" gradientTransform="matrix(1 0 0 -1 0 2075.3333)">
                                    <stop offset="0" stopColor="#5a62c3" />
                                    <stop offset=".5" stopColor="#4d55bd" />
                                    <stop offset="1" stopColor="#3940ab" />
                                </linearGradient>
                                <path fill="url(#a_logo)" d="M95.01,466.5h950.312c52.473,0,95.01,42.538,95.01,95.01v950.312c0,52.473-42.538,95.01-95.01,95.01 H95.01c-52.473,0-95.01-42.538-95.01-95.01V561.51C0,509.038,42.538,466.5,95.01,466.5z" />
                                <path fill="#FFF" d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844h500.088V828.193z" />
                            </svg>
                        </div>
                        <h1>Share to Microsoft Teams</h1>
                        <div className="teams-header-avatar">{settings?.initials || 'U'}</div>
                    </div>

                    {/* Share to field */}
                    <div className="teams-field">
                        <label>Share to</label>
                        <div className="teams-select">
                            <input
                                type="text"
                                placeholder="Type the name of a person, group, or channel"
                                value={shareToValue}
                                onChange={(e) => setShareToValue(e.target.value)}
                            />
                            <svg className="teams-select-chevron" width="12" height="12" viewBox="0 0 12 12">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                        </div>
                    </div>

                    {/* Message field */}
                    <div className="teams-field">
                        <label>Type a message</label>
                        <textarea
                            className="teams-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Email Preview Card */}
                    <div className="teams-email-preview">
                        <div className="email-preview-header">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#666" strokeWidth="1.5" fill="none" />
                                <path d="M2 7L12 14L22 7" stroke="#666" strokeWidth="1.5" fill="none" />
                            </svg>
                            <span className="email-preview-subject">{email?.subject || 'Email subject'}</span>
                        </div>
                        <div className="email-preview-meta">
                            <span className="email-preview-sender">{email?.from || 'Sender'}</span>
                            <a href="#" className="email-preview-email">{email?.fromEmail || 'sender@example.com'}</a>
                        </div>
                        <div className="email-preview-to">
                            To {settings?.email || 'recipient@example.com'}
                        </div>
                        <div className="email-preview-date">
                            {email?.date ? formatDate(email.date) : 'Date'}
                        </div>
                        <a href="#" className="email-preview-link">View this email in your browser</a>
                        <div className="email-preview-body">
                            {email?.plainTextPreview || email?.body || 'Email content preview...'}
                        </div>
                    </div>

                    {/* Include attachments */}
                    <label className="teams-attachments">
                        <input
                            type="checkbox"
                            checked={includeAttachments}
                            onChange={(e) => setIncludeAttachments(e.target.checked)}
                        />
                        <span>Include attachments</span>
                    </label>

                    {/* Share button */}
                    <div className="teams-footer">
                        <button
                            className="teams-share-btn"
                            onClick={handleShare}
                            disabled={!shareToValue}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareToTeams;
