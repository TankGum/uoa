/**
 * Cloudinary URL transformation utilities
 */

/**
 * Generate optimized streaming URL for video playback
 * Uses Cloudinary transformations for faster loading and streaming
 * 
 * @param {string} url - Original Cloudinary URL
 * @param {string} publicId - Cloudinary public_id
 * @param {object} options - Transformation options
 * @returns {string} - Optimized streaming URL
 */
export function getStreamingVideoUrl(url, publicId, options = {}) {
  if (!url) return url
  
  // If URL doesn't contain Cloudinary domain, return as is
  if (!url.includes('res.cloudinary.com')) {
    return url
  }
  
  // Extract cloud name from URL
  const cloudNameMatch = url.match(/res\.cloudinary\.com\/([^\/]+)/)
  if (!cloudNameMatch) {
    return url
  }
  const cloudName = cloudNameMatch[1]
  
  // Use publicId if provided (more reliable), otherwise extract from URL
  let videoPublicId = publicId
  if (!videoPublicId) {
    // Extract public_id from URL
    const pathMatch = url.match(/\/upload\/(.*)$/)
    if (pathMatch) {
      videoPublicId = pathMatch[1]
      // Remove file extension if present
      videoPublicId = videoPublicId.replace(/\.(mp4|mov|avi|webm|mkv|flv|wmv)$/i, '')
    }
  }
  
  if (!videoPublicId) {
    // Fallback to original URL if we can't extract public_id
    return url
  }
  
  // Build optimized streaming URL with transformations
  return buildStreamingUrl(cloudName, videoPublicId, {
    ...options,
    resourceType: 'video'
  })
}

/**
 * Build Cloudinary streaming URL with transformations
 */
function buildStreamingUrl(cloudName, publicId, options = {}) {
  const { format = 'mp4' } = options

  // Cloudinary automatically enables progressive streaming for videos
  // Keep original format if supported, otherwise convert to MP4
  let cleanPublicId = publicId
  if (cleanPublicId && cleanPublicId.includes('.')) {
    cleanPublicId = cleanPublicId.replace(/\.(mp4|mov|avi|webm|mkv|flv|wmv)$/i, '')
  }

  // Use original format if it's MP4, otherwise convert to MP4
  const targetFormat = format === 'mp4' ? 'mp4' : 'mp4' // Always MP4 for browser compatibility

  // Basic streaming URL - Cloudinary handles streaming automatically
  return `https://res.cloudinary.com/${cloudName}/video/upload/${cleanPublicId}.${targetFormat}`
}

/**
 * Generate thumbnail/poster URL for video
 * 
 * @param {string} url - Original Cloudinary URL
 * @param {string} publicId - Cloudinary public_id
 * @param {number} timeOffset - Time offset in seconds (default: 1)
 * @returns {string} - Thumbnail URL
 */
export function getVideoThumbnail(url, publicId, timeOffset = 1) {
  if (!url || !publicId) return null
  
  if (!url.includes('res.cloudinary.com')) {
    return null
  }
  
  // Extract cloud name from URL
  const cloudNameMatch = url.match(/res\.cloudinary\.com\/([^\/]+)/)
  if (!cloudNameMatch) return null
  
  const cloudName = cloudNameMatch[1]
  
  // Extract public_id from URL or use provided one
  let videoPublicId = publicId
  if (!videoPublicId) {
    const pathMatch = url.match(/\/upload\/(.*)$/)
    if (pathMatch) {
      videoPublicId = pathMatch[1].replace(/\.(mp4|mov|avi|webm|mkv)$/i, '')
    }
  }
  
  if (!videoPublicId) return null
  
  // Generate thumbnail URL with time offset
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_${timeOffset},w_800,h_600,c_fill,q_auto,f_auto/${videoPublicId}.jpg`
}

