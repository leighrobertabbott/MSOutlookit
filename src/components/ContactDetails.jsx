import React, { useState, useRef, useEffect } from 'react';
import './ContactDetails.css';

function ContactDetails({ contact, onClose }) {
    const [activeTab, setActiveTab] = useState('General');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Resizing state
    const [size, setSize] = useState({ width: 580, height: 520 });
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
                const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
                const newHeight = Math.max(350, resizeStart.height + (e.clientY - resizeStart.y));
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

    const handleMouseDown = (e) => {
        if (e.target.closest('.contact-details-titlebar') && !e.target.closest('.titlebar-btn')) {
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

    const tabs = ['General', 'Organization', 'Phone/Notes', 'Member Of', 'E-mail Addresses'];

    return (
        <div className="contact-details-overlay">
            <div
                ref={windowRef}
                className="contact-details-window"
                style={{
                    left: position.x || '50%',
                    top: position.y || '50%',
                    width: size.width,
                    height: size.height,
                    transform: position.x ? 'none' : 'translate(-50%, -50%)'
                }}
                onMouseDown={handleMouseDown}
            >
                {/* Title Bar - Windows 11 Style */}
                <div className="contact-details-titlebar">
                    <div className="titlebar-left">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#0078d4">
                            <rect x="1" y="1" width="14" height="14" rx="2" fill="#0078d4" />
                            <circle cx="8" cy="6" r="2.5" fill="white" />
                            <path d="M4 14C4 11 5.5 9 8 9C10.5 9 12 11 12 14" fill="white" />
                        </svg>
                        <span className="titlebar-text">{contact.displayName}</span>
                    </div>
                    <div className="titlebar-controls">
                        <button className="titlebar-btn" title="Minimize">─</button>
                        <button className="titlebar-btn" title="Maximize">☐</button>
                        <button className="titlebar-btn close" onClick={onClose} title="Close">✕</button>
                    </div>
                </div>

                {/* Contact Header */}
                <div className="contact-header">
                    <h1 className="contact-name">{contact.displayName}</h1>
                    <p className="contact-title">{contact.title}</p>
                </div>

                {/* Tabs - Windows Style */}
                <div className="contact-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`contact-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="contact-content">
                    {activeTab === 'General' && (
                        <GeneralTab contact={contact} />
                    )}
                    {activeTab === 'Organization' && (
                        <OrganizationTab contact={contact} />
                    )}
                    {activeTab === 'Phone/Notes' && (
                        <PhoneNotesTab contact={contact} />
                    )}
                    {activeTab === 'Member Of' && (
                        <MemberOfTab contact={contact} />
                    )}
                    {activeTab === 'E-mail Addresses' && (
                        <EmailAddressesTab contact={contact} />
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="contact-footer">
                    <div className="footer-left">
                        <button className="footer-btn">Add to Contacts</button>
                        <button className="footer-btn">Actions</button>
                    </div>
                    <div className="footer-right">
                        <button className="footer-btn primary" onClick={onClose}>OK</button>
                        <button className="footer-btn" onClick={onClose}>Cancel</button>
                        <button className="footer-btn disabled" disabled>Apply</button>
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    className="resize-handle"
                    onMouseDown={handleResizeMouseDown}
                />
            </div>
        </div>
    );
}

function GeneralTab({ contact }) {
    return (
        <div className="tab-content general-tab">
            <fieldset className="form-section">
                <legend>Name</legend>
                <div className="form-grid">
                    <div className="form-row">
                        <label>First:</label>
                        <input type="text" value={contact.firstName} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Initials:</label>
                        <input type="text" value={contact.initials || ''} readOnly className="small" />
                    </div>
                    <div className="form-row">
                        <label>Last:</label>
                        <input type="text" value={contact.lastName} readOnly />
                    </div>
                    <div className="form-row full-width">
                        <label>Display:</label>
                        <input type="text" value={contact.displayName} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Alias:</label>
                        <input type="text" value={contact.alias || ''} readOnly />
                    </div>
                </div>
            </fieldset>

            <div className="form-two-columns">
                <div className="form-column">
                    <div className="form-row">
                        <label>Address:</label>
                        <textarea value={contact.address || ''} readOnly rows="3" />
                    </div>
                    <div className="form-row">
                        <label>City:</label>
                        <input type="text" value={contact.city || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>State:</label>
                        <input type="text" value={contact.state || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Zip code:</label>
                        <input type="text" value={contact.zipCode || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Country/Region:</label>
                        <input type="text" value={contact.country || ''} readOnly />
                    </div>
                </div>
                <div className="form-column">
                    <div className="form-row">
                        <label>Title:</label>
                        <input type="text" value={contact.title || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Company:</label>
                        <input type="text" value={contact.company || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Department:</label>
                        <input type="text" value={contact.department || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Office:</label>
                        <input type="text" value={contact.office || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Assistant:</label>
                        <input type="text" value={contact.assistant || ''} readOnly />
                    </div>
                    <div className="form-row">
                        <label>Phone:</label>
                        <input type="text" value={contact.phone || ''} readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrganizationTab({ contact }) {
    return (
        <div className="tab-content organization-tab">
            <div className="form-row">
                <label>Manager:</label>
                <input type="text" value="" readOnly />
            </div>
            <div className="form-row">
                <label>Direct Reports:</label>
            </div>
            <div className="list-box">
                <p className="placeholder-text">No direct reports</p>
            </div>
        </div>
    );
}

function PhoneNotesTab({ contact }) {
    return (
        <div className="tab-content phone-tab">
            <fieldset className="form-section">
                <legend>Phone numbers</legend>
                <div className="form-row">
                    <label>Business:</label>
                    <input type="text" value={contact.businessPhone || ''} readOnly />
                </div>
                <div className="form-row">
                    <label>Business 2:</label>
                    <input type="text" value="" readOnly />
                </div>
                <div className="form-row">
                    <label>Fax:</label>
                    <input type="text" value="" readOnly />
                </div>
                <div className="form-row">
                    <label>Mobile:</label>
                    <input type="text" value="" readOnly />
                </div>
                <div className="form-row">
                    <label>Home:</label>
                    <input type="text" value="" readOnly />
                </div>
                <div className="form-row">
                    <label>Pager:</label>
                    <input type="text" value="" readOnly />
                </div>
            </fieldset>
            <fieldset className="form-section">
                <legend>Notes</legend>
                <textarea className="notes-textarea" readOnly value={contact.notes || ''}></textarea>
            </fieldset>
        </div>
    );
}

function MemberOfTab({ contact }) {
    return (
        <div className="tab-content member-tab">
            <div className="form-row">
                <label>Group membership:</label>
            </div>
            <div className="list-box large">
                <p className="placeholder-text">No group memberships</p>
            </div>
        </div>
    );
}

function EmailAddressesTab({ contact }) {
    return (
        <div className="tab-content email-tab">
            <div className="form-row">
                <label>E-mail addresses:</label>
            </div>
            <div className="list-box large">
                <div className="email-item">
                    <span className="email-type">SMTP:</span>
                    <span className="email-address">{contact.email}</span>
                </div>
            </div>
        </div>
    );
}

export default ContactDetails;
