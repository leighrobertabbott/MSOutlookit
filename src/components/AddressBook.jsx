import React, { useState, useMemo, useRef, useEffect } from 'react';
import { fakeContacts } from '../data/fakeContacts';
import ContactDetails from './ContactDetails';
import { useTheme } from '../ThemeContext';
import './AddressBook.css';

function AddressBook({ onClose }) {
    const { settings } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [showContactDetails, setShowContactDetails] = useState(false);
    const [nameOnly, setNameOnly] = useState(false);

    // Dragging state
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Resizing state
    const [size, setSize] = useState({ width: 950, height: 550 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const windowRef = useRef(null);

    useEffect(() => {
        // Center the window on mount
        if (windowRef.current) {
            setPosition({
                x: (window.innerWidth - size.width) / 2,
                y: (window.innerHeight - size.height) / 2
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
            if (isResizing) {
                const newWidth = Math.max(600, resizeStart.width + (e.clientX - resizeStart.x));
                const newHeight = Math.max(400, resizeStart.height + (e.clientY - resizeStart.y));
                setSize({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, dragStart, resizeStart]);

    const handleTitleBarMouseDown = (e) => {
        if (e.target.closest('.address-book-titlebar') && !e.target.closest('.titlebar-btn')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleResizeMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
    };

    const filteredContacts = useMemo(() => {
        if (!searchQuery.trim()) return fakeContacts;

        const query = searchQuery.toLowerCase();
        return fakeContacts.filter(contact => {
            if (nameOnly) {
                return contact.displayName.toLowerCase().includes(query);
            }
            return (
                contact.displayName.toLowerCase().includes(query) ||
                contact.email.toLowerCase().includes(query) ||
                contact.title.toLowerCase().includes(query) ||
                contact.department.toLowerCase().includes(query) ||
                contact.company.toLowerCase().includes(query)
            );
        });
    }, [searchQuery, nameOnly]);

    const handleRowClick = (contact) => {
        setSelectedContact(contact);
    };

    const handleRowDoubleClick = (contact) => {
        setSelectedContact(contact);
        setShowContactDetails(true);
    };

    const handleCloseContactDetails = () => {
        setShowContactDetails(false);
    };

    return (
        <div className="address-book-overlay">
            <div
                ref={windowRef}
                className="address-book-window"
                style={{
                    left: position.x || '50%',
                    top: position.y || '50%',
                    width: size.width,
                    height: size.height,
                    transform: position.x ? 'none' : 'translate(-50%, -50%)'
                }}
                onMouseDown={handleTitleBarMouseDown}
            >
                {/* Title Bar */}
                <div className="address-book-titlebar">
                    <div className="titlebar-left">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#0078d4">
                            <rect x="1" y="1" width="14" height="14" rx="2" fill="#0078d4" />
                            <path d="M4 4H12M4 7H12M4 10H10" stroke="white" strokeWidth="1.5" />
                        </svg>
                        <span className="titlebar-text">Address Book: Offline Global Address List</span>
                    </div>
                    <div className="titlebar-controls">
                        <button className="titlebar-btn" title="Minimize">─</button>
                        <button className="titlebar-btn" title="Maximize">☐</button>
                        <button className="titlebar-btn close" onClick={onClose} title="Close">✕</button>
                    </div>
                </div>

                {/* Menu Bar */}
                <div className="address-book-menubar">
                    <span className="menu-item">File</span>
                    <span className="menu-item">Edit</span>
                    <span className="menu-item">Tools</span>
                </div>

                {/* Search Bar */}
                <div className="address-book-searchbar">
                    <div className="search-row">
                        <label>Search:</label>
                        <div className="search-options">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="searchType"
                                    checked={!nameOnly}
                                    onChange={() => setNameOnly(false)}
                                />
                                All columns
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="searchType"
                                    checked={nameOnly}
                                    onChange={() => setNameOnly(true)}
                                />
                                Name only
                            </label>
                        </div>
                        <div className="address-book-label">
                            <label>Address Book:</label>
                        </div>
                    </div>
                    <div className="search-row">
                        <input
                            type="text"
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder=""
                        />
                        <select className="address-book-select">
                            <option>Offline Global Address List - {settings?.email?.substring(0, 20) || 'alex.johnson@cont'}...</option>
                        </select>
                        <button className="advanced-find-btn">Advanced Find</button>
                    </div>
                </div>

                {/* Contact List Table */}
                <div className="address-book-table-container">
                    <table className="address-book-table">
                        <thead>
                            <tr>
                                <th className="col-icon"></th>
                                <th className="col-name">Name</th>
                                <th className="col-title">Title</th>
                                <th className="col-phone">Business Phone</th>
                                <th className="col-location">Location</th>
                                <th className="col-department">Department</th>
                                <th className="col-email">Email Address</th>
                                <th className="col-company">Company</th>
                                <th className="col-alias">Alias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map((contact) => (
                                <tr
                                    key={contact.id}
                                    className={selectedContact?.id === contact.id ? 'selected' : ''}
                                    onClick={() => handleRowClick(contact)}
                                    onDoubleClick={() => handleRowDoubleClick(contact)}
                                >
                                    <td className="col-icon">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="#666">
                                            <circle cx="7" cy="5" r="3" />
                                            <path d="M2 13C2 10 4 8 7 8C10 8 12 10 12 13" />
                                        </svg>
                                    </td>
                                    <td className="col-name">{contact.displayName}</td>
                                    <td className="col-title">{contact.title}</td>
                                    <td className="col-phone">{contact.businessPhone}</td>
                                    <td className="col-location">{contact.office}</td>
                                    <td className="col-department">{contact.department}</td>
                                    <td className="col-email">{contact.email}</td>
                                    <td className="col-company">{contact.company}</td>
                                    <td className="col-alias">{contact.alias}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Status Bar */}
                <div className="address-book-statusbar">
                    <span>{filteredContacts.length} items</span>
                </div>

                {/* Resize Handle */}
                <div
                    className="resize-handle"
                    onMouseDown={handleResizeMouseDown}
                />
            </div>

            {/* Contact Details Dialog */}
            {showContactDetails && selectedContact && (
                <ContactDetails
                    contact={selectedContact}
                    onClose={handleCloseContactDetails}
                />
            )}
        </div>
    );
}

export default AddressBook;
