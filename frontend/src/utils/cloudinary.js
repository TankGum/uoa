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
  if (!url || !publicId) return url
  
  // If URL doesn't contain Cloudinary domain, return as is
  if (!url.includes('res.cloudinary.com')) {
    return url
  }
  
  // Extract cloud name and path from URL
  const urlMatch = url.match(/https?:\/\/([^\/]+)\/([^\/]+)\/(video|image)\/upload\/(.*)/)
  if (!urlMatch) {
    // Try to extract public_id from URL
    const publicIdMatch = url.match(/\/upload\/(.*)$/)
    if (publicIdMatch) {
      const path = publicIdMatch[1]
      const cloudName = url.match(/res\.cloudinary\.com\/([^\/]+)/)?.[1]
      if (cloudName) {
        return buildStreamingUrl(cloudName, path, options)
      }
    }
    return url
  }
  
  const [, domain, cloudName, resourceType, path] = urlMatch
  
  // Build optimized streaming URL with transformations
  return buildStreamingUrl(cloudName, path, {
    ...options,
    resourceType: resourceType || 'video'
  })
}

/**
 * Build Cloudinary streaming URL with transformations
 */
function buildStreamingUrl(cloudName, path, options = {}) {
  const {
    resourceType = 'video',
    quality = 'auto',
    format = 'auto',
    streamingProfile = 'auto',
    width,
    height,
    crop,
    flags = ['streaming_attachment']
  } = options
  
  // Build transformation string
  const transformations = []
  
  // Quality and format
  if (quality) transformations.push(`q_${quality}`)
  if (format) transformations.push(`f_${format}`)
  
  // Streaming profile for adaptive bitrate
  if (streamingProfile && resourceType === 'video') {
    transformations.push(`sp_${streamingProfile}`)
  }
  
  // Dimensions (optional, for responsive)
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  
  // Flags for streaming
  if (flags && flags.length > 0) {
    transformations.push(`fl_${flags.join('.')}`)
  }
  
  const transformationString = transformations.length > 0 
    ? transformations.join(',') + '/'
    : ''
  
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformationString}${path}`
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

