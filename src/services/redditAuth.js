/**
 * Reddit Authentication Service
 * Handles OAuth2 Implicit Grant Flow
 */

const REDDIT_AUTH_Url = 'https://www.reddit.com/api/v1/authorize';
const REDIRECT_URI = window.location.origin + window.location.pathname; // Dynamically get current path
const SCOPE = 'identity edit flair history modconfig modflair modposts mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread';

export const AuthService = {
    /**
     * Initiate login flow
     * @param {string} clientId - Reddit App Client ID
     */
    login(clientId) {
        if (!clientId) {
            console.error('Client ID is required for login');
            return;
        }

        const state = Math.random().toString(36).substring(7);
        localStorage.setItem('reddit_auth_state', state);

        const params = new URLSearchParams({
            client_id: clientId,
            response_type: 'token',
            state: state,
            redirect_uri: REDIRECT_URI,
            duration: 'temporary',
            scope: SCOPE
        });

        window.location.href = `${REDDIT_AUTH_Url}?${params.toString()}`;
    },

    /**
     * Handle the callback from Reddit (parse hash)
     * @returns {Object|null} Token info or null
     */
    handleCallback() {
        const hash = window.location.hash.substring(1); // Remove leading #
        if (!hash) return null;

        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const state = params.get('state');
        const expiresIn = params.get('expires_in');
        const error = params.get('error');

        // Verify state match to prevent CSRF
        const savedState = localStorage.getItem('reddit_auth_state');
        localStorage.removeItem('reddit_auth_state');

        if (error) {
            console.error('Reddit Auth Error:', error);
            return null;
        }

        if (!accessToken || state !== savedState) {
            return null;
        }

        // Calculate expiration time
        const expiresAt = Date.now() + (parseInt(expiresIn) * 1000);

        const tokenData = {
            accessToken,
            expiresAt
        };

        localStorage.setItem('reddit_token', JSON.stringify(tokenData));

        // Clear hash from URL without reloading
        window.history.replaceState(null, '', window.location.pathname + window.location.search);

        return tokenData;
    },

    /**
     * Get current valid token
     * @returns {string|null} Access token or null if expired/missing
     */
    getToken() {
        try {
            const tokenData = JSON.parse(localStorage.getItem('reddit_token'));
            if (!tokenData) return null;

            if (Date.now() > tokenData.expiresAt) {
                this.logout();
                return null;
            }

            return tokenData.accessToken;
        } catch (e) {
            return null;
        }
    },

    /**
     * Log out user
     */
    logout() {
        localStorage.removeItem('reddit_token');
        window.location.reload();
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.getToken();
    }
};
