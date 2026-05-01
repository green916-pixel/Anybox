# AnyBox API Reference

JavaScript API documentation for integrating AnyBox functionality into external applications.

## Table of Contents

1. [URLParser API](#urlparser-api)
2. [StorageManager API](#storagemanager-api)
3. [Player API](#player-api)
4. [Events](#events)

---

## URLParser API

### Methods

#### parseURL(url)

Detects URL type and returns parsing result.

**Parameters:**
- `url` (string): The URL to parse

**Returns:**
```javascript
{
  valid: boolean,
  type: 'youtube' | 'vimeo' | 'direct' | 'hls' | 'terabox' | 'playit',
  url: string,
  embedUrl?: string,  // For iframe embeds
  videoId?: string,   // For platform videos
  mimeType?: string,  // For direct videos
  title: string,
  error?: string      // If invalid
}
```

**Example:**
```javascript
const result = URLParser.parseURL('https://youtube.com/watch?v=dQw4w9WgXcQ');
console.log(result);
// {
//   valid: true,
//   type: 'youtube',
//   videoId: 'dQw4w9WgXcQ',
//   embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//   title: 'YouTube Video'
// }
```

#### isYouTube(url)

Check if URL is a YouTube link.

**Parameters:**
- `url` (string): URL to check

**Returns:** boolean

#### isVimeo(url)

Check if URL is a Vimeo link.

#### isDailymotion(url)

Check if URL is a Dailymotion link.

#### isTerabox(url)

Check if URL is a Terabox link.

#### isPlayIt(url)

Check if URL is a PlayIt link.

#### isDirectVideo(url)

Check if URL is a direct video file (MP4, WebM, etc).

#### isHLS(url)

Check if URL is an HLS stream (.m3u8).

#### validateAccess(url)

Asynchronously check if URL is accessible.

**Parameters:**
- `url` (string): URL to validate

**Returns:** Promise<boolean>

**Example:**
```javascript
const isAccessible = await URLParser.validateAccess('https://example.com/video.mp4');
if (isAccessible) {
  console.log('Video is accessible');
} else {
  console.log('Video cannot be accessed (CORS or other issues)');
}
```

---

## StorageManager API

### Constants

```javascript
STORAGE_KEY = 'anybox_history'
MAX_HISTORY = 5
```

### Methods

#### getHistory()

Retrieve all stored video history.

**Returns:** Array<HistoryItem>

**HistoryItem Structure:**
```javascript
{
  id: number,           // Timestamp-based ID
  url: string,          // Video URL
  title: string,        // Display title
  type: string,         // Platform type
  timestamp: string,    // ISO 8601 timestamp
  playedAt: string      // Formatted datetime
}
```

**Example:**
```javascript
const history = StorageManager.getHistory();
history.forEach(item => {
  console.log(`${item.title} (${item.type}) - ${item.playedAt}`);
});
```

#### addToHistory(url, title, type)

Add a new video to history.

**Parameters:**
- `url` (string): Video URL
- `title` (string, optional): Video title
- `type` (string): Video type (youtube, vimeo, etc)

**Returns:** Array<HistoryItem> (updated history)

**Example:**
```javascript
StorageManager.addToHistory(
  'https://youtube.com/watch?v=abc',
  'My Video',
  'youtube'
);
```

#### removeFromHistory(id)

Remove a specific history item.

**Parameters:**
- `id` (number): History item ID

**Returns:** Array<HistoryItem> (updated history)

**Example:**
```javascript
StorageManager.removeFromHistory(1234567890);
```

#### clearHistory()

Remove all history items.

**Returns:** Array (empty array)

**Example:**
```javascript
if (confirm('Clear all history?')) {
  StorageManager.clearHistory();
}
```

#### extractTitleFromURL(url)

Extract a readable title from a video URL.

**Parameters:**
- `url` (string): Video URL

**Returns:** string

**Example:**
```javascript
const title = StorageManager.extractTitleFromURL('https://youtube.com/watch?v=abc');
console.log(title); // "YouTube Video"
```

#### formatTime(timestamp)

Format ISO timestamp to human-readable format.

**Parameters:**
- `timestamp` (string): ISO 8601 timestamp

**Returns:** string

**Example:**
```javascript
console.log(StorageManager.formatTime('2024-01-15T10:30:00Z'));
// "2h ago" or "1d ago" etc
```

---

## Player API

The player uses Plyr.js. Access the player instance via:

```javascript
// After a video is loaded
if (player) {
  player.play();
  player.pause();
  player.stop();
  player.destroy();
}
```

### Common Player Methods

#### play()
Start video playback.

#### pause()
Pause video playback.

#### stop()
Stop and reset video.

#### destroy()
Remove player and element.

#### toggleFullscreen()
Enter/exit fullscreen mode.

#### setCurrentTime(seconds)
Set playback position.

#### setVolume(0-1)
Set volume level.

#### setSpeed(multiplier)
Set playback speed (0.5, 1, 1.5, 2, etc).

### Player Events

```javascript
player.on('play', () => console.log('Playing'));
player.on('pause', () => console.log('Paused'));
player.on('ended', () => console.log('Finished'));
player.on('error', (error) => console.log('Error:', error));
player.on('timeupdate', (time) => console.log('Time:', time));
player.on('fullscreenchange', (full) => console.log('Fullscreen:', full));
```

### Plyr Configuration

```javascript
const player = new Plyr('#videoPlayer', {
  autoplay: false,
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen'
  ],
  settings: ['captions', 'quality', 'speed'],
  quality: {
    default: 360,
    options: [1080, 720, 480, 360]
  },
  speed: {
    selected: 1,
    options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  },
  keyboard: {
    focused: true,
    global: true
  },
  tooltips: {
    controls: true,
    seek: true
  }
});
```

---

## Events

### Custom Events

You can add custom event handling to app.js:

```javascript
// Video loaded event
document.addEventListener('anybox:videoLoaded', (e) => {
  console.log('Video loaded:', e.detail);
});

// History updated event
document.addEventListener('anybox:historyUpdated', (e) => {
  console.log('History changed:', e.detail);
});

// Error event
document.addEventListener('anybox:error', (e) => {
  console.log('Error occurred:', e.detail);
});
```

### Firing Custom Events

```javascript
// Dispatch video loaded event
const event = new CustomEvent('anybox:videoLoaded', {
  detail: { url: 'https://...', type: 'youtube' }
});
document.dispatchEvent(event);
```

---

## Integration Examples

### Example 1: Integration with External App

```javascript
// In your external application
function playVideoInAnyBox(videoUrl) {
  // Parse the URL
  const result = URLParser.parseURL(videoUrl);
  
  if (result.valid) {
    // Set input and play
    document.getElementById('urlInput').value = videoUrl;
    document.getElementById('playBtn').click();
  } else {
    console.error('Invalid video URL:', result.error);
  }
}

// Usage
playVideoInAnyBox('https://youtube.com/watch?v=abc123');
```

### Example 2: Auto-play First History Item

```javascript
function resumeLastVideo() {
  const history = StorageManager.getHistory();
  if (history.length > 0) {
    const lastVideo = history[0];
    document.getElementById('urlInput').value = lastVideo.url;
    document.getElementById('playBtn').click();
  }
}

// Call on app start
window.addEventListener('load', resumeLastVideo);
```

### Example 3: Playlist from Array

```javascript
function playPlaylist(videoUrls) {
  let currentIndex = 0;
  
  function playNext() {
    if (currentIndex < videoUrls.length) {
      document.getElementById('urlInput').value = videoUrls[currentIndex];
      document.getElementById('playBtn').click();
      currentIndex++;
    }
  }
  
  playNext();
  
  // Play next on video end
  if (player) {
    player.on('ended', playNext);
  }
}

// Usage
playPlaylist([
  'https://youtube.com/watch?v=video1',
  'https://youtube.com/watch?v=video2',
  'https://youtube.com/watch?v=video3'
]);
```

### Example 4: Remote Control

```javascript
// Create a remote control interface
class AnyBoxRemote {
  playVideo(url) {
    document.getElementById('urlInput').value = url;
    document.getElementById('playBtn').click();
  }
  
  pauseVideo() {
    if (player) player.pause();
  }
  
  resumeVideo() {
    if (player) player.play();
  }
  
  getHistory() {
    return StorageManager.getHistory();
  }
  
  clearHistory() {
    return StorageManager.clearHistory();
  }
}

// Usage from other window/iframe
window.anyboxRemote = new AnyBoxRemote();
```

### Example 5: Logging & Analytics

```javascript
function setupAnalytics() {
  // Log all video plays
  document.addEventListener('anybox:videoLoaded', (e) => {
    console.log('Played video:', e.detail);
    
    // Send to analytics service
    if (window.gtag) {
      gtag('event', 'video_play', {
        video_url: e.detail.url,
        video_type: e.detail.type
      });
    }
  });
  
  // Track errors
  document.addEventListener('anybox:error', (e) => {
    console.error('Error:', e.detail);
    if (window.gtag) {
      gtag('event', 'video_error', {
        error: e.detail.message
      });
    }
  });
}

setupAnalytics();
```

---

## Error Codes

Common error conditions:

```javascript
{
  'INVALID_URL': 'URL format is invalid',
  'EMPTY_URL': 'URL cannot be empty',
  'UNSUPPORTED_TYPE': 'Video type is not supported',
  'CORS_ERROR': 'Cross-Origin Resource Sharing blocked',
  'ACCESS_DENIED': 'Video access is restricted',
  'NOT_FOUND': 'Video not found',
  'NETWORK_ERROR': 'Network connection failed',
  'TIMEOUT': 'Request timeout',
  'PLAYER_ERROR': 'Player initialization failed'
}
```

---

## Versioning

**Current Version:** 1.0.0

**API Stability:** ✅ Stable

Breaking changes will be documented in CHANGELOG.md

---

## Support

For API questions or issues:
- Check DEVELOPMENT_GUIDE.md for examples
- Review source code in js/ folder
- Open an issue on GitHub
