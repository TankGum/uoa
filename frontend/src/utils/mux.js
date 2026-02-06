/**
 * Mux Video playback utilities
 */

/**
 * Generate HLS playback URL from playback ID
 * @param {string} playbackId 
 * @returns {string}
 */
export function getMuxPlaybackUrl(playbackId) {
    if (!playbackId) return ''
    return `https://stream.mux.com/${playbackId}.m3u8`
}

/**
 * Generate thumbnail URL from playback ID
 * @param {string} playbackId 
 * @param {object} options 
 * @returns {string}
 */
export function getMuxThumbnailUrl(playbackId, options = {}) {
    if (!playbackId) return ''
    const { width = 800, time = 1 } = options
    return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=${width}&time=${time}`
}

/**
 * Check if a URL is a Mux URL
 * @param {string} url 
 * @returns {boolean}
 */
export function isMuxUrl(url) {
    return url && (url.includes('stream.mux.com') || url.includes('mux.com'))
}
