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
                        <svg className="teams-title-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="5" cy="3" r="2" fill="#5059c9" />
                            <circle cx="11" cy="3" r="2" fill="#7b83eb" />
                            <circle cx="8" cy="6" r="2.5" fill="#5059c9" />
                            <rect x="2" y="7" width="6" height="7" rx="1" fill="#5059c9" />
                            <rect x="8" y="5" width="6" height="7" rx="1" fill="#7b83eb" />
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
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="12" cy="8" r="5" fill="#5059c9" />
                                <circle cx="28" cy="8" r="5" fill="#7b83eb" />
                                <circle cx="20" cy="14" r="6" fill="#5059c9" />
                                <rect x="6" y="16" width="14" height="16" rx="2" fill="#5059c9" />
                                <rect x="20" y="12" width="14" height="16" rx="2" fill="#7b83eb" />
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
