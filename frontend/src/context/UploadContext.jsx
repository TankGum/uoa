import { createContext, useContext, useState, useCallback } from 'react'
import client from '../api/client'
import { uploadToMux } from '../utils/muxUpload'
import { uploadToCloudinary } from '../utils/cloudinaryUpload'

const UploadContext = createContext()

export function useUploads() {
    const context = useContext(UploadContext)
    if (!context) {
        throw new Error('useUploads must be used within an UploadProvider')
    }
    return context
}

export function UploadProvider({ children }) {
    const [activeUploads, setActiveUploads] = useState([])

    const updateUpload = useCallback((id, updates) => {
        setActiveUploads(prev => prev.map(u =>
            u.id === id ? { ...u, ...updates } : u
        ))
    }, [])

    const addUpload = useCallback((upload) => {
        setActiveUploads(prev => [upload, ...prev])
    }, [])

    const removeUpload = useCallback((id) => {
        setActiveUploads(prev => prev.filter(u => u.id !== id))
    }, [])

    const startPostUploadJob = async ({
        formData,
        videoFile,
        imageFiles,
        post = null,
        existingMedia = [],
        onSuccess = () => { }
    }) => {
        const jobId = `job-${Date.now()}`
        const jobTitle = formData.title || 'Untitled Post'

        addUpload({
            id: jobId,
            title: jobTitle,
            progress: 0,
            status: 'uploading',
            error: null
        })

            // Start background process
            ; (async () => {
                try {
                    let currentPost = post

                    // Phase 1: Create post first if it doesn't exist
                    // This ensures we have an ID to attach media to
                    if (!currentPost) {
                        updateUpload(jobId, { status: 'preparing', progress: 5 })
                        const createResponse = await client.post('/posts', {
                            ...formData,
                            status: 'draft', // Force draft while uploading
                            media: []
                        })
                        currentPost = createResponse.data
                        window.dispatchEvent(new CustomEvent('posts-updated'))
                    }

                    // Phase 2: Parallel Uploads
                    updateUpload(jobId, { status: 'uploading', progress: 10 })

                    let videoResult = null
                    let imageResults = []

                    const totalSteps = (videoFile ? 1 : 0) + (imageFiles?.length || 0)
                    let completedSteps = 0

                    const updateProgress = () => {
                        const progress = Math.min(10 + Math.round((completedSteps / totalSteps) * 80), 90)
                        updateUpload(jobId, { progress })
                    }

                    const uploadPromises = []

                    if (videoFile) {
                        uploadPromises.push(
                            uploadToMux(videoFile, (p) => {
                                // Video progress is handled individually in context if needed
                                // For now we just track completion
                            }).then(res => {
                                videoResult = res
                                completedSteps++
                                updateProgress()
                                return res
                            })
                        )
                    }

                    if (imageFiles && imageFiles.length > 0) {
                        imageFiles.forEach(file => {
                            uploadPromises.push(
                                uploadToCloudinary(file, 'image', (p) => {
                                    // Image progress
                                }).then(res => {
                                    imageResults.push(res)
                                    completedSteps++
                                    updateProgress()
                                    return res
                                })
                            )
                        })
                    }

                    await Promise.all(uploadPromises)

                    // Phase 3: Sync Media to Post
                    updateUpload(jobId, { status: 'syncing', progress: 95 })

                    let finalMediaData = []

                    // Map existing media
                    const existingMediaInput = existingMedia.map((m, idx) => ({
                        type: m.type,
                        provider: m.provider || 'cloudinary',
                        public_id: m.public_id,
                        secure_url: m.url,
                        asset_id: m.meta_data?.asset_id || m.metadata?.asset_id,
                        duration: m.duration,
                        width: m.width,
                        height: m.height,
                        format: m.format,
                        size: m.size,
                        is_featured: Boolean(m.is_featured),
                        display_order: m.display_order !== undefined ? m.display_order : idx
                    }))

                    // Combined results
                    const newMediaResults = []
                    if (videoResult) newMediaResults.push(videoResult)
                    newMediaResults.push(...imageResults)

                    finalMediaData = [
                        ...existingMediaInput,
                        ...newMediaResults.map((m, idx) => ({
                            ...m,
                            is_featured: existingMediaInput.length === 0 && idx === 0, // Feature first if none exists
                            display_order: existingMediaInput.length + idx
                        }))
                    ]

                    // Final payload
                    const finalPayload = {
                        ...formData,
                        media: finalMediaData
                    }

                    await client.put(`/posts/${currentPost.id}`, finalPayload)

                    updateUpload(jobId, { status: 'completed', progress: 100 })
                    window.dispatchEvent(new CustomEvent('posts-updated'))
                    if (onSuccess) onSuccess()

                    // Auto-remove after 5 seconds if successful
                    setTimeout(() => removeUpload(jobId), 5000)

                } catch (err) {
                    console.error('Upload job failed:', err)
                    updateUpload(jobId, {
                        status: 'error',
                        error: err.response?.data?.detail || err.message || 'Upload failed'
                    })
                }
            })()

        return jobId
    }

    return (
        <UploadContext.Provider value={{
            activeUploads,
            startPostUploadJob,
            removeUpload,
            updateUpload
        }}>
            {children}
        </UploadContext.Provider>
    )
}
