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
        alwaysUseValues: false,
        // Mail settings
        composeFormat: 'HTML',
        showTextPredictions: true,
        alwaysCheckSpelling: false,
        ignoreOriginalText: true,
        playSound: true,
        brieflyChangeMouse: false,
        showEnvelopeIcon: true,
        displayDesktopAlert: true,
        enablePreviewRights: false,
        cleanupSubfolders: false,
        dontMoveUnread: false,
        dontMoveCategorized: true,
        dontMoveFlagged: true,
        dontMoveDigitallySigned: true,
        dontMoveReplyModifies: true,
        showSuggestedReplies: true,
        openRepliesNewWindow: false,
        closeOriginalWhenReplying: false,
        prefaceCommentsEnabled: false,
        prefaceCommentsWith: '',
        whenReplyingOption: 'Include original message text',
        whenForwardingOption: 'Include original message text',
        prefacePlainTextWith: '>',
        autoSaveMinutes: 3,
        saveToFolder: 'Drafts',
        saveReplyInSameFolder: false,
        saveForwardedMessages: true,
        saveCopiesInSentItems: true,
        useUnicodeFormat: true,
        defaultImportance: 'Normal',
        defaultSensitivity: 'Normal',
        markExpiredDays: 0,
        alwaysUseDefaultAccount: false,
        commasSeparateRecipients: false,
        automaticNameChecking: true,
        deleteMeetingRequests: true,
        ctrlEnterSends: true,
        useAutoComplete: true,
        warnMissingAttachment: true,
        suggestNamesOnAt: true,
        useCSSForMessages: true,
        reduceMessageSize: true,
        deliveryReceipt: false,
        readReceipt: false,
        readReceiptOption: 'ask',
        autoProcessMeetings: true,
        autoUpdateSentItem: true,
        updateTrackingDeleteResponses: false,
        moveReceiptToDeleted: false
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
                        {activeCategory === 'Mail' && (
                            <MailOptions settings={localSettings} updateSetting={updateSetting} />
                        )}
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

function MailOptions({ settings, updateSetting }) {
    return (
        <div className="options-panel mail-options">
            {/* Header */}
            <div className="options-header">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="8" width="24" height="16" rx="2" stroke="#808080" strokeWidth="1.5" fill="none" />
                    <path d="M4 10L16 18L28 10" stroke="#808080" strokeWidth="1.5" fill="none" />
                </svg>
                <span>Change the settings for messages you create and receive.</span>
            </div>

            {/* Compose messages */}
            <div className="options-section">
                <h3>Compose messages</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="6" y="4" width="20" height="24" rx="1" stroke="#0078d4" strokeWidth="1.5" fill="none" />
                        <path d="M10 10H22M10 14H22M10 18H18" stroke="#0078d4" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M18 22L22 26L30 16" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="section-content">
                        <span>Change the editing settings for messages.</span>
                        <button className="options-btn secondary">Editor Options...</button>
                    </div>
                </div>
                <div className="form-row inline">
                    <label>Compose messages in this format:</label>
                    <select value={settings.composeFormat} onChange={(e) => updateSetting('composeFormat', e.target.value)}>
                        <option>HTML</option>
                        <option>Rich Text</option>
                        <option>Plain Text</option>
                    </select>
                </div>
                <label className="checkbox-row indent">
                    <input type="checkbox" checked={settings.showTextPredictions} onChange={(e) => updateSetting('showTextPredictions', e.target.checked)} />
                    <span>Show text predictions while typing</span>
                    <span className="info-icon">ⓘ</span>
                </label>
            </div>

            {/* Spelling section */}
            <div className="options-section">
                <div className="section-row with-icon">
                    <span className="abc-icon">abc</span>
                    <div className="section-content">
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.alwaysCheckSpelling} onChange={(e) => updateSetting('alwaysCheckSpelling', e.target.checked)} />
                            <span>Always check spelling before sending</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.ignoreOriginalText} onChange={(e) => updateSetting('ignoreOriginalText', e.target.checked)} />
                            <span>Ignore original message text in reply or forward</span>
                        </label>
                    </div>
                    <button className="options-btn secondary">Spelling and Autocorrect...</button>
                </div>
            </div>

            {/* Signatures */}
            <div className="options-section">
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="6" width="24" height="20" rx="1" stroke="#0078d4" strokeWidth="1.5" fill="none" />
                        <path d="M8 20Q12 14 16 18Q20 22 24 16" stroke="#0078d4" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    <span>Create or modify signatures for messages.</span>
                    <button className="options-btn secondary">Signatures...</button>
                </div>
            </div>

            {/* Stationery */}
            <div className="options-section">
                <div className="section-row with-icon">
                    <span className="stationery-icon">A<sup>a</sup></span>
                    <span>Use stationery to change default fonts and styles, colors, and backgrounds.</span>
                    <button className="options-btn secondary">Stationery and Fonts...</button>
                </div>
            </div>

            {/* Outlook panes */}
            <div className="options-section">
                <h3>Outlook panes</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="6" width="24" height="20" rx="1" fill="#0078d4" />
                        <rect x="6" y="8" width="8" height="16" fill="#ffffff" />
                    </svg>
                    <span>Customize how items are marked as read when using the Reading Pane.</span>
                    <button className="options-btn secondary">Reading Pane...</button>
                </div>
            </div>

            {/* Message arrival */}
            <div className="options-section">
                <h3>Message arrival</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="10" width="20" height="14" rx="1" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M4 12L14 20L24 12" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M24 6V12" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="24" cy="4" r="2" fill="#f5a623" />
                    </svg>
                    <div className="section-content">
                        <span>When new messages arrive:</span>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.playSound} onChange={(e) => updateSetting('playSound', e.target.checked)} />
                            <span>Play a sound</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.brieflyChangeMouse} onChange={(e) => updateSetting('brieflyChangeMouse', e.target.checked)} />
                            <span>Briefly change the mouse pointer</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.showEnvelopeIcon} onChange={(e) => updateSetting('showEnvelopeIcon', e.target.checked)} />
                            <span>Show an envelope icon in the taskbar</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.displayDesktopAlert} onChange={(e) => updateSetting('displayDesktopAlert', e.target.checked)} />
                            <span>Display a Desktop Alert</span>
                        </label>
                        <label className="checkbox-row indent">
                            <input type="checkbox" checked={settings.enablePreviewRights} onChange={(e) => updateSetting('enablePreviewRights', e.target.checked)} />
                            <span>Enable preview for Rights Protected messages (May impact performance)</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Conversation Clean Up */}
            <div className="options-section">
                <h3>Conversation Clean Up</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="8" width="20" height="14" rx="1" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M4 10L14 18L24 10" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M22 18L26 22L22 26" stroke="#c00000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M26 22H18" stroke="#c00000" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div className="section-content">
                        <div className="form-row inline">
                            <label>Cleaned-up items will go to this folder:</label>
                            <input type="text" className="medium" placeholder="" />
                            <button className="options-btn secondary">Browse...</button>
                        </div>
                        <span className="option-note">Messages moved by Clean Up will go to their account's Deleted Items.</span>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.cleanupSubfolders} onChange={(e) => updateSetting('cleanupSubfolders', e.target.checked)} />
                            <span>When cleaning sub-folders, recreate the folder hierarchy in the destination folder</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.dontMoveUnread} onChange={(e) => updateSetting('dontMoveUnread', e.target.checked)} />
                            <span>Don't move unread messages</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.dontMoveCategorized} onChange={(e) => updateSetting('dontMoveCategorized', e.target.checked)} />
                            <span>Don't move categorized messages</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.dontMoveFlagged} onChange={(e) => updateSetting('dontMoveFlagged', e.target.checked)} />
                            <span>Don't move flagged messages</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.dontMoveDigitallySigned} onChange={(e) => updateSetting('dontMoveDigitallySigned', e.target.checked)} />
                            <span>Don't move digitally-signed messages</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.dontMoveReplyModifies} onChange={(e) => updateSetting('dontMoveReplyModifies', e.target.checked)} />
                            <span>When a reply modifies a message, don't move the original</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Replies and forwards */}
            <div className="options-section">
                <h3>Replies and forwards</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="8" y="8" width="18" height="14" rx="1" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M8 10L17 18L26 10" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <circle cx="8" cy="20" r="6" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M6 20L8 18L10 20M8 18V23" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="section-content">
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.showSuggestedReplies} onChange={(e) => updateSetting('showSuggestedReplies', e.target.checked)} />
                            <span>Show suggested replies</span>
                            <span className="info-icon">ⓘ</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.openRepliesNewWindow} onChange={(e) => updateSetting('openRepliesNewWindow', e.target.checked)} />
                            <span>Open replies and forwards in a new window</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.closeOriginalWhenReplying} onChange={(e) => updateSetting('closeOriginalWhenReplying', e.target.checked)} />
                            <span>Close original message window when replying or forwarding</span>
                        </label>
                        <div className="form-row inline">
                            <label className="checkbox-row">
                                <input type="checkbox" checked={settings.prefaceCommentsEnabled} onChange={(e) => updateSetting('prefaceCommentsEnabled', e.target.checked)} />
                                <span>Preface comments with:</span>
                            </label>
                            <input type="text" className="medium" value={settings.prefaceCommentsWith} onChange={(e) => updateSetting('prefaceCommentsWith', e.target.value)} disabled={!settings.prefaceCommentsEnabled} />
                        </div>
                        <div className="form-row inline">
                            <label>When replying to a message:</label>
                            <div className="select-with-icon">
                                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                                    <rect x="1" y="1" width="22" height="14" fill="#0078d4" />
                                    <line x1="3" y1="4" x2="21" y2="4" stroke="white" strokeWidth="1" />
                                    <line x1="3" y1="8" x2="21" y2="8" stroke="white" strokeWidth="1" />
                                    <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1" />
                                </svg>
                                <select value={settings.whenReplyingOption} onChange={(e) => updateSetting('whenReplyingOption', e.target.value)}>
                                    <option>Include original message text</option>
                                    <option>Include and indent original message text</option>
                                    <option>Attach original message</option>
                                    <option>Do not include original message</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row inline">
                            <label>When forwarding a message:</label>
                            <div className="select-with-icon">
                                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                                    <rect x="1" y="1" width="22" height="14" fill="#0078d4" />
                                    <line x1="3" y1="4" x2="21" y2="4" stroke="white" strokeWidth="1" />
                                    <line x1="3" y1="8" x2="21" y2="8" stroke="white" strokeWidth="1" />
                                    <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1" />
                                </svg>
                                <select value={settings.whenForwardingOption} onChange={(e) => updateSetting('whenForwardingOption', e.target.value)}>
                                    <option>Include original message text</option>
                                    <option>Include and indent original message text</option>
                                    <option>Attach original message</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row inline disabled-row">
                            <label>Preface each line in a plain-text message with:</label>
                            <input type="text" className="small" value={settings.prefacePlainTextWith} onChange={(e) => updateSetting('prefacePlainTextWith', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save messages */}
            <div className="options-section">
                <h3>Save messages</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="6" y="4" width="20" height="24" rx="1" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M10 4V10H22V4" stroke="#808080" strokeWidth="1.5" />
                        <rect x="10" y="14" width="12" height="2" fill="#808080" />
                        <rect x="10" y="18" width="8" height="2" fill="#808080" />
                        <path d="M24 20L28 24L24 28" stroke="#0078d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="section-content">
                        <div className="form-row inline">
                            <label className="checkbox-row">
                                <input type="checkbox" defaultChecked />
                                <span>Automatically save items that have not been sent after this many minutes:</span>
                            </label>
                            <input type="number" className="tiny" value={settings.autoSaveMinutes} onChange={(e) => updateSetting('autoSaveMinutes', parseInt(e.target.value))} min="1" max="99" />
                        </div>
                        <div className="form-row inline">
                            <label>Save to this folder:</label>
                            <select value={settings.saveToFolder} onChange={(e) => updateSetting('saveToFolder', e.target.value)}>
                                <option>Drafts</option>
                                <option>Inbox</option>
                                <option>Outbox</option>
                            </select>
                        </div>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.saveReplyInSameFolder} onChange={(e) => updateSetting('saveReplyInSameFolder', e.target.checked)} />
                            <span>When replying to a message that is not in the Inbox, save the reply in the same folder</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.saveForwardedMessages} onChange={(e) => updateSetting('saveForwardedMessages', e.target.checked)} />
                            <span>Save forwarded messages</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.saveCopiesInSentItems} onChange={(e) => updateSetting('saveCopiesInSentItems', e.target.checked)} />
                            <span>Save copies of messages in the Sent Items folder</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.useUnicodeFormat} onChange={(e) => updateSetting('useUnicodeFormat', e.target.checked)} />
                            <span>Use Unicode format</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Send messages */}
            <div className="options-section">
                <h3>Send messages</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M4 16L28 4L20 28L16 18L4 16Z" fill="#0078d4" />
                        <path d="M16 18L28 4" stroke="white" strokeWidth="1.5" />
                    </svg>
                    <div className="section-content">
                        <div className="form-row inline">
                            <label>Default Importance level:</label>
                            <select value={settings.defaultImportance} onChange={(e) => updateSetting('defaultImportance', e.target.value)}>
                                <option>↓ Low</option>
                                <option>Normal</option>
                                <option>↑ High</option>
                            </select>
                        </div>
                        <div className="form-row inline">
                            <label>Default Sensitivity level:</label>
                            <select value={settings.defaultSensitivity} onChange={(e) => updateSetting('defaultSensitivity', e.target.value)}>
                                <option>Normal</option>
                                <option>Personal</option>
                                <option>Private</option>
                                <option>Confidential</option>
                            </select>
                        </div>
                        <label className="checkbox-row">
                            <input type="checkbox" />
                            <span>Mark messages as expired after this many days:</span>
                            <input type="number" className="tiny" value={settings.markExpiredDays} onChange={(e) => updateSetting('markExpiredDays', parseInt(e.target.value))} min="0" disabled />
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.alwaysUseDefaultAccount} onChange={(e) => updateSetting('alwaysUseDefaultAccount', e.target.checked)} />
                            <span>Always use the default account when composing new messages</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.commasSeparateRecipients} onChange={(e) => updateSetting('commasSeparateRecipients', e.target.checked)} />
                            <span>Commas can be used to separate multiple message recipients</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.automaticNameChecking} onChange={(e) => updateSetting('automaticNameChecking', e.target.checked)} />
                            <span>Automatic name checking</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.deleteMeetingRequests} onChange={(e) => updateSetting('deleteMeetingRequests', e.target.checked)} />
                            <span>Delete meeting requests and notifications from Inbox after responding</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.ctrlEnterSends} onChange={(e) => updateSetting('ctrlEnterSends', e.target.checked)} />
                            <span>CTRL + ENTER sends a message</span>
                        </label>
                        <div className="form-row inline">
                            <label className="checkbox-row">
                                <input type="checkbox" checked={settings.useAutoComplete} onChange={(e) => updateSetting('useAutoComplete', e.target.checked)} />
                                <span>Use Auto-Complete List to suggest names when typing in the To, Cc, and Bcc lines</span>
                            </label>
                            <button className="options-btn secondary">Empty Auto-Complete List</button>
                        </div>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.warnMissingAttachment} onChange={(e) => updateSetting('warnMissingAttachment', e.target.checked)} />
                            <span>Warn me when I send a message that may be missing an attachment</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.suggestNamesOnAt} onChange={(e) => updateSetting('suggestNamesOnAt', e.target.checked)} />
                            <span>Suggest names to mention when I use the @ symbol in a message (requires restarting Outlook)</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* MailTips */}
            <div className="options-section">
                <h3>MailTips</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="8" width="24" height="16" rx="2" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M4 10L16 18L28 10" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <circle cx="26" cy="10" r="6" fill="#c00000" />
                        <text x="26" y="13" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">!</text>
                    </svg>
                    <span>Manage MailTips options. For example, you may determine when and how to display the MailTips bar and which MailTips to display.</span>
                    <button className="options-btn secondary">MailTips Options...</button>
                </div>
            </div>

            {/* Tracking */}
            <div className="options-section">
                <h3>Tracking</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="6" y="4" width="20" height="24" rx="1" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <path d="M10 10H22M10 14H22M10 18H18" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M16 22L20 26L28 16" stroke="#00a000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="section-content">
                        <p className="option-description">Delivery and read receipts help provide confirmation that messages were successfully received. Not all email servers and applications support sending receipts.</p>
                        <span>For all messages sent, request:</span>
                        <label className="checkbox-row indent">
                            <input type="checkbox" checked={settings.deliveryReceipt} onChange={(e) => updateSetting('deliveryReceipt', e.target.checked)} />
                            <span>Delivery receipt confirming the message was delivered to the recipient's email server</span>
                        </label>
                        <label className="checkbox-row indent">
                            <input type="checkbox" checked={settings.readReceipt} onChange={(e) => updateSetting('readReceipt', e.target.checked)} />
                            <span>Read receipt confirming the recipient viewed the message</span>
                        </label>
                        <span>For any message received that includes a read receipt request:</span>
                        <label className="radio-row indent">
                            <input type="radio" name="readReceiptOption" checked={settings.readReceiptOption === 'always'} onChange={() => updateSetting('readReceiptOption', 'always')} />
                            <span>Always send a read receipt</span>
                        </label>
                        <label className="radio-row indent">
                            <input type="radio" name="readReceiptOption" checked={settings.readReceiptOption === 'never'} onChange={() => updateSetting('readReceiptOption', 'never')} />
                            <span>Never send a read receipt</span>
                        </label>
                        <label className="radio-row indent">
                            <input type="radio" name="readReceiptOption" checked={settings.readReceiptOption === 'ask'} onChange={() => updateSetting('readReceiptOption', 'ask')} />
                            <span>Ask each time whether to send a read receipt</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.autoProcessMeetings} onChange={(e) => updateSetting('autoProcessMeetings', e.target.checked)} />
                            <span>Automatically process meeting requests and responses to meeting requests and polls</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.autoUpdateSentItem} onChange={(e) => updateSetting('autoUpdateSentItem', e.target.checked)} />
                            <span>Automatically update original sent item with receipt information</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.updateTrackingDeleteResponses} onChange={(e) => updateSetting('updateTrackingDeleteResponses', e.target.checked)} />
                            <span>Update tracking information, and then delete responses that don't contain comments</span>
                        </label>
                        <div className="form-row inline">
                            <label className="checkbox-row">
                                <input type="checkbox" checked={settings.moveReceiptToDeleted} onChange={(e) => updateSetting('moveReceiptToDeleted', e.target.checked)} />
                                <span>After updating tracking information, move receipt to:</span>
                            </label>
                            <input type="text" className="medium" value="Deleted Items" disabled />
                            <button className="options-btn secondary" disabled>Browse...</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message format */}
            <div className="options-section">
                <h3>Message format</h3>
                <div className="section-row with-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="24" height="24" rx="2" stroke="#808080" strokeWidth="1.5" fill="none" />
                        <rect x="8" y="8" width="6" height="4" fill="#0078d4" />
                        <rect x="8" y="14" width="16" height="2" fill="#808080" />
                        <rect x="8" y="18" width="16" height="2" fill="#808080" />
                        <rect x="8" y="22" width="10" height="2" fill="#808080" />
                    </svg>
                    <div className="section-content">
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.useCSSForMessages} onChange={(e) => updateSetting('useCSSForMessages', e.target.checked)} />
                            <span>Use Cascading Style Sheets (CSS) for appearance of messages</span>
                        </label>
                        <label className="checkbox-row">
                            <input type="checkbox" checked={settings.reduceMessageSize} onChange={(e) => updateSetting('reduceMessageSize', e.target.checked)} />
                            <span>Reduce message size by removing format information not necessary to display the message</span>
                        </label>
                    </div>
                </div>
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
