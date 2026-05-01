// URL Parser and Validator
const URLParser = {
    /**
     * Detect URL type and prepare for playback
     */
    parseURL(url) {
        if (!url || typeof url !== 'string') {
            return {
                valid: false,
                type: 'invalid',
                error: 'URL is empty or invalid'
            };
        }

        url = url.trim();

        // YouTube Detection
        if (this.isYouTube(url)) {
            return this.handleYouTube(url);
        }

        // Vimeo Detection
        if (this.isVimeo(url)) {
            return this.handleVimeo(url);
        }

        // Dailymotion Detection
        if (this.isDailymotion(url)) {
            return this.handleDailymotion(url);
        }

        // Terabox Detection
        if (this.isTerabox(url)) {
            return this.handleTerabox(url);
        }

        // PlayIt Detection
        if (this.isPlayIt(url)) {
            return this.handlePlayIt(url);
        }

        // Direct MP4/WebM/MKV files
        if (this.isDirectVideo(url)) {
            return this.handleDirectVideo(url);
        }

        // HLS/M3U8 Streams
        if (this.isHLS(url)) {
            return this.handleHLS(url);
        }

        // Generic fallback - try as direct link
        return this.handleDirectVideo(url);
    },

    /**
     * YouTube URL Detection
     */
    isYouTube(url) {
        return /(?:youtube\.com|youtu\.be)/.test(url);
    },

    handleYouTube(url) {
        let videoId = null;

        // youtu.be/VIDEO_ID
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0] || null;
        }
        // youtube.com/watch?v=VIDEO_ID
        else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1]?.split('&')[0] || null;
        }
        // youtube.com/embed/VIDEO_ID
        else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0] || null;
        }

        if (videoId && videoId.length > 0) {
            return {
                valid: true,
                type: 'youtube',
                videoId,
                embedUrl: `https://www.youtube.com/embed/${videoId}`,
                title: 'YouTube Video',
                url
            };
        }

        return {
            valid: false,
            type: 'youtube',
            error: 'Invalid YouTube URL format'
        };
    },

    /**
     * Vimeo URL Detection
     */
    isVimeo(url) {
        return /vimeo\.com/.test(url);
    },

    handleVimeo(url) {
        const videoId = url.split('/').pop()?.split('?')[0] || null;

        if (videoId && /^\d+$/.test(videoId)) {
            return {
                valid: true,
                type: 'vimeo',
                videoId,
                embedUrl: `https://player.vimeo.com/video/${videoId}`,
                title: 'Vimeo Video',
                url
            };
        }

        return {
            valid: false,
            type: 'vimeo',
            error: 'Invalid Vimeo URL format'
        };
    },

    /**
     * Dailymotion URL Detection
     */
    isDailymotion(url) {
        return /dailymotion\.com/.test(url);
    },

    handleDailymotion(url) {
        const videoId = url.split('/video/')[1]?.split('_')[0] || null;

        if (videoId) {
            return {
                valid: true,
                type: 'dailymotion',
                videoId,
                embedUrl: `https://www.dailymotion.com/embed/video/${videoId}`,
                title: 'Dailymotion Video',
                url
            };
        }

        return {
            valid: false,
            type: 'dailymotion',
            error: 'Invalid Dailymotion URL format'
        };
    },

    /**
     * Terabox URL Detection
     */
    isTerabox(url) {
        return /terabox\.com|pan\.baidu\.com/.test(url);
    },

    handleTerabox(url) {
        // Extract file ID or share link
        const sharedLink = url;
        
        return {
            valid: true,
            type: 'terabox',
            url: sharedLink,
            title: 'Terabox Video',
            warning: 'Note: Some Terabox links may require authentication or have regional restrictions',
            note: 'This is a direct link. If it doesn\'t work, it may be due to access restrictions.'
        };
    },

    /**
     * PlayIt URL Detection
     */
    isPlayIt(url) {
        return /playit\.pk|playit\.app|playit\.tv/.test(url);
    },

    handlePlayIt(url) {
        return {
            valid: true,
            type: 'playit',
            url,
            title: 'PlayIt Video',
            warning: 'PlayIt may require additional setup for streaming',
            note: 'Direct streaming may depend on server support'
        };
    },

    /**
     * Direct Video File Detection
     */
    isDirectVideo(url) {
        const videoExtensions = /\.(mp4|webm|mkv|avi|mov|flv|wmv|ogg|3gp)(\?|$)/i;
        return videoExtensions.test(url);
    },

    handleDirectVideo(url) {
        try {
            new URL(url); // Validate URL format
            
            const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
            const mimeTypes = {
                'mp4': 'video/mp4',
                'webm': 'video/webm',
                'ogg': 'video/ogg',
                'mkv': 'video/x-matroska',
                'avi': 'video/x-msvideo',
                'mov': 'video/quicktime',
                'flv': 'video/x-flv',
                'wmv': 'video/x-ms-wmv',
                '3gp': 'video/3gpp'
            };

            return {
                valid: true,
                type: 'direct',
                url,
                mimeType: mimeTypes[ext] || 'video/mp4',
                title: url.split('/').pop()?.split('?')[0] || 'Direct Video'
            };
        } catch (error) {
            return {
                valid: false,
                type: 'direct',
                error: 'Invalid URL format'
            };
        }
    },

    /**
     * HLS/M3U8 Stream Detection
     */
    isHLS(url) {
        return /\.m3u8(\?|$)/i.test(url);
    },

    handleHLS(url) {
        try {
            new URL(url);
            
            return {
                valid: true,
                type: 'hls',
                url,
                mimeType: 'application/x-mpegURL',
                title: 'HLS Stream'
            };
        } catch (error) {
            return {
                valid: false,
                type: 'hls',
                error: 'Invalid HLS URL format'
            };
        }
    },

    /**
     * Validate if URL is accessible
     */
    async validateAccess(url) {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors'
            });
            return true;
        } catch (error) {
            return false;
        }
    }
};
