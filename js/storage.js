// LocalStorage Management for Video History
const StorageManager = {
    STORAGE_KEY: 'anybox_history',
    MAX_HISTORY: 5,

    /**
     * Get all history items from LocalStorage
     */
    getHistory() {
        try {
            const history = localStorage.getItem(this.STORAGE_KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    },

    /**
     * Add a new item to history
     */
    addToHistory(url, title, type) {
        try {
            const history = this.getHistory();
            
            // Create new history item
            const newItem = {
                id: Date.now(),
                url,
                title: title || this.extractTitleFromURL(url),
                type,
                timestamp: new Date().toISOString(),
                playedAt: new Date().toLocaleString()
            };

            // Remove duplicate URLs, keeping only unique entries
            const filteredHistory = history.filter(item => item.url !== url);

            // Add new item at the beginning
            const updatedHistory = [newItem, ...filteredHistory].slice(0, this.MAX_HISTORY);

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
            return updatedHistory;
        } catch (error) {
            console.error('Error adding to history:', error);
            return [];
        }
    },

    /**
     * Remove a specific item from history
     */
    removeFromHistory(id) {
        try {
            const history = this.getHistory();
            const updatedHistory = history.filter(item => item.id !== id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
            return updatedHistory;
        } catch (error) {
            console.error('Error removing from history:', error);
            return [];
        }
    },

    /**
     * Clear all history
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return [];
        } catch (error) {
            console.error('Error clearing history:', error);
            return [];
        }
    },

    /**
     * Extract a readable title from URL
     */
    extractTitleFromURL(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '');
            
            // Extract video ID or filename
            let title = '';
            
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                title = 'YouTube Video';
            } else if (url.includes('vimeo.com')) {
                title = 'Vimeo Video';
            } else if (url.includes('terabox.com')) {
                title = 'Terabox Video';
            } else if (url.includes('playit')) {
                title = 'PlayIt Video';
            } else {
                // Extract filename from URL
                const parts = url.split('/');
                title = parts[parts.length - 1].split('?')[0] || hostname;
            }
            
            return title || 'Video Link';
        } catch (error) {
            return 'Video Link';
        }
    },

    /**
     * Format timestamp for display
     */
    formatTime(timestamp) {
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return 'Just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            
            return date.toLocaleDateString();
        } catch (error) {
            return 'Recently';
        }
    }
};
