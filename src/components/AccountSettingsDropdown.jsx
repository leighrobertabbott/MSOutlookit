import React, { useState, useRef, useEffect } from 'react';
import './AccountSettingsDropdown.css';

function AccountSettingsDropdown({ onOpenAccountSettings, onClose }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const menuItems = [
        {
            icon: 'account-settings',
            title: 'Account Settings...',
            description: 'Add and remove accounts or change existing connection settings.',
            onClick: () => onOpenAccountSettings?.()
        },
        {
            icon: 'account-sync',
            title: 'Account Name and Sync Settings',
            description: 'Update basic account settings such as account name and folder sync settings.'
        },
        {
            icon: 'delegate',
            title: 'Delegate Access',
            description: 'Give others permission to receive items and respond on your behalf.'
        },
        {
            icon: 'address-book',
            title: 'Download Address Book...',
            description: 'Download a copy of the Global Address Book.'
        },
        {
            icon: 'mobile',
            title: 'Manage Mobile Notifications',
            description: 'Set up SMS and Mobile Notifications.'
        },
        {
            icon: 'profile-change',
            title: 'Change Profile',
            description: 'Restart Microsoft Outlook and choose a different profile.'
        },
        {
            icon: 'profile-manage',
            title: 'Manage Profiles',
            description: 'Add and remove profiles or change existing profile settings.'
        }
    ];

    const renderIcon = (iconType) => {
        switch (iconType) {
            case 'account-settings':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M6 22v-1c0-3 2-5 6-5s6 2 6 5v1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <circle cx="22" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" />
                        <path d="M18 22v-1c0-2 1-3.5 4-3.5s4 1.5 4 3.5v1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                );
            case 'account-sync':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M6 22v-1c0-3 2-5 6-5s6 2 6 5v1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M22 8v8M26 12h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                );
            case 'delegate':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M5 22v-1c0-2.5 2-4.5 5-4.5s5 2 5 4.5v1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <circle cx="20" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M15 22v-1c0-2.5 2-4.5 5-4.5s5 2 5 4.5v1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                );
            case 'address-book':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="6" y="6" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M4 10h2M4 16h2M4 22h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="15" cy="13" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" />
                        <path d="M10 22v-1c0-2 2-3 5-3s5 1 5 3v1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                );
            case 'mobile':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="10" y="5" width="12" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M14 8h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        <circle cx="16" cy="23" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                    </svg>
                );
            case 'profile-change':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M6 24v-1c0-3 2-5 6-5s6 2 6 5v1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M22 20l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <path d="M26 16H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                );
            case 'profile-manage':
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M16 12v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="account-settings-dropdown" ref={dropdownRef}>
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className="dropdown-menu-item"
                    onClick={() => {
                        item.onClick?.();
                        onClose?.();
                    }}
                >
                    <div className="dropdown-menu-icon">
                        {renderIcon(item.icon)}
                    </div>
                    <div className="dropdown-menu-content">
                        <div className="dropdown-menu-title">{item.title}</div>
                        <div className="dropdown-menu-description">{item.description}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AccountSettingsDropdown;
