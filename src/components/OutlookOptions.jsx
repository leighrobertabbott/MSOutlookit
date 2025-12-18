import React, { useState, useRef, useEffect } from 'react';
import './OutlookOptions.css';

function OutlookOptions({ onClose, settings, onSaveSettings }) {
    const [activeCategory, setActiveCategory] = useState('General');
    const [localSettings, setLocalSettings] = useState(settings || {
        userName: 'Alex Johnson',
        initials: 'AJ',
        email: 'alex.johnson@contoso.com',
        domain: 'contoso.com',
        officeBackground: 'No Background',
        officeTheme: 'Black',
        storeCloudSettings: true,
        optimizeAppearance: true,
        showMiniToolbar: true,
        enableLivePreview: true,
        screenTipStyle: 'Show feature descriptions in ScreenTips',
        startupOption: 'Ask me if I want to reopen previous items',
        attachmentOption: 'ask',
        neverChangeBackground: false,
        alwaysUseValues: false
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
        if (e.target.closest('.options-titlebar') && !e.target.closest('.titlebar-btn')) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleSave = () => {
        if (onSaveSettings) {
            onSaveSettings(localSettings);
        }
        onClose();
    };

    const updateSetting = (key, value) => {
        setLocalSettings({ ...localSettings, [key]: value });
    };

    const categories = [
        'General', 'Mail', 'Calendar', 'Groups', 'People', 'Tasks',
        'Search', 'Language', 'Accessibility', 'Advanced',
        'Customize Ribbon', 'Quick Access Toolbar', 'Add-ins', 'Trust Center'
    ];

    return (
        <div className="options-overlay">
            <div
                ref={windowRef}
                className="options-window"
                style={{
                    left: position.x || '50%',
                    top: position.y || '50%',
                    transform: position.x ? 'none' : 'translate(-50%, -50%)'
                }}
                onMouseDown={handleTitleBarMouseDown}
            >
                {/* Title Bar */}
                <div className="options-titlebar">
                    <span className="titlebar-text">Outlook Options</span>
                    <div className="titlebar-controls">
                        <button className="titlebar-btn help" title="Help">?</button>
                        <button className="titlebar-btn close" onClick={onClose} title="Close">✕</button>
                    </div>
                </div>

                <div className="options-body">
                    {/* Left Sidebar */}
                    <div className="options-sidebar">
                        {categories.map(cat => (
                            <div
                                key={cat}
                                className={`options-category ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </div>
                        ))}
                    </div>

                    {/* Right Content */}
                    <div className="options-content">
                        {activeCategory === 'General' && (
                            <GeneralOptions settings={localSettings} updateSetting={updateSetting} />
                        )}
                        {activeCategory === 'Mail' && <MailOptions />}
                        {activeCategory === 'Calendar' && <PlaceholderOptions title="Calendar" />}
                        {activeCategory === 'Groups' && <PlaceholderOptions title="Groups" />}
                        {activeCategory === 'People' && <PlaceholderOptions title="People" />}
                        {activeCategory === 'Tasks' && <PlaceholderOptions title="Tasks" />}
                        {activeCategory === 'Search' && <PlaceholderOptions title="Search" />}
                        {activeCategory === 'Language' && <PlaceholderOptions title="Language" />}
                        {activeCategory === 'Accessibility' && <PlaceholderOptions title="Accessibility" />}
                        {activeCategory === 'Advanced' && <PlaceholderOptions title="Advanced" />}
                        {activeCategory === 'Customize Ribbon' && <PlaceholderOptions title="Customize Ribbon" />}
                        {activeCategory === 'Quick Access Toolbar' && <PlaceholderOptions title="Quick Access Toolbar" />}
                        {activeCategory === 'Add-ins' && <PlaceholderOptions title="Add-ins" />}
                        {activeCategory === 'Trust Center' && <PlaceholderOptions title="Trust Center" />}
                    </div>
                </div>

                {/* Footer */}
                <div className="options-footer">
                    <button className="options-btn primary" onClick={handleSave}>OK</button>
                    <button className="options-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

function GeneralOptions({ settings, updateSetting }) {
    return (
        <div className="options-panel">
            <div className="options-header">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="#0078d4">
                    <rect x="4" y="4" width="24" height="24" rx="2" fill="#0078d4" />
                    <rect x="8" y="8" width="7" height="7" fill="white" />
                    <rect x="17" y="8" width="7" height="7" fill="white" />
                    <rect x="8" y="17" width="7" height="7" fill="white" />
                    <rect x="17" y="17" width="7" height="7" fill="white" />
                </svg>
                <span>General options for working with Outlook.</span>
            </div>

            {/* Cloud storage options */}
            <div className="options-section">
                <h3>Cloud storage options</h3>
                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={settings.storeCloudSettings}
                        onChange={(e) => updateSetting('storeCloudSettings', e.target.checked)}
                    />
                    <span>Store my Outlook settings in the cloud (requires restarting Outlook)</span>
                    <span className="info-icon">ⓘ</span>
                </label>
            </div>

            {/* User Interface options */}
            <div className="options-section">
                <h3>User Interface options</h3>
                <div className="option-group">
                    <span className="option-label">When using multiple displays: <span className="info-icon">ⓘ</span></span>
                    <label className="radio-row">
                        <input
                            type="radio"
                            name="display"
                            checked={settings.optimizeAppearance}
                            onChange={() => updateSetting('optimizeAppearance', true)}
                        />
                        <span>Optimize for best appearance</span>
                    </label>
                    <label className="radio-row">
                        <input
                            type="radio"
                            name="display"
                            checked={!settings.optimizeAppearance}
                            onChange={() => updateSetting('optimizeAppearance', false)}
                        />
                        <span>Optimize for compatibility (application restart required)</span>
                    </label>
                </div>
                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={settings.showMiniToolbar}
                        onChange={(e) => updateSetting('showMiniToolbar', e.target.checked)}
                    />
                    <span>Show Mini Toolbar on selection</span>
                    <span className="info-icon">ⓘ</span>
                </label>
                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={settings.enableLivePreview}
                        onChange={(e) => updateSetting('enableLivePreview', e.target.checked)}
                    />
                    <span>Enable Live Preview</span>
                    <span className="info-icon">ⓘ</span>
                </label>
                <div className="form-row inline">
                    <label>ScreenTip style:</label>
                    <select
                        value={settings.screenTipStyle}
                        onChange={(e) => updateSetting('screenTipStyle', e.target.value)}
                    >
                        <option>Show feature descriptions in ScreenTips</option>
                        <option>Don't show feature descriptions in ScreenTips</option>
                        <option>Don't show ScreenTips</option>
                    </select>
                </div>
            </div>

            {/* Personalize your copy of Microsoft Office */}
            <div className="options-section">
                <h3>Personalize your copy of Microsoft Office</h3>
                <div className="form-row">
                    <label>User name:</label>
                    <input
                        type="text"
                        value={settings.userName}
                        onChange={(e) => updateSetting('userName', e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <label>Initials:</label>
                    <input
                        type="text"
                        value={settings.initials}
                        onChange={(e) => updateSetting('initials', e.target.value)}
                        className="small"
                    />
                </div>
                <div className="form-row">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={settings.email}
                        onChange={(e) => updateSetting('email', e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <label>Domain:</label>
                    <input
                        type="text"
                        value={settings.domain}
                        onChange={(e) => updateSetting('domain', e.target.value)}
                    />
                </div>
                <label className="checkbox-row indent">
                    <input
                        type="checkbox"
                        checked={settings.alwaysUseValues}
                        onChange={(e) => updateSetting('alwaysUseValues', e.target.checked)}
                    />
                    <span>Always use these values regardless of sign in to Office.</span>
                </label>
                <div className="form-row">
                    <label>Office Background:</label>
                    <select
                        value={settings.officeBackground}
                        onChange={(e) => updateSetting('officeBackground', e.target.value)}
                    >
                        <option>No Background</option>
                        <option>Calligraphy</option>
                        <option>Circles and Stripes</option>
                        <option>Circuit</option>
                        <option>Geometry</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Office Theme:</label>
                    <select
                        value={settings.officeTheme}
                        onChange={(e) => updateSetting('officeTheme', e.target.value)}
                    >
                        <option>Black</option>
                        <option>Dark Gray</option>
                        <option>Colorful</option>
                        <option>White</option>
                    </select>
                    <label className="checkbox-inline">
                        <input
                            type="checkbox"
                            checked={settings.neverChangeBackground}
                            onChange={(e) => updateSetting('neverChangeBackground', e.target.checked)}
                        />
                        <span>Never change the message background color</span>
                    </label>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="options-section">
                <h3>Privacy Settings</h3>
                <button className="options-btn secondary">Privacy Settings...</button>
            </div>

            {/* Start up options */}
            <div className="options-section">
                <h3>Start up options</h3>
                <div className="form-row inline">
                    <label>When Outlook opens:</label>
                    <select
                        value={settings.startupOption}
                        onChange={(e) => updateSetting('startupOption', e.target.value)}
                    >
                        <option>Ask me if I want to reopen previous items</option>
                        <option>Always reopen previous items</option>
                        <option>Never reopen previous items</option>
                    </select>
                </div>
            </div>

            {/* Attachment options */}
            <div className="options-section">
                <h3>Attachment options</h3>
                <span className="option-label">For files I choose from OneDrive or SharePoint:</span>
                <label className="radio-row">
                    <input
                        type="radio"
                        name="attachment"
                        checked={settings.attachmentOption === 'ask'}
                        onChange={() => updateSetting('attachmentOption', 'ask')}
                    />
                    <span>Ask me how I want to attach them every time</span>
                </label>
                <label className="radio-row">
                    <input
                        type="radio"
                        name="attachment"
                        checked={settings.attachmentOption === 'links'}
                        onChange={() => updateSetting('attachmentOption', 'links')}
                    />
                    <span>Always share them as links</span>
                </label>
                <label className="radio-row">
                    <input
                        type="radio"
                        name="attachment"
                        checked={settings.attachmentOption === 'copies'}
                        onChange={() => updateSetting('attachmentOption', 'copies')}
                    />
                    <span>Always attach them as copies</span>
                </label>
            </div>

            {/* LinkedIn Features */}
            <div className="options-section">
                <h3>LinkedIn Features</h3>
                <p className="option-description">
                    Use LinkedIn features in Office to stay connected with your professional network and keep up to date in your industry.
                </p>
            </div>
        </div>
    );
}

function MailOptions() {
    return (
        <div className="options-panel">
            <div className="options-header">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="#0078d4">
                    <rect x="4" y="8" width="24" height="16" rx="2" fill="#0078d4" />
                    <path d="M4 10L16 18L28 10" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                <span>Customize mail settings.</span>
            </div>

            <div className="options-section">
                <h3>Compose messages</h3>
                <label className="checkbox-row">
                    <input type="checkbox" defaultChecked />
                    <span>Check spelling as you type</span>
                </label>
                <label className="checkbox-row">
                    <input type="checkbox" defaultChecked />
                    <span>Always check spelling before sending</span>
                </label>
                <label className="checkbox-row">
                    <input type="checkbox" />
                    <span>Ignore original message text in reply or forward</span>
                </label>
            </div>

            <div className="options-section">
                <h3>Message arrival</h3>
                <label className="checkbox-row">
                    <input type="checkbox" defaultChecked />
                    <span>Play a sound</span>
                </label>
                <label className="checkbox-row">
                    <input type="checkbox" defaultChecked />
                    <span>Show a Desktop Alert</span>
                </label>
                <label className="checkbox-row">
                    <input type="checkbox" defaultChecked />
                    <span>Display a New Mail icon in the taskbar</span>
                </label>
            </div>
        </div>
    );
}

function PlaceholderOptions({ title }) {
    return (
        <div className="options-panel">
            <div className="options-header">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="#0078d4">
                    <rect x="4" y="4" width="24" height="24" rx="2" fill="#0078d4" />
                    <path d="M10 16H22M16 10V22" stroke="white" strokeWidth="2" />
                </svg>
                <span>{title} options</span>
            </div>
            <div className="options-section">
                <p className="placeholder-text">Configure {title.toLowerCase()} settings here.</p>
            </div>
        </div>
    );
}

export default OutlookOptions;
