// Main Application
let player = null;
let currentVideoData = null;

// DOM Elements
const urlInput = document.getElementById('urlInput');
const playBtn = document.getElementById('playBtn');
const playerContainer = document.getElementById('playerContainer');
const emptyState = document.getElementById('emptyState');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const videoTitle = document.getElementById('videoTitle');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const playerDiv = document.getElementById('player');

/**
 * Initialize the application
 */
function initApp() {
    setupEventListeners();
    loadHistory();
    urlInput.focus();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    playBtn.addEventListener('click', handlePlayClick);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePlayClick();
    });
    clearHistoryBtn.addEventListener('click', handleClearHistory);
}

/**
 * Handle play button click
 */
async function handlePlayClick() {
    const url = urlInput.value.trim();

    if (!url) {
        showError('Please enter a video URL');
        return;
    }

    playBtn.disabled = true;
    hideError();

    try {
        // Parse URL
        const videoData = URLParser.parseURL(url);

        if (!videoData.valid) {
            showError(videoData.error || 'Unable to parse video URL');
            playBtn.disabled = false;
            return;
        }

        currentVideoData = videoData;

        // Load video based on type
        if (videoData.type === 'youtube' || videoData.type === 'vimeo' || videoData.type === 'dailymotion') {
            loadEmbeddedVideo(videoData);
        } else {
            loadDirectVideo(videoData);
        }

        // Add to history
        StorageManager.addToHistory(url, videoData.title, videoData.type);
        loadHistory();

        // Scroll to player
        setTimeout(() => {
            playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);

    } catch (error) {
        showError('Error loading video: ' + error.message);
    } finally {
        playBtn.disabled = false;
    }
}

/**
 * Load embedded video (YouTube, Vimeo, etc.)
 */
function loadEmbeddedVideo(videoData) {
    // Clear previous player
    playerDiv.innerHTML = '';

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = videoData.embedUrl;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameborder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '0.5rem';

    playerDiv.innerHTML = '';
    playerDiv.appendChild(iframe);

    // Update UI
    videoTitle.textContent = videoData.title;
    emptyState.classList.add('hidden');
    playerContainer.classList.remove('hidden');

    showSuccess(`${videoData.title} loaded successfully`);
}

/**
 * Load direct video
 */
function loadDirectVideo(videoData) {
    // Clear previous player
    playerDiv.innerHTML = '';

    // Create video element
    const video = document.createElement('video');
    video.id = 'videoPlayer';

    // Create source element
    const source = document.createElement('source');
    source.src = videoData.url;
    source.type = videoData.mimeType || 'video/mp4';

    video.appendChild(source);
    video.innerHTML += '<p>Your browser does not support HTML5 video.</p>';

    playerDiv.appendChild(video);

    // Initialize Plyr player
    player = new Plyr('#videoPlayer', {
        autoplay: true,
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
        quality: { default: 360, options: [1080, 720, 480, 360] },
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: true }
    });

    // Update UI
    videoTitle.textContent = videoData.title;
    emptyState.classList.add('hidden');
    playerContainer.classList.remove('hidden');

    showSuccess(`${videoData.title} loaded successfully`);
}

/**
 * Show error message
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

/**
 * Show success message
 */
function showSuccess(message) {
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 glass-card rounded-lg p-4 border border-white/10 flex items-center gap-3 animate-fade-in max-w-sm';
    notification.innerHTML = `
        <i class="fas fa-check-circle text-green-400 text-lg"></i>
        <p class="text-sm text-gray-200">${message}</p>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.add('hidden');
}

/**
 * Load and display history
 */
function loadHistory() {
    const history = StorageManager.getHistory();

    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">No history yet</p>';
        return;
    }

    historyList.innerHTML = history
        .map(item => `
            <div class="history-item group" data-id="${item.id}">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-blue-300 truncate-1">${escapeHtml(item.title)}</p>
                        <p class="text-xs text-gray-500 truncate-1">${item.type.toUpperCase()}</p>
                        <p class="text-xs text-gray-600 mt-1">${StorageManager.formatTime(item.timestamp)}</p>
                    </div>
                    <button class="delete-btn ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-400">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        `)
        .join('');

    // Add event listeners to history items
    historyList.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                const id = parseInt(item.dataset.id);
                const historyItem = history.find(h => h.id === id);
                if (historyItem) {
                    urlInput.value = historyItem.url;
                    handlePlayClick();
                }
            }
        });
    });

    // Delete button listeners
    historyList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const historyItem = btn.closest('.history-item');
            const id = parseInt(historyItem.dataset.id);
            StorageManager.removeFromHistory(id);
            loadHistory();
        });
    });
}

/**
 * Clear all history
 */
function handleClearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        StorageManager.clearHistory();
        loadHistory();
        showSuccess('History cleared');
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Ctrl+L to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        urlInput.focus();
        urlInput.select();
    }

    // Escape to clear input
    if (e.key === 'Escape') {
        if (document.activeElement === urlInput) {
            urlInput.value = '';
            urlInput.blur();
        }
    }
});

/**
 * Add CSS for animations
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Graceful error handling
 */
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
