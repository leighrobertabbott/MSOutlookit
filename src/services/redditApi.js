/**
 * Modern Reddit API Service using 2025 Reddit API
 * Uses public endpoints that don't require authentication for read-only access
 */

import { fakeContacts } from '../data/fakeContacts';
import { AuthService } from './redditAuth';

const REDDIT_BASE_URL = 'https://www.reddit.com';
const OAUTH_BASE_URL = 'https://oauth.reddit.com';

/**
 * Get the appropriate base URL and headers
 */
function getApiConfig() {
  const token = AuthService.getToken();
  if (token) {
    return {
      baseUrl: OAUTH_BASE_URL,
      headers: {
        'Authorization': `bearer ${token}`
      }
    };
  }
  return {
    baseUrl: REDDIT_BASE_URL,
    headers: {}
  };
}

/**
 * Fetch Reddit posts from a subreddit
 * @param {string} subreddit - Subreddit name (or 'hot' for front page)
 * @param {string} sort - Sort type: 'hot', 'new', 'top', 'rising'
 * @param {string} after - Pagination token
 * @param {number} limit - Number of posts to fetch (max 100)
 * @returns {Promise<Object>} Reddit API response
 */
export async function fetchSubreddit(subreddit = 'hot', sort = 'hot', after = null, limit = 25) {
  try {
    const { baseUrl, headers } = getApiConfig();
    let url;

    // Fix URL construction to avoid double slashes
    if (!subreddit || subreddit === 'hot' || subreddit === 'front') {
      url = `${baseUrl}/hot.json?limit=${limit}`;
    } else {
      url = `${baseUrl}/r/${subreddit}/${sort}.json?limit=${limit}`;
    }

    if (after) {
      url += `&after=${after}`;
    }

    // CORS Proxy for unauthenticated production requests
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isAuth = !!headers.Authorization;

    if (!isLocalhost && !isAuth) {
      url = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      // mode: 'cors', // Default is cors, removing explicit set to be safe with proxy
      credentials: 'omit'
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired/invalid
        AuthService.logout();
        throw new Error('Session expired');
      }
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subreddit:', error);
    throw error;
  }
}

/**
 * Fetch a single post with comments
 * @param {string} postId - Reddit post ID (e.g., 't3_abc123')
 * @param {string} subreddit - Subreddit name
 * @returns {Promise<Array>} Array with [post, comments]
 */
export async function fetchPostComments(postId, subreddit) {
  try {
    const { baseUrl, headers } = getApiConfig();
    // Remove 't3_' prefix if present
    const cleanId = postId.replace('t3_', '');
    const urlInitial = `${baseUrl}/r/${subreddit}/comments/${cleanId}.json`;
    let url = urlInitial;

    // CORS Proxy for unauthenticated production requests
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isAuth = !!headers.Authorization;

    if (!isLocalhost && !isAuth) {
      url = `https://corsproxy.io/?${encodeURIComponent(urlInitial)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      // mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      if (response.status === 401) {
        AuthService.logout();
        throw new Error('Session expired');
      }
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    throw error;
  }
}

/**
 * Search subreddits
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export async function searchSubreddits(query) {
  try {
    const { baseUrl, headers } = getApiConfig();
    const urlInitial = `${baseUrl}/subreddits/search.json?q=${encodeURIComponent(query)}&limit=25`;
    let url = urlInitial;

    // CORS Proxy for unauthenticated production requests
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isAuth = !!headers.Authorization;

    if (!isLocalhost && !isAuth) {
      url = `https://corsproxy.io/?${encodeURIComponent(urlInitial)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      // mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching subreddits:', error);
    throw error;
  }
}

/**
 * Format a post to look like an email
 */
export function formatPostAsEmail(post) {
  // Use fakeContacts instead of hardcoded names
  const randomContact = fakeContacts[Math.floor(Math.random() * fakeContacts.length)];

  // Display name only (no username in parentheses to look more like a real email)
  const senderName = randomContact.displayName;

  const author = post.author || '[deleted]';
  const title = post.title || 'No title';
  const score = post.score || 0;
  const subreddit = post.subreddit || 'unknown';
  const domain = post.domain || 'self.' + subreddit;

  // Decode selftext HTML entities (same as we do for comments)
  let selftext = post.selftext_html || post.selftext || '';
  if (selftext && selftext.includes('&lt;')) {
    selftext = selftext
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#3232;/g, '?')
      .replace(/&amp;/g, '&');
  }

  // Create plain text preview by stripping HTML tags
  let plainTextPreview = selftext || post.url || '';
  // Strip HTML tags
  plainTextPreview = plainTextPreview.replace(/<[^>]*>/g, '');
  // Normalize whitespace
  plainTextPreview = plainTextPreview.replace(/\s+/g, ' ').trim();
  // Decode any remaining HTML entities
  plainTextPreview = plainTextPreview
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');

  return {
    id: post.name,
    from: senderName,              // Clean sender name only
    subject: title,                 // Just the title, no score prefix
    subreddit: subreddit,
    domain: domain,
    score: score,
    author: author,
    url: post.url,
    selftext: selftext,
    plainTextPreview: plainTextPreview, // Clean preview text
    created: post.created_utc,
    numComments: post.num_comments,
    nsfw: post.over_18 || false,
    postData: post
  };
}

/**
 * Decode and process HTML from Reddit
 * Reddit returns HTML that may have encoded entities
 */
function unEncode(text) {
  if (!text || typeof text !== 'string') return '';

  // Create a temporary DOM element to decode HTML entities
  const temp = document.createElement('div');
  temp.innerHTML = text;
  let decoded = temp.textContent || temp.innerText || '';

  // If decoding didn't work (text was already decoded), use the original
  // and manually decode entities
  if (decoded === text || decoded.length === 0) {
    decoded = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#3232;/g, '?');
  } else {
    // If we decoded, we need to restore the HTML structure
    decoded = text;
  }

  // Replace line breaks with <br/>
  decoded = decoded.replace(/\n/g, '<br/>');

  return decoded;
}

/**
 * Format a comment for display
 */
export function formatComment(comment, depth = 0) {
  if (!comment || !comment.data) return null;

  const data = comment.data;
  let body = data.body_html || data.body || '';

  // Reddit's body_html should already be valid HTML
  // If it contains encoded entities (like &lt;div&gt;), decode them
  if (body && body !== '[deleted]' && body !== '[removed]') {
    // Decode HTML entities if present
    if (body.includes('&lt;') || body.includes('&gt;') || body.includes('&quot;') || body.includes('&amp;')) {
      // Simple decode - replace entities with actual characters
      body = body
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#3232;/g, '?')
        // Decode &amp; last to avoid double-decoding
        .replace(/&amp;/g, '&');
    }
  } else if (!body) {
    body = '[deleted]';
  }

  return {
    id: data.name,
    author: data.author || '[deleted]',
    body: body,
    score: data.score || 0,
    created: data.created_utc,
    depth: depth,
    replies: data.replies?.data?.children || []
  };
}
