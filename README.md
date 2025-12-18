# MSOutlookit 2026 - Modern Edition

A modern Outlook-style Reddit client built with React and the 2025 Reddit API. Browse Reddit posts as if they were emails in Microsoft Outlook!

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Browse Subreddits**: Click on folders in the left sidebar to browse different subreddits
2. **Read Posts**: Click on any post in the email list to read it in the reading pane
3. **Add Subreddits**: Click the "+" button in the sidebar to add a new subreddit
4. **Open Windows**: Click "New Email" to open an Outlook-style compose window
5. **View Comments**: Comments are displayed in a threaded view similar to Outlook's email conversation view
6. **Account Info**: Click "File" tab then "Info" to open the Account Information window

## Features

- **Pixel-Perfect Outlook UI**: Exact recreation of Microsoft Outlook's dark theme interface
- **Functional Windows**: Open multiple Outlook-style windows (compose, account info, etc.)
- **Current Reddit API**: Uses 2025 Reddit API with JSONP fallback for CORS
- **HTML Rendering**: Properly decodes and renders Reddit HTML content
- **Responsive Design**: Modern CSS-based design

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Reddit API**: Public Reddit API endpoints (2025)
- **Modern CSS**: Pixel-perfect Outlook dark theme styling
- **ES6+ JavaScript**: Modern JavaScript features

## Project Structure

```
2026/
├── src/
│   ├── components/      # React components
│   │   ├── OutlookLayout.jsx
│   │   ├── Toolbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── EmailList.jsx
│   │   ├── ReadingPane.jsx
│   │   ├── StatusBar.jsx
│   │   ├── WindowManager.jsx
│   │   ├── OutlookWindow.jsx
│   │   └── AccountInfoWindow.jsx
│   ├── services/
│   │   └── redditApi.js  # Reddit API service
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## API Usage

This application uses Reddit's public API endpoints:
- `/r/{subreddit}/hot.json` - Fetch subreddit posts
- `/r/{subreddit}/comments/{id}.json` - Fetch post comments
- `/subreddits/search.json` - Search for subreddits

Uses JSONP for CORS compatibility.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Acknowledgments

- Original MSOutlookit by Peter Cottle
- Reddit API for providing the data
- Microsoft Outlook for the UI inspiration
