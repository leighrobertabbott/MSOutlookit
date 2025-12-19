import React, { useState, useEffect, useCallback, useRef } from 'react';
import NavRail from './NavRail';
import Sidebar from './Sidebar';
import EmailList from './EmailList';
import ReadingPane from './ReadingPane';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import AddressBook from './AddressBook';
import OutlookOptions from './OutlookOptions';
import CalendarView from './CalendarView';
import ShareToTeams from './ShareToTeams';
import { useTheme } from '../ThemeContext';
import { fetchSubreddit, fetchPostComments, formatPostAsEmail } from '../services/redditApi';
import './OutlookLayout.css';

function OutlookLayout({ onOpenWindow }) {
  const [activeView, setActiveView] = useState('mail'); // 'mail' | 'calendar' | 'people' | 'tasks'
  const [currentSubreddit, setCurrentSubreddit] = useState('hot');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [after, setAfter] = useState(null);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showShareToTeams, setShowShareToTeams] = useState(false);
  const { settings: appSettings, updateSettings: setAppSettings } = useTheme();
  const [folders, setFolders] = useState([
    { id: 'frontpage', name: 'Front Page', subreddit: 'hot' },
    { id: 'popular', name: 'Popular', subreddit: 'popular' },
    { id: 'all', name: 'All', subreddit: 'all' },
    { id: 'gaming', name: 'Gaming', subreddit: 'gaming' },
    { id: 'pics', name: 'Pics', subreddit: 'pics' },
    { id: 'askreddit', name: 'Ask Reddit', subreddit: 'askreddit' },
    { id: 'funny', name: 'Funny', subreddit: 'funny' },
    { id: 'worldnews', name: 'World News', subreddit: 'worldnews' },
  ]);

  // Resizable panel widths
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [emailListWidth, setEmailListWidth] = useState(350);
  const resizingRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (panel, e) => {
    e.preventDefault();
    resizingRef.current = panel;
    startXRef.current = e.clientX;
    startWidthRef.current = panel === 'sidebar' ? sidebarWidth : emailListWidth;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = useCallback((e) => {
    if (!resizingRef.current) return;

    const delta = e.clientX - startXRef.current;
    const newWidth = startWidthRef.current + delta;

    if (resizingRef.current === 'sidebar') {
      setSidebarWidth(Math.max(150, Math.min(400, newWidth)));
    } else if (resizingRef.current === 'emailList') {
      setEmailListWidth(Math.max(250, Math.min(600, newWidth)));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    resizingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const loadSubreddit = useCallback(async (subreddit, append = false) => {
    setLoading(true);
    try {
      const data = await fetchSubreddit(subreddit === 'hot' ? null : subreddit, 'hot', append ? after : null);

      const formattedPosts = data.data.children.map(child => formatPostAsEmail(child.data));

      if (append) {
        setPosts([...posts, ...formattedPosts]);
      } else {
        setPosts(formattedPosts);
        setSelectedPost(null);
        setComments([]);
      }

      setAfter(data.data.after);
    } catch (error) {
      console.error('Error loading subreddit:', error);
      alert(`Error loading folder: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [after, posts]);

  useEffect(() => {
    loadSubreddit(currentSubreddit);
  }, [currentSubreddit]);

  const handleFolderSelect = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setCurrentSubreddit(folder.subreddit);
    }
  };

  const handlePostSelect = async (post) => {
    setSelectedPost(post);
    setLoading(true);
    try {
      const postId = post.postData.name;
      const subreddit = post.postData.subreddit;
      const data = await fetchPostComments(postId, subreddit);

      // data[0] contains the post, data[1] contains comments
      const commentsData = data[1]?.data?.children || [];
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (after && !loading) {
      loadSubreddit(currentSubreddit, true);
    }
  };

  const handleNewSubreddit = () => {
    const subredditName = prompt('Enter folder name:');
    if (subredditName && subredditName.trim()) {
      const cleanName = subredditName.trim().toLowerCase();
      addSubredditFolder(cleanName);
    }
  };

  const addSubredditFolder = (subredditName) => {
    const cleanName = subredditName.trim().toLowerCase().replace(/^r\//, '');

    // Check if folder already exists
    const exists = folders.some(f => f.subreddit === cleanName);
    if (!exists) {
      const newFolder = {
        id: cleanName,
        name: cleanName,
        subreddit: cleanName
      };
      setFolders([...folders, newFolder]);
    }
    setCurrentSubreddit(cleanName);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm && searchTerm.trim()) {
      addSubredditFolder(searchTerm);
    }
  };

  const handleNewWindow = () => {
    onOpenWindow({
      type: 'compose',
      title: 'New Message',
      component: 'ComposeWindow'
    });
  };

  const handleOpenAccountInfo = () => {
    onOpenWindow({
      type: 'account',
      title: 'Account Information - Outlook',
      component: 'AccountInfo',
      size: { width: 900, height: 700 },
      position: { x: 100, y: 100 }
    });
  };

  return (
    <div className="outlook-layout">
      <Toolbar
        onNewMessage={handleNewWindow}
        onOpenAccountInfo={handleOpenAccountInfo}
        onSearch={handleSearch}
        onOpenAddressBook={() => setShowAddressBook(true)}
        onOpenOptions={() => setShowOptions(true)}
        onShareToTeams={() => setShowShareToTeams(true)}
        selectedPost={selectedPost}
      />
      <div className="outlook-content">
        <NavRail activeView={activeView} onViewChange={setActiveView} onOpenOptions={() => setShowOptions(true)} />
        {activeView === 'mail' && (
          <>
            <div className="sidebar-container" style={{ width: sidebarWidth }}>
              <Sidebar
                folders={folders}
                selectedFolder={currentSubreddit}
                onFolderSelect={handleFolderSelect}
                onNewSubreddit={handleNewSubreddit}
              />
              <div
                className="resize-handle"
                onMouseDown={(e) => handleMouseDown('sidebar', e)}
              />
            </div>
            <div className="email-list-container" style={{ width: emailListWidth }}>
              <EmailList
                posts={posts}
                selectedPost={selectedPost}
                onPostSelect={handlePostSelect}
                loading={loading}
                onLoadMore={handleLoadMore}
                hasMore={!!after}
              />
              <div
                className="resize-handle"
                onMouseDown={(e) => handleMouseDown('emailList', e)}
              />
            </div>
            <ReadingPane
              post={selectedPost}
              comments={comments}
              loading={loading}
            />
          </>
        )}
        {activeView === 'calendar' && (
          <CalendarView posts={posts} />
        )}
        {activeView === 'people' && (
          <div className="view-placeholder">
            <div className="placeholder-icon">👥</div>
            <div className="placeholder-text">People view coming soon</div>
          </div>
        )}
        {activeView === 'tasks' && (
          <div className="view-placeholder">
            <div className="placeholder-icon">✓</div>
            <div className="placeholder-text">Tasks view coming soon</div>
          </div>
        )}
      </div>
      <StatusBar postCount={posts.length} />
      {showAddressBook && <AddressBook onClose={() => setShowAddressBook(false)} />}
      {showOptions && (
        <OutlookOptions
          onClose={() => setShowOptions(false)}
          settings={appSettings}
          onSaveSettings={(newSettings) => setAppSettings(newSettings)}
        />
      )}
      {showShareToTeams && (
        <ShareToTeams
          onClose={() => setShowShareToTeams(false)}
          email={selectedPost}
          settings={appSettings}
        />
      )}
    </div>
  );
}

export default OutlookLayout;
