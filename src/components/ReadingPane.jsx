import React from 'react';
import { formatComment } from '../services/redditApi';
import './ReadingPane.css';

function ReadingPane({ post, comments, loading }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const renderComment = (commentData, depth = 0) => {
    if (!commentData || commentData.kind === 'more') return null;

    const comment = formatComment(commentData, depth);
    if (!comment) return null;

    return (
      <div key={comment.id} className={`comment comment-depth-${Math.min(depth, 12)}`}>
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-score">{comment.score} points</span>
          <span className="comment-time">{formatDate(comment.created)}</span>
        </div>
        <div
          className="comment-body"
          dangerouslySetInnerHTML={{ __html: comment.body || '[deleted]' }}
        />
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map((reply, idx) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = (postData) => {
    // If there is selftext, render it
    if (postData.selftext) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: postData.selftext }}
        />
      );
    }

    const rawPost = postData.postData;

    // 1. Reddit Video (v.redd.it)
    if (rawPost?.is_video && rawPost?.media?.reddit_video?.fallback_url) {
      return (
        <div className="media-container">
          <video controls className="post-media" preload="metadata">
            <source src={rawPost.media.reddit_video.fallback_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="media-source"><a href={postData.url} target="_blank" rel="noreferrer">{postData.url}</a></div>
        </div>
      );
    }

    // 2. Rich Video (e.g. YouTube, Gfycat embedded by Reddit)
    if (rawPost?.media?.oembed?.html) {
      return (
        <div className="media-container">
          <div
            className="post-media-embed"
            dangerouslySetInnerHTML={{
              __html: rawPost.media.oembed.html
                .replace('width="', 'width="100%" data-orig-width="')
                .replace('height="', 'height="315" data-orig-height="')
            }}
          />
          <div className="media-source"><a href={postData.url} target="_blank" rel="noreferrer">{postData.url}</a></div>
        </div>
      );
    }

    // 3. YouTube (Manual Fallback if oembed missing)
    if (postData.url.includes('youtube.com/watch') || postData.url.includes('youtu.be')) {
      let videoId = '';
      if (postData.url.includes('youtu.be')) {
        videoId = postData.url.split('/').pop().split('?')[0];
      } else {
        const urlParams = new URLSearchParams(new URL(postData.url).search);
        videoId = urlParams.get('v');
      }

      if (videoId) {
        return (
          <div className="media-container">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="post-media-iframe"
            ></iframe>
            <div className="media-source"><a href={postData.url} target="_blank" rel="noreferrer">{postData.url}</a></div>
          </div>
        );
      }
    }

    // 4. Images (using Reddit Preview or URL detection)
    // Check if it's a direct image link or has a preview
    const isImageDomain = postData.url.match(/\.(jpeg|jpg|gif|png)$/i) || (postData.url.includes('imgur.com') && !postData.url.includes('/a/'));

    // Prefer high-res preview if available, otherwise URL
    let imageUrl = null;
    if (rawPost?.preview?.images?.[0]?.source?.url) {
      imageUrl = rawPost.preview.images[0].source.url.replace(/&amp;/g, '&');
    } else if (isImageDomain) {
      imageUrl = postData.url.replace('.gifv', '.gif');
    }

    if (imageUrl) {
      return (
        <div className="media-container">
          <img src={imageUrl} alt={postData.subject} className="post-media" />
          <div className="media-source"><a href={postData.url} target="_blank" rel="noreferrer">{postData.url}</a></div>
        </div>
      );
    }

    // 5. Fallback for generic links
    return (
      <div className="link-container">
        <a href={postData.url} target="_blank" rel="noopener noreferrer" className="post-link">
          {postData.url}
        </a>
      </div>
    );
  };

  if (loading && !post) {
    return (
      <div className="reading-pane">
        <div className="reading-pane-loading">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="reading-pane">
        <div className="reading-pane-empty">
          <div className="empty-at-symbol">@</div>
          <div className="empty-text">Select an email to read</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reading-pane">
      <div className="reading-pane-header">
        <div className="email-header">
          <div className="email-header-avatar">
            {post.from.charAt(0).toUpperCase()}
          </div>
          <div className="email-header-info">
            <div className="email-header-from">
              <div className="email-header-name">{post.from}</div>
              <div className="email-header-actions">
                <button className="header-button" title="Reply">↩ Reply</button>
                <button className="header-button" title="Reply All">↩↩ Reply All</button>
                <button className="header-button" title="Forward">⇉ Forward</button>
              </div>
            </div>
            <div className="email-header-meta">
              <span>To: You ({post.author})</span>
              <span className="email-header-time">{formatDate(post.created)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="reading-pane-content">
        <div className="email-subject">{post.subject.replace(/^\(RE:\^\d+\)\s*/, '')}</div>
        <div className="email-info-banner">
          If there are problems with how this message is displayed, click here to view it in a web browser. Click here to download pictures. To help protect your privacy, Outlook prevented automatic download of some pictures in this message.
        </div>
        <div className="email-body">
          {renderContent(post)}
        </div>

        {comments.length > 0 && (
          <div className="comments-section">
            <div className="comments-header">
              <div className="comments-title">Comments ({post.numComments || 0})</div>
              <div className="comments-line"></div>
            </div>
            {loading ? (
              <div className="comments-loading">Loading comments...</div>
            ) : (
              <div className="comments-list">
                {comments.map((commentData, idx) => renderComment(commentData, 0))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadingPane;

