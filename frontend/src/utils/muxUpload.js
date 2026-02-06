import client from '../api/client'
import * as UpChunk from '@mux/upchunk'

/**
 * Get Mux Direct Upload URL from backend
 */
export async function getMuxUploadUrl() {
    try {
        const response = await client.post('/upload/mux-url')
        return response.data
    } catch (error) {
        throw new Error(`Failed to get Mux upload URL: ${error.message}`)
    }
}

/**
 * Upload file to Mux using UpChunk
 * @param {File} file 
 * @param {Function} onProgress 
 * @returns {Promise<Object>} Mux upload result
 */
export async function uploadToMux(file, onProgress = null) {
    try {
        // 1. Get Direct Upload URL from our backend
        const { upload_url, upload_id } = await getMuxUploadUrl()

        // 2. Use UpChunk to upload the file
        // We need to return a Promise that resolves when the upload is complete
        return new Promise((resolve, reject) => {
            const upload = UpChunk.createUpload({
                endpoint: upload_url,
                file: file,
                chunkSize: 5120, // 5MB chunks
            })

            // Subscribe to events
            upload.on('error', (err) => {
                console.error('Mux UpChunk error:', err.detail)
                reject(new Error(`Mux upload failed: ${err.detail}`))
            })

            upload.on('progress', (progress) => {
                if (onProgress) {
                    onProgress(Math.round(progress.detail))
                }
            })

            upload.on('success', async () => {
                // When upload to the URL is successful, Mux starts processing the asset.
                // We return the upload_id. The backend will use this to get asset details.
                // Or better, we can wait a bit or let the backend handle the mapping.

                // For Mux, the "public_id" we'll store is the playback_id, 
                // but it might not be ready yet.
                // However, we can return the upload_id and the backend can poll or use webhooks.

                // Actually, for simplicity, we'll return a result that tells the backend 
                // this is a Mux upload.
                resolve({
                    type: 'video',
                    provider: 'mux',
                    public_id: upload_id, // We'll use upload_id for now, or asset_id if we can get it
                    upload_id: upload_id,
                    secure_url: '', // We don't have playback URL yet
                })
            })
        })
    } catch (error) {
        console.error('Mux upload error:', error)
        throw new Error(`Mux upload failed: ${error.message}`)
    }
}
