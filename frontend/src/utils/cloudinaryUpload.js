import client from '../api/client'

/**
 * Get Cloudinary signature from backend for signed uploads
 */
export async function getCloudinarySignature(resourceType = 'video', folder = null) {
  try {
    const params = new URLSearchParams({ resource_type: resourceType })
    if (folder) {
      params.append('folder', folder)
    }
    const response = await client.post(`/upload/sign?${params.toString()}`)
    return response.data
  } catch (error) {
    throw new Error(`Failed to get upload signature: ${error.message}`)
  }
}

/**
 * Get Cloudinary config from environment variables (public info only)
 */
function getCloudinaryConfigFromEnv() {
  const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const api_key = import.meta.env.VITE_CLOUDINARY_API_KEY
  const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  
  if (!cloud_name || !api_key || !upload_preset) {
    throw new Error(
      'Cloudinary environment variables not configured. ' +
      'Please set VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    )
  }
  
  return { cloud_name, api_key, upload_preset }
}

/**
 * Upload file directly to Cloudinary
 * @param {File} file - File to upload
 * @param {string} resourceType - 'image' or 'video'
 * @param {Function} onProgress - Progress callback (percent)
 * @param {string} folder - Optional folder in Cloudinary
 * @returns {Promise<Object>} Cloudinary upload result (metadata)
 */
export async function uploadToCloudinary(file, resourceType = 'image', onProgress = null, folder = null) {
  try {
    // Get Cloudinary config from environment variables (public info)
    const { cloud_name, api_key, upload_preset } = getCloudinaryConfigFromEnv()

    // Get signature from backend (requires API_SECRET - not exposed to FE)
    const signatureData = await getCloudinarySignature(resourceType, folder)
    const { timestamp, signature } = signatureData

    // Build upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', upload_preset)
    formData.append('api_key', api_key)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    
    if (folder) {
      formData.append('folder', folder)
    }

    // Upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            onProgress(Math.round(percentComplete))
          }
        })
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText)
            // Map Cloudinary response to our expected format (metadata)
            resolve({
              public_id: response.public_id,
              secure_url: response.secure_url,
              duration: response.duration || null,
              width: response.width,
              height: response.height,
              format: response.format,
              size: response.bytes,
              metadata: response
            })
          } catch (e) {
            console.error('Failed to parse Cloudinary response:', e, xhr.responseText)
            reject(new Error(`Failed to parse Cloudinary response: ${e.message}`))
          }
        } else {
          let errorMessage = `Upload failed with status ${xhr.status}`
          try {
            const errorResponse = JSON.parse(xhr.responseText)
            errorMessage = errorResponse.error?.message || errorMessage
            console.error('Cloudinary upload error:', errorResponse)
          } catch {
            console.error('Cloudinary upload error (non-JSON):', xhr.responseText)
          }
          
          // Provide user-friendly error messages
          if (xhr.status === 413) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
            errorMessage = `File is too large (${fileSizeMB} MB). ` +
              `Cloudinary free tier allows up to 100MB for videos. ` +
              `Please compress your video or upgrade your Cloudinary plan.`
          } else if (errorMessage.includes('whitelisted for unsigned uploads') || errorMessage.includes('unsigned')) {
            errorMessage = `Upload preset configuration error: ${errorMessage}. ` +
              `The preset "${upload_preset}" requires signed upload. ` +
              `Please check that your backend is generating the signature correctly.`
          }
          
          reject(new Error(errorMessage))
        }
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        console.error('Network error during upload to Cloudinary')
        reject(new Error('Network error during upload'))
      })

      xhr.addEventListener('abort', () => {
        console.error('Upload to Cloudinary was aborted')
        reject(new Error('Upload was aborted'))
      })

      xhr.open('POST', uploadUrl)
      xhr.send(formData)
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Cloudinary upload failed: ${error.message}`)
  }
}
