# AnyBox Development Guide

Technical documentation for developers working on or customizing AnyBox.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              Browser                                │
├─────────────────────────────────────────────────────┤
│  index.html (Entry Point)                          │
│  ├─ HTML Structure                                 │
│  ├─ Tailwind CDN                                   │
│  ├─ Plyr CDN                                       │
│  └─ Font Awesome Icons                             │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│          JavaScript Modules                        │
├─────────────────────────────────────────────────────┤
│  storage.js          app.js        urlParser.js   │
│  ├─ LocalStorage     ├─ Event      ├─ URL Type    │
│  ├─ History CRUD    │  Handlers   │  Detection   │
│  ├─ Formatting      ├─ Player     └─ URL Format   │
│  └─ Time Calc       │  Control              │
│                     └─ UI Updates           │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│          External Services                         │
├─────────────────────────────────────────────────────┤
│  YouTube  │  Vimeo  │  CDNs  │  Video Servers    │
└─────────────────────────────────────────────────────┘
```

## File Structure

### index.html
- Main HTML structure
- CDN links for external libraries
- DOM elements for player, history, controls
- Header and footer markup

### css/styles.css
- Custom animations (blob, pulse, fadeIn)
- Glassmorphism effects
- Responsive design rules
- Custom scrollbar styling
- Plyr player customizations

### js/storage.js (LocalStorage Manager)
**Key Functions:**
- `getHistory()` - Retrieve all stored videos
- `addToHistory()` - Add new video to history
- `removeFromHistory()` - Delete specific entry
- `clearHistory()` - Remove all entries
- `extractTitleFromURL()` - Parse readable titles
- `formatTime()` - Human-readable timestamps

**Data Structure:**
```javascript
{
  id: 1234567890,
  url: "https://...",
  title: "Video Title",
  type: "youtube",
  timestamp: "2024-01-15T10:30:00Z",
  playedAt: "1/15/2024, 10:30:00 AM"
}
```

### js/urlParser.js (URL Detection)
**Key Functions:**
- `parseURL()` - Main entry point, routes to handlers
- `isYouTube()` / `handleYouTube()` - YouTube detection
- `isVimeo()` / `handleVimeo()` - Vimeo detection
- `isDirectVideo()` / `handleDirectVideo()` - Direct files
- `isHLS()` / `handleHLS()` - Stream detection
- `validateAccess()` - Check URL accessibility

**Return Format:**
```javascript
{
  valid: true/false,
  type: 'youtube|vimeo|direct|hls|etc',
  url: 'processed-url',
  embedUrl: 'for-iframes',
  title: 'detected-title',
  error: 'error-message-if-invalid'
}
```

### js/app.js (Main Application)
**Key Functions:**
- `initApp()` - Initialize event listeners
- `handlePlayClick()` - Process video URL
- `loadEmbeddedVideo()` - Render iframes
- `loadDirectVideo()` - Initialize Plyr player
- `showError()` - Display error messages
- `showSuccess()` - Show success notification
- `loadHistory()` - Render history sidebar
- `escapeHtml()` - XSS prevention

## Customization Guide

### Adding a New Video Platform

Example: Adding support for "CustomPlatform"

1. **Edit js/urlParser.js**

```javascript
// Step 1: Add detection method
isCustomPlatform(url) {
    return /customplatform\.com/.test(url);
}

// Step 2: Add handler method
handleCustomPlatform(url) {
    const videoId = url.split('/video/')[1]?.split('?')[0];
    
    if (videoId) {
        return {
            valid: true,
            type: 'customplatform',
            videoId,
            embedUrl: `https://customplatform.com/embed/${videoId}`,
            title: 'Custom Platform Video',
            url
        };
    }
    
    return {
        valid: false,
        type: 'customplatform',
        error: 'Invalid Custom Platform URL'
    };
}

// Step 3: Add to parseURL main switch
if (this.isCustomPlatform(url)) {
    return this.handleCustomPlatform(url);
}
```

2. **Update index.html**

Add to supported formats list:
```html
<div class="text-xs text-gray-400 flex items-center gap-2">
    <span class="w-2 h-2 bg-blue-400 rounded-full"></span>Custom Platform
</div>
```

### Changing Color Scheme

**Option 1: Edit Tailwind CDN config (index.html)**
```javascript
colors: {
    'primary': '#your-color',
    'secondary': '#your-color'
}
```

**Option 2: Create custom CSS (css/styles.css)**
```css
:root {
    --primary: #3b82f6;
    --secondary: #a855f7;
    --accent: #ec4899;
}

/* Use variables */
.glass-card {
    background: linear-gradient(to right, var(--primary), var(--secondary));
}
```

### Modifying Player Controls

**Edit js/app.js - Plyr configuration:**

```javascript
player = new Plyr('#videoPlayer', {
    autoplay: true,
    controls: [
        'play-large',       // Remove for smaller player
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',              // Picture-in-Picture
        'airplay',          // Apple devices
        'fullscreen'
    ],
    settings: ['captions', 'quality', 'speed'],
    quality: { default: 360, options: [1080, 720, 480, 360] },
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] }
});
```

### Increasing History Size

**Edit js/storage.js:**
```javascript
MAX_HISTORY: 10  // Change from 5 to 10
```

### Custom Keyboard Shortcuts

**Edit js/app.js - Add to keyboard listener:**

```javascript
document.addEventListener('keydown', (e) => {
    // Existing shortcuts...
    
    // Add new shortcut: Ctrl+H for history
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        historyList.scrollIntoView({ behavior: 'smooth' });
    }
});
```

## Adding Features

### Feature: Video Quality Selector

Already built-in with Plyr! Users can access via settings gear icon.

### Feature: Subtitles

Add to HTML:
```html
<track kind="captions" src="subs-en.vtt" srclang="en" label="English">
```

In urlParser.js:
```javascript
return {
    ...videoData,
    subtitles: 'https://example.com/subs.vtt'
};
```

### Feature: Playlist Support

Create new file `js/playlist.js`:

```javascript
const PlaylistManager = {
    playlists: [],
    
    createPlaylist(name) {
        this.playlists.push({ id: Date.now(), name, videos: [] });
    },
    
    addVideoToPlaylist(playlistId, videoUrl) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist) playlist.videos.push(videoUrl);
    },
    
    playPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        return playlist?.videos || [];
    }
};
```

### Feature: Dark/Light Mode Toggle

Add button to HTML:
```html
<button id="themeToggle" class="p-2 hover:bg-white/10 rounded">
    <i class="fas fa-moon"></i>
</button>
```

Add to app.js:
```javascript
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    htmlElement.classList.add('dark');
}
```

## Error Handling

### Current Error Types

1. **Invalid URL**
   - Message: "URL is empty or invalid"
   - Solution: Validate format in urlParser

2. **CORS Restrictions**
   - Message: "CORS restriction detected"
   - Solution: Use CORS proxy or different source

3. **Access Denied**
   - Message: "Video cannot be accessed"
   - Solution: Check if video is public

4. **Network Error**
   - Message: "Connection error"
   - Solution: Retry or check internet

### Adding Error Handler

```javascript
async function handleVideoError(error) {
    console.error('Video Error:', error);
    
    // Map error codes to messages
    const errorMap = {
        'NETWORK_ERROR': 'Connection failed. Check your internet.',
        'CORS_ERROR': 'This video is blocked by CORS restrictions.',
        'AUTH_ERROR': 'This video requires authentication.',
        'NOT_FOUND': 'Video not found or deleted.'
    };
    
    showError(errorMap[error.code] || 'Error loading video');
}
```

## Testing

### Manual Testing Checklist

- [ ] YouTube URL plays
- [ ] Vimeo URL plays
- [ ] Direct MP4 plays
- [ ] HLS streams play
- [ ] Invalid URL shows error
- [ ] History saves on refresh
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive
- [ ] Player controls work
- [ ] Full screen works

### Automated Testing Setup

```javascript
// test/urlParser.test.js
describe('URLParser', () => {
    test('detects YouTube URLs', () => {
        const result = URLParser.parseURL('https://youtube.com/watch?v=abc123');
        expect(result.type).toBe('youtube');
        expect(result.valid).toBe(true);
    });
});
```

Run with:
```bash
npm install jest
npm test
```

## Performance Optimization

### Code Splitting

Instead of one app.js, split into modules:

```javascript
// storage.js - already modular
// urlParser.js - already modular  
// app.js - main app logic
// player.js - player initialization
// history.js - history management
```

### Lazy Loading

```javascript
// Load Plyr only when needed
async function loadPlyrWhenNeeded() {
    if (!window.Plyr) {
        const script = document.createElement('script');
        script.src = 'https://cdn.plyr.io/3.7.8/plyr.js';
        document.head.appendChild(script);
    }
}
```

### Caching Strategy

```javascript
// Cache API responses
const cache = new Map();

async function fetchWithCache(url, duration = 3600000) {
    if (cache.has(url)) {
        return cache.get(url);
    }
    
    const response = await fetch(url);
    cache.set(url, response);
    
    setTimeout(() => cache.delete(url), duration);
    return response;
}
```

## Browser DevTools Tips

### Console Shortcuts

```javascript
// Check localStorage
localStorage.getItem('anybox_history')

// Clear history programmatically
localStorage.removeItem('anybox_history')

// Test URL parser
URLParser.parseURL('https://youtube.com/watch?v=abc')

// View all videos in history
StorageManager.getHistory()
```

### Performance Profiling

1. Open DevTools (F12)
2. Go to Performance tab
3. Click record
4. Load a video
5. Stop recording
6. Analyze flame graph

### Network Tab Tips

- Check which CDNs are loaded
- Monitor video streaming
- Test CORS issues
- Check cache headers

## Security Best Practices

1. **Input Validation**: Always validate URLs
   ```javascript
   try {
       new URL(userInput);
   } catch {
       console.error('Invalid URL');
   }
   ```

2. **XSS Prevention**: Escape user input
   ```javascript
   function escapeHtml(text) {
       const div = document.createElement('div');
       div.textContent = text;
       return div.innerHTML;
   }
   ```

3. **CORS Headers**: Ensure proper headers
   ```javascript
   mode: 'no-cors'  // For public videos
   ```

4. **Content Security Policy**:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com">
   ```

## Deployment Checklist

Before deploying:

- [ ] Test all major video types
- [ ] Check mobile responsiveness
- [ ] Verify error messages
- [ ] Clear console warnings
- [ ] Minify CSS/JS
- [ ] Test on different browsers
- [ ] Check performance (Lighthouse)
- [ ] Set cache headers
- [ ] Enable HTTPS
- [ ] Add security headers
- [ ] Update version in package.json
- [ ] Create git tag/release

## Resources

- **Plyr Documentation**: https://plyr.io/
- **Tailwind CSS**: https://tailwindcss.com/
- **JavaScript Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **LocalStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Web Security**: https://owasp.org/

---

Happy developing! 🚀
