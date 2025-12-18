import React, { useState } from 'react';
import './EmailList.css';

function EmailList({ posts, selectedPost, onPostSelect, loading, onLoadMore, hasMore }) {
  const [activeTab, setActiveTab] = useState('All');
  const [expandedGroups, setExpandedGroups] = useState({ 'Today': true, 'Yesterday': true, 'Monday': true });

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const groupPostsByDate = (posts) => {
    const groups = { 'Today': [], 'Yesterday': [], 'Monday': [], 'Earlier': [] };
    const now = new Date();

    posts.forEach(post => {
      const date = new Date(post.created * 1000);
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        groups['Today'].push(post);
      } else if (days === 1) {
        groups['Yesterday'].push(post);
      } else if (days < 7) {
        groups['Monday'].push(post);
      } else {
        groups['Earlier'].push(post);
      }
    });

    return groups;
  };

  const groupedPosts = groupPostsByDate(posts);
  const toggleGroup = (groupName) => {
    setExpandedGroups({ ...expandedGroups, [groupName]: !expandedGroups[groupName] });
  };

  return (
    <div className="email-list">
      <div className="email-list-header">
        <div className="email-list-header-tabs">
          <button
            className={`email-list-tab ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => setActiveTab('All')}
          >
            All
          </button>
          <button
            className={`email-list-tab ${activeTab === 'Unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('Unread')}
          >
            Unread
          </button>
        </div>
        <div className="email-list-sort">
          <span>By Date</span>
          <svg className="sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 2L10 6H2L6 2Z" />
            <path d="M6 10L2 6H10L6 10Z" />
          </svg>
        </div>
      </div>
      <div className="email-list-content">
        {loading && posts.length === 0 ? (
          <div className="email-list-loading">Loading...</div>
        ) : (
          <>
            {Object.entries(groupedPosts).map(([groupName, groupPosts]) => (
              groupPosts.length > 0 && (
                <div key={groupName}>
                  <div
                    className="email-group-header"
                    onClick={() => toggleGroup(groupName)}
                  >
                    <span className="email-group-expand">
                      {expandedGroups[groupName] ? '▼' : '▶'}
                    </span>
                    {groupName}
                  </div>
                  {expandedGroups[groupName] && groupPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`email-item ${selectedPost?.id === post.id ? 'selected' : ''} ${!post.read ? 'unread' : ''}`}
                      onClick={() => {
                        post.read = true;
                        onPostSelect(post);
                      }}
                    >
                      <div className="email-item-avatar">
                        {post.from.charAt(0).toUpperCase()}
                      </div>
                      <div className="email-item-content">
                        <div className="email-item-header">
                          <span className="email-item-from">{post.from}</span>
                          <span className="email-item-time">{formatDate(post.created)}</span>
                        </div>
                        <div className="email-item-subject">{post.subject}</div>
                        <div className="email-item-preview">
                          {post.selftext ? post.selftext.substring(0, 100) + '...' : post.url}
                        </div>
                      </div>
                      <div className="email-item-icons">
                        {post.nsfw && <span className="email-icon nsfw" title="NSFW">🔞</span>}
                        {post.pinned && <span className="email-icon" title="Pinned">📌</span>}
                        {post.hasAttachment && <span className="email-icon" title="Attachment">📎</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))}
            {hasMore && (
              <button className="load-more-button" onClick={onLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load more posts'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EmailList;
