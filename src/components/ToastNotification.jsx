import React, { useState, useEffect } from 'react';
import { fakeContacts } from '../data/fakeContacts';
import './ToastNotification.css';

const fakeSubjects = [
    'MWL NEWS - Weekly Update',
    'Important: Meeting Tomorrow',
    'Your Weekly Digest',
    'Action Required: Review Document',
    'Reminder: Project Deadline',
    'New Message from HR',
    'System Maintenance Notice',
    'Monthly Report Available',
    'Team Update: Sprint Planning',
    'Invitation: Virtual Coffee Chat'
];

const fakePreviews = [
    'View this email in your browser...',
    'Please review the attached document and provide feedback...',
    'Here are the highlights from this week...',
    'Don\'t forget about the meeting scheduled for...',
    'This is a reminder that the deadline is approaching...',
    'We wanted to share some exciting news with you...',
    'Please take a moment to complete the survey...',
    'Your report is ready for download...'
];

function ToastNotification({ notification, onDismiss, onDelete, onFlag }) {
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(notification.id), 300);
    };

    const handleDelete = () => {
        setIsExiting(true);
        setTimeout(() => onDelete(notification.id), 300);
    };

    const handleFlag = () => {
        onFlag?.(notification.id);
        handleDismiss();
    };

    // Auto-dismiss after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            handleDismiss();
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`toast-notification ${isExiting ? 'exiting' : ''}`}>
            {/* Header */}
            <div className="toast-header">
                <div className="toast-app-info">
                    <svg className="toast-outlook-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="1" width="14" height="14" rx="2" fill="#0078d4" />
                        <text x="5" y="11" fontSize="9" fontWeight="bold" fill="white">O</text>
                    </svg>
                    <span>Outlook (classic)</span>
                </div>
                <div className="toast-header-actions">
                    <button className="toast-more-btn" title="More">•••</button>
                    <button className="toast-close-btn" onClick={handleDismiss} title="Dismiss">×</button>
                </div>
            </div>

            {/* Content */}
            <div className="toast-content">
                <div className="toast-avatar">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="20" fill="#e0e0e0" />
                        <circle cx="20" cy="15" r="6" fill="#a0a0a0" />
                        <ellipse cx="20" cy="32" rx="10" ry="8" fill="#a0a0a0" />
                    </svg>
                </div>
                <div className="toast-body">
                    <div className="toast-sender">{notification.sender}</div>
                    <div className="toast-subject">{notification.subject}</div>
                    <div className="toast-preview">{notification.preview}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="toast-actions">
                <button className="toast-action-btn" onClick={handleDelete} title="Delete">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 5H14M6 5V4C6 3.45 6.45 3 7 3H11C11.55 3 12 3.45 12 4V5M7 8V13M11 8V13M5 5L6 15C6 15.55 6.45 16 7 16H11C11.55 16 12 15.55 12 15L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button className="toast-action-btn" onClick={handleFlag} title="Flag">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 3V16M4 3L14 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button className="toast-action-btn" onClick={handleDismiss} title="Dismiss">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M5 5L13 13M13 5L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export function useNotifications(enabled = true, intervalMs = 120000) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!enabled) return;

        const generateNotification = () => {
            const contact = fakeContacts[Math.floor(Math.random() * fakeContacts.length)];
            const subject = fakeSubjects[Math.floor(Math.random() * fakeSubjects.length)];
            const preview = fakePreviews[Math.floor(Math.random() * fakePreviews.length)];

            const newNotification = {
                id: Date.now(),
                sender: contact.displayName,
                subject: subject + ' - ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                preview: preview,
                timestamp: new Date()
            };

            setNotifications(prev => [...prev, newNotification]);

            // Play notification sound if enabled
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhVgYAAAEAAQACAAAAAAAAAAAAAAAAAP//AgAEAAIA//8AAAAA');
                audio.volume = 0.3;
                audio.play().catch(() => { });
            } catch (e) { }
        };

        // Show first notification after a short delay
        const initialTimer = setTimeout(generateNotification, 15000);

        // Then show notifications at the interval
        const interval = setInterval(generateNotification, intervalMs);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [enabled, intervalMs]);

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const flagNotification = (id) => {
        // Just dismiss for now
        dismissNotification(id);
    };

    return { notifications, dismissNotification, deleteNotification, flagNotification };
}

export function NotificationContainer({ notifications, onDismiss, onDelete, onFlag }) {
    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <ToastNotification
                    key={notification.id}
                    notification={notification}
                    onDismiss={onDismiss}
                    onDelete={onDelete}
                    onFlag={onFlag}
                />
            ))}
        </div>
    );
}

export default ToastNotification;
