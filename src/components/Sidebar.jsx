import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import './Sidebar.css';

function Sidebar({ folders, selectedFolder, onFolderSelect, onNewSubreddit }) {
  const { settings } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state for stealth mode
  const [expandedSections, setExpandedSections] = useState({
    'account': true,
    'frontpage': true,
    'popular': true,
    // Fake Outlook expanded states
    'fake_account': true,
    'fake_impact': true,
    'fake_butterfly': false,
    'fake_2022': true,
    'fake_inbox_sub': true
  });

  const toggleSection = (sectionId, e) => {
    e.stopPropagation();
    setExpandedSections({ ...expandedSections, [sectionId]: !expandedSections[sectionId] });
  };

  if (isCollapsed) {
    return (
      <div className="sidebar collapsed">
        <button className="sidebar-expand-button" onClick={() => setIsCollapsed(false)} title="Expand">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );
  }

  // Group folders for Real Reddit View
  const mainFolders = folders.filter(f => ['frontpage', 'popular', 'all'].includes(f.id));
  const subredditFolders = folders.filter(f => !['frontpage', 'popular', 'all'].includes(f.id));

  // --- Real Reddit Sidebar (Shown on Hover) ---
  const renderRealSidebar = () => (
    <>
      <div className="sidebar-header">
        <button className="sidebar-collapse-button" onClick={() => setIsCollapsed(true)} title="Collapse">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="sidebar-title">Drag Your Favorite Folders Here</div>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          <div className="sidebar-section-header" onClick={(e) => toggleSection('account', e)}>
            <span className={`section-chevron ${expandedSections['account'] ? 'expanded' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {/* Use settings email or fallback */}
            <span className="section-title">{settings?.email || 'alex.johnson@contoso.com'}</span>
          </div>

          {expandedSections['account'] && (
            <div className="sidebar-section-content">
              {mainFolders.map((folder) => (
                <div
                  key={folder.id}
                  className={`sidebar-item ${selectedFolder === folder.subreddit ? 'selected' : ''}`}
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <span className="item-chevron">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <svg className="sidebar-folder-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 4a1 1 0 011-1h3.5l1 1H13a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" fill="#dcb67a" />
                  </svg>
                  <span className="sidebar-name">{folder.name}</span>
                  {folder.count !== undefined && (
                    <span className="folder-count">{folder.count}</span>
                  )}
                </div>
              ))}

              {subredditFolders.length > 0 && (
                <div className="sidebar-subsection">
                  <div className="sidebar-subsection-header" onClick={(e) => toggleSection('subreddits', e)}>
                    <span className={`subsection-chevron ${expandedSections['subreddits'] !== false ? 'expanded' : ''}`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                        <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="subsection-title">Folders</span>
                  </div>

                  {expandedSections['subreddits'] !== false && (
                    <div className="sidebar-subsection-content">
                      {subredditFolders.map((folder) => (
                        <div
                          key={folder.id}
                          className={`sidebar-item indented ${selectedFolder === folder.subreddit ? 'selected' : ''}`}
                          onClick={() => onFolderSelect(folder.id)}
                        >
                          <span className="item-chevron">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                              <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <svg className="sidebar-folder-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2 4a1 1 0 011-1h3.5l1 1H13a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" fill="#dcb67a" />
                          </svg>
                          <span className="sidebar-name">{folder.name}</span>
                          {folder.count !== undefined && (
                            <span className="folder-count">{folder.count}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-add-button" onClick={onNewSubreddit}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        <span>New Folder</span>
      </div>
    </>
  );

  // --- Fake Outlook Sidebar (Stealth Mode Default) ---
  const renderFakeSidebar = () => {
    // Helper for consistency - No icons, just text and chevron
    const FolderItem = ({ name, count, indent = false, isSelected = false }) => (
      <div className={`sidebar-item fake-item ${indent ? 'indented' : ''} ${isSelected ? 'selected' : ''}`}>
        <span className="item-chevron">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="sidebar-name">{name}</span>
        {count && <span className={`folder-count ${isSelected ? 'selected' : ''}`}>{count}</span>}
      </div>
    );

    return (
      <>
        <div className="sidebar-header">
          {/* No header content in stealth mode often, but let's keep search/drag for now or minimize */}
          <div className="sidebar-title" style={{ paddingLeft: '12px', fontStyle: 'italic', color: '#888' }}>Drag Your Favorite Folders Here</div>
        </div>

        <div className="sidebar-content">
          {/* Main Account */}
          <div className="sidebar-section">
            <div className="sidebar-section-header" onClick={(e) => toggleSection('fake_account', e)}>
              <span className={`section-chevron ${expandedSections['fake_account'] ? 'expanded' : ''}`}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="section-title">{settings?.email || 'alex.johnson@contoso.com'}</span>
            </div>

            {expandedSections['fake_account'] && (
              <div className="sidebar-section-content">
                <FolderItem name="Drafts" count="[40]" />
                <FolderItem name="Sent Items" />
                <FolderItem name="Archive" />
                <div className="sidebar-item fake-item">
                  <span className="item-chevron">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="sidebar-name">Conversation History</span>
                </div>
                <FolderItem name="Deleted Items" count="314" />
                <FolderItem name="Inbox" count="853" isSelected={true} />
                <FolderItem name="Junk Email" count="[11]" />
                <FolderItem name="Outbox" />

                <div className="sidebar-item fake-item">
                  <span className="item-chevron">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="sidebar-name">Search Folders</span>
                </div>
                <div className="sidebar-item fake-item">
                  <span className="item-chevron">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="sidebar-name">Groups</span>
                </div>
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="section-chevron">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="section-title">Sarah Davis</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="section-chevron">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="section-title">James Wilson</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="section-chevron">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="section-title">Maria Garcia</span>
            </div>
          </div>

          {/* Fake Impact Project */}
          <div className="sidebar-section">
            <div className="sidebar-section-header" onClick={(e) => toggleSection('fake_impact', e)}>
              <span className={`section-chevron ${expandedSections['fake_impact'] ? 'expanded' : ''}`}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="section-title">Robert Chen</span>
            </div>
            {expandedSections['fake_impact'] && (
              <div className="sidebar-section-content">
                <FolderItem name="Archive" />
                <div className="sidebar-item fake-item">
                  <span className="item-chevron">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="sidebar-name">Conversation History</span>
                </div>
                <FolderItem name="Deleted Items" />
                <FolderItem name="Drafts" />

                {/* Nested Inbox */}
                <div style={{ marginTop: '0' }}>
                  <div className="sidebar-item fake-item" onClick={(e) => toggleSection('fake_inbox_sub', e)} style={{ paddingLeft: '8px' }}>
                    <span className={`section-chevron ${expandedSections['fake_inbox_sub'] ? 'expanded' : ''}`}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                        <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="sidebar-name">Inbox</span>
                    <span className="folder-count" style={{ color: '#0078d4', fontSize: '11px', fontWeight: '600' }}>11</span>
                  </div>

                  {expandedSections['fake_inbox_sub'] && (
                    <div style={{ paddingLeft: '16px' }}>
                      <div className="sidebar-item fake-item" onClick={(e) => toggleSection('fake_2022', e)}>
                        <span className={`section-chevron ${expandedSections['fake_2022'] ? 'expanded' : ''}`}>
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                            <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="sidebar-name">2022</span>
                      </div>
                      {expandedSections['fake_2022'] && (
                        <div style={{ paddingLeft: '16px' }}>
                          <FolderItem name="18th/19th December" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </>
    );
  };

  return (
    <div
      className="sidebar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? renderRealSidebar() : renderFakeSidebar()}
    </div>
  );
}

export default Sidebar;
