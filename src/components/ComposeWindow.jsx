import React, { useState, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import './ComposeWindow.css';

// Color picker colors matching Outlook
const THEME_COLORS = [
    ['#FFFFFF', '#1E1E1E', '#E7E6E6', '#44546A', '#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'],
    ['#F2F2F2', '#7F7F7F', '#D0CECE', '#D6DCE4', '#D9E2F3', '#FCE4D6', '#EDEDED', '#FFF2CC', '#DEEBF6', '#E2EFD9'],
    ['#D8D8D8', '#595959', '#AEABAB', '#ADB9CA', '#B4C6E7', '#F8CBAD', '#DBDBDB', '#FFE699', '#BDD7EE', '#C5E0B3'],
    ['#BFBFBF', '#3F3F3F', '#757070', '#8496B0', '#8EAADB', '#F4B183', '#C9C9C9', '#FFD966', '#9CC3E5', '#A8D08D'],
    ['#A5A5A5', '#262626', '#3A3838', '#323F4F', '#2F5496', '#C55A11', '#7B7B7B', '#BF9000', '#2E75B5', '#538135'],
    ['#7F7F7F', '#0C0C0C', '#171616', '#222A35', '#1F3864', '#833C0B', '#525252', '#7F6000', '#1E4E79', '#375623']
];

const STANDARD_COLORS = ['#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0'];

const HIGHLIGHT_COLORS = [
    ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF'],
    ['#FF0000', '#000080', '#008080', '#008000', '#800080'],
    ['#800000', '#808000', '#808080', '#C0C0C0', '#000000']
];

function ColorPicker({ colors, onSelect, onClose, title, showNoColor = false, showStopHighlight = false }) {
    return (
        <div className="cw-color-picker" onClick={e => e.stopPropagation()}>
            <div className="cw-color-picker-header">
                <span>High-contrast only</span>
                <div className="cw-toggle-off">Off</div>
            </div>
            {title === 'font' && (
                <>
                    <div className="cw-color-option">
                        <div className="cw-color-auto"></div>
                        <span>Automatic</span>
                    </div>
                    <div className="cw-color-section-title">Theme Colors</div>
                    <div className="cw-color-grid cw-theme-grid">
                        {THEME_COLORS.map((row, i) => (
                            <div key={i} className="cw-color-row">
                                {row.map((color, j) => (
                                    <button
                                        key={j}
                                        className="cw-color-swatch"
                                        style={{ background: color }}
                                        onClick={() => onSelect(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="cw-color-section-title">Standard Colors</div>
                    <div className="cw-color-row cw-standard-row">
                        {STANDARD_COLORS.map((color, i) => (
                            <button
                                key={i}
                                className="cw-color-swatch"
                                style={{ background: color }}
                                onClick={() => onSelect(color)}
                                title={color}
                            />
                        ))}
                    </div>
                </>
            )}
            {title === 'highlight' && (
                <>
                    <div className="cw-color-grid cw-highlight-grid">
                        {HIGHLIGHT_COLORS.map((row, i) => (
                            <div key={i} className="cw-color-row">
                                {row.map((color, j) => (
                                    <button
                                        key={j}
                                        className="cw-color-swatch cw-highlight-swatch"
                                        style={{ background: color }}
                                        onClick={() => onSelect(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="cw-color-option" onClick={() => onSelect('transparent')}>
                        <div className="cw-no-color-box"></div>
                        <span>No Color</span>
                    </div>
                    <div className="cw-color-option cw-stop-highlight" onClick={() => onSelect(null)}>
                        <span>Stop Highlighting</span>
                    </div>
                </>
            )}
            <div className="cw-more-colors">
                <span className="cw-more-colors-icon">🎨</span>
                <span>More Colors...</span>
            </div>
        </div>
    );
}

function ComposeWindow({ onClose, replyTo = null }) {
    const { settings } = useTheme();
    const [activeTab, setActiveTab] = useState('Message');
    const [to, setTo] = useState(replyTo?.from || '');
    const [cc, setCc] = useState('');
    const [subject, setSubject] = useState(replyTo ? `RE: ${replyTo.subject}` : '');
    const [highlightColor, setHighlightColor] = useState('#FFFF00');
    const [fontColor, setFontColor] = useState('#FF0000');
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showFontColorPicker, setShowFontColorPicker] = useState(false);
    const editorRef = useRef(null);

    const tabs = ['File', 'Message', 'Insert', 'Options', 'Format Text', 'Review', 'Help'];

    const handleSend = () => {
        alert('Message would be sent!');
        onClose?.();
    };

    const handleFormat = (cmd) => {
        document.execCommand(cmd, false, null);
        editorRef.current?.focus();
    };

    const handleHighlightColor = (color) => {
        if (color) {
            setHighlightColor(color);
            document.execCommand('hiliteColor', false, color);
        }
        setShowHighlightPicker(false);
        editorRef.current?.focus();
    };

    const handleFontColor = (color) => {
        setFontColor(color);
        document.execCommand('foreColor', false, color);
        setShowFontColorPicker(false);
        editorRef.current?.focus();
    };

    // Close pickers when clicking outside
    const handleContainerClick = () => {
        setShowHighlightPicker(false);
        setShowFontColorPicker(false);
    };

    return (
        <div className="cw-container" onClick={handleContainerClick}>
            {/* Tab Bar */}
            <div className="cw-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`cw-tab ${activeTab === tab ? 'cw-tab-active' : ''} ${tab === 'File' ? 'cw-tab-file' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Ribbon - Single horizontal toolbar like real Outlook */}
            <div className="cw-ribbon">
                {activeTab === 'Message' && (
                    <div className="cw-toolbar">
                        {/* Paste with dropdown */}
                        <button className="cw-tool-btn cw-has-dropdown">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="9" y="3" width="10" height="14" rx="1" />
                                <path d="M5 7v12a1 1 0 001 1h10" />
                            </svg>
                            <span className="cw-dropdown-arrow">▾</span>
                        </button>

                        {/* Scissors */}
                        <button className="cw-tool-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="6" cy="6" r="3" />
                                <circle cx="6" cy="18" r="3" />
                                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                                <line x1="8.12" y1="8.12" x2="12" y2="12" />
                            </svg>
                        </button>

                        <div className="cw-separator"></div>

                        {/* Font dropdown */}
                        <select className="cw-font-dropdown">
                            <option value="">Aptos</option>
                            <option value="Arial">Arial</option>
                            <option value="Calibri">Calibri</option>
                        </select>

                        {/* Font size */}
                        <select className="cw-fontsize-dropdown">
                            <option>12</option>
                            <option>10</option>
                            <option>11</option>
                            <option>14</option>
                            <option>16</option>
                            <option>18</option>
                        </select>

                        <div className="cw-separator"></div>

                        {/* Bold */}
                        <button className="cw-tool-btn cw-format" onClick={() => handleFormat('bold')}>
                            <b>B</b>
                        </button>

                        {/* Italic */}
                        <button className="cw-tool-btn cw-format" onClick={() => handleFormat('italic')}>
                            <i>I</i>
                        </button>

                        {/* Underline */}
                        <button className="cw-tool-btn cw-format" onClick={() => handleFormat('underline')}>
                            <u>U</u>
                        </button>

                        {/* Highlighter with color picker */}
                        <div className="cw-color-btn-wrap" onClick={e => e.stopPropagation()}>
                            <button
                                className="cw-tool-btn cw-has-dropdown cw-highlighter"
                                onClick={() => {
                                    setShowHighlightPicker(!showHighlightPicker);
                                    setShowFontColorPicker(false);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
                                    <g transform="rotate(-45 32 28)">
                                        <rect x="26" y="10" width="12" height="32" rx="6" fill="none" stroke="#E0E0E0" strokeWidth="3" />
                                        <path d="M 27 44 L 37 44 L 34 50 L 30 50 Z" fill="#E0E0E0" />
                                    </g>
                                </svg>
                                <span className="cw-color-bar" style={{ background: highlightColor }}></span>
                                <span className="cw-dropdown-arrow">▾</span>
                            </button>
                            {showHighlightPicker && (
                                <ColorPicker
                                    colors={HIGHLIGHT_COLORS}
                                    onSelect={handleHighlightColor}
                                    onClose={() => setShowHighlightPicker(false)}
                                    title="highlight"
                                    showNoColor
                                    showStopHighlight
                                />
                            )}
                        </div>

                        {/* Font Color A with color picker */}
                        <div className="cw-color-btn-wrap" onClick={e => e.stopPropagation()}>
                            <button
                                className="cw-tool-btn cw-has-dropdown cw-font-color"
                                onClick={() => {
                                    setShowFontColorPicker(!showFontColorPicker);
                                    setShowHighlightPicker(false);
                                }}
                            >
                                <span className="cw-a-letter">A</span>
                                <span className="cw-color-bar" style={{ background: fontColor }}></span>
                                <span className="cw-dropdown-arrow">▾</span>
                            </button>
                            {showFontColorPicker && (
                                <ColorPicker
                                    colors={THEME_COLORS}
                                    onSelect={handleFontColor}
                                    onClose={() => setShowFontColorPicker(false)}
                                    title="font"
                                />
                            )}
                        </div>

                        {/* More formatting */}
                        <button className="cw-tool-btn">⋯</button>

                        <div className="cw-separator"></div>

                        {/* Attach */}
                        <button className="cw-tool-btn cw-has-dropdown">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                            </svg>
                            <span className="cw-dropdown-arrow">▾</span>
                        </button>

                        {/* Signature */}
                        <button className="cw-tool-btn cw-has-dropdown">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="2">
                                <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h6" />
                                <path d="M12 15l9-9" />
                                <path d="M15 3l6 6" />
                            </svg>
                            <span className="cw-dropdown-arrow">▾</span>
                        </button>

                        <div className="cw-separator"></div>

                        {/* Link */}
                        <button className="cw-tool-btn cw-has-dropdown">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                            </svg>
                            <span className="cw-dropdown-arrow">▾</span>
                        </button>

                        <div className="cw-separator"></div>

                        {/* Check */}
                        <button className="cw-tool-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </button>

                        <div className="cw-separator"></div>

                        {/* Flag/Priority */}
                        <button className="cw-tool-btn cw-has-dropdown">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" y1="22" x2="4" y2="15" />
                            </svg>
                            <span className="cw-dropdown-arrow">▾</span>
                        </button>

                        <div className="cw-separator"></div>

                        {/* View Templates button */}
                        <button className="cw-templates-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                            <span>View Templates</span>
                        </button>

                        <button className="cw-tool-btn">⋯</button>
                    </div>
                )}

                {activeTab === 'Insert' && (
                    <div className="cw-toolbar">
                        <button className="cw-tool-btn cw-has-dropdown">📎 Attach<span className="cw-dropdown-arrow">▾</span></button>
                        <button className="cw-tool-btn">📊 Poll</button>
                        <button className="cw-tool-btn cw-has-dropdown">✍ Signature<span className="cw-dropdown-arrow">▾</span></button>
                        <div className="cw-separator"></div>
                        <button className="cw-tool-btn">▦ Table</button>
                        <button className="cw-tool-btn">🖼 Pictures</button>
                        <button className="cw-tool-btn">🔗 Link</button>
                        <button className="cw-tool-btn">Ω Symbol</button>
                    </div>
                )}

                {activeTab === 'Options' && (
                    <div className="cw-toolbar">
                        <button className="cw-tool-btn">🎨 Themes</button>
                        <button className="cw-tool-btn">🎨 Colors</button>
                        <button className="cw-tool-btn">A Fonts</button>
                    </div>
                )}

                {(activeTab === 'File' || activeTab === 'Format Text' || activeTab === 'Review' || activeTab === 'Help') && (
                    <div className="cw-toolbar">
                        <span className="cw-placeholder">{activeTab} options...</span>
                    </div>
                )}
            </div>

            {/* Quick Access Toolbar */}
            <div className="cw-qat">
                <button className="cw-qat-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0078d4" stroke="#0078d4" strokeWidth="1">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                    </svg>
                    <span>Save</span>
                </button>
                <button className="cw-qat-btn">
                    <span>↩</span> <span>Undo</span>
                </button>
                <button className="cw-qat-btn">
                    <span>↪</span> <span>Redo</span>
                </button>
                <div className="cw-qat-sep"></div>
                <button className="cw-qat-btn">
                    <span>↑</span> <span>Previous Item</span>
                </button>
                <button className="cw-qat-btn">
                    <span>↓</span> <span>Next Item</span>
                </button>
                <button className="cw-qat-btn cw-qat-dropdown">▼</button>
            </div>

            {/* Address Section - Exact match to reference */}
            <div className="cw-address">
                <div className="cw-outlook-controls">
                    <button className="cw-send-btn" onClick={handleSend} title="Send (Alt+S)">
                        <svg className="cw-send-icon" viewBox="0 0 24 24">
                            <path d="M22 12L2 21L5 12L2 3L22 12Z" fill="none" stroke="#e0e0e0" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M5 12L22 12" fill="none" stroke="#e0e0e0" strokeWidth="1.5" />
                        </svg>
                        <span><u>S</u>end</span>
                    </button>
                    <div className="cw-recipient-col">
                        <div className="cw-addr-line">
                            <button className="cw-field-btn" title="From (Alt+M)">
                                <div className="cw-btn-content">
                                    <span>Fro<u>m</u></span>
                                    <svg className="cw-chevron-icon" viewBox="0 0 12 12">
                                        <path d="M2 4L6 8L10 4" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <input className="cw-addr-input cw-email" value={settings?.email || 'alex.johnson@contoso.com'} readOnly />
                        </div>
                        <div className="cw-addr-line">
                            <button className="cw-field-btn" title="To (Alt+T)">
                                <span>T<u>o</u></span>
                            </button>
                            <input className="cw-addr-input" value={to} onChange={e => setTo(e.target.value)} placeholder="" />
                        </div>
                        <div className="cw-addr-line">
                            <button className="cw-field-btn" title="Cc (Alt+C)">
                                <span><u>C</u>c</span>
                            </button>
                            <input className="cw-addr-input" value={cc} onChange={e => setCc(e.target.value)} placeholder="" />
                        </div>
                    </div>
                </div>

                <div className="cw-subj-row">
                    <span className="cw-subj-label"><u>S</u>ubject</span>
                    <input className="cw-subj-input" value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
            </div>

            {/* Editor */}
            <div className="cw-editor-wrap">
                <div
                    ref={editorRef}
                    className="cw-editor"
                    contentEditable
                    suppressContentEditableWarning
                />
            </div>
        </div>
    );
}

export default ComposeWindow;

