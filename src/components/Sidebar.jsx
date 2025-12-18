import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import './Sidebar.css';

function Sidebar({ folders, selectedFolder, onFolderSelect, onNewSubreddit }) {
  const { settings } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'account': true,
    'frontpage': true,
    'popular': true
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

  // Group folders into categories for Outlook-like hierarchy
  const mainFolders = folders.filter(f => ['frontpage', 'popular', 'all'].includes(f.id));
  const subredditFolders = folders.filter(f => !['frontpage', 'popular', 'all'].includes(f.id));

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="sidebar-collapse-button" onClick={() => setIsCollapsed(true)} title="Collapse">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="sidebar-title">Drag Your Favorite Folders Here</div>
      </div>

      <div className="sidebar-content">
        {/* Account/Inbox Section - Main expandable header */}
        <div className="sidebar-section">
          <div
            className="sidebar-section-header"
            onClick={(e) => toggleSection('account', e)}
          >
            <span className={`section-chevron ${expandedSections['account'] ? 'expanded' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="section-title">{settings?.email || 'alex.johnson@contoso.com'}</span>
          </div>

          {expandedSections['account'] && (
            <div className="sidebar-section-content">
              {/* Main folders */}
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

              {/* Folders Section */}
              {subredditFolders.length > 0 && (
                <div className="sidebar-subsection">
                  <div
                    className="sidebar-subsection-header"
                    onClick={(e) => toggleSection('subreddits', e)}
                  >
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
    </div>
  );
}

export default Sidebar;
