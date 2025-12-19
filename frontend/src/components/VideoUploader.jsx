import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { authService } from '../services/auth'

const VideoUploader = forwardRef(function VideoUploader({ onFileSelect, onProgress }, ref) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  // Expose upload function to parent component
  useImperativeHandle(ref, () => ({
    upload: async () => {
      if (!selectedFile) {
        throw new Error('No file selected')
      }
      return await uploadVideo(selectedFile)
    },
    getFile: () => selectedFile,
    clearFile: () => {
      setSelectedFile(null)
      setError(null)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    isUploading: () => uploading
  }))

  const uploadVideo = async (file, retryAttempt = 0) => {
    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', file)

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            const progress = Math.round(percentComplete)
            setUploadProgress(progress)
            if (onProgress) {
              onProgress(progress)
            }
          }
        })

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            setUploadProgress(100)
            setUploading(false)
            retryCountRef.current = 0
            resolve(response.data)
          } else {
            handleUploadError(new Error(`Upload failed with status ${xhr.status}`), reject)
          }
        })

        // Handle errors
        xhr.addEventListener('error', () => {
          handleUploadError(new Error('Network error during upload'), reject)
        })

        xhr.addEventListener('abort', () => {
          handleUploadError(new Error('Upload was aborted'), reject)
        })

        xhr.open('POST', '/api/upload/video')
        // Add authorization header
        const token = authService.getToken()
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        }
        xhr.send(formData)
      })

    } catch (err) {
      handleUploadError(err, () => {})
      throw err
    }
  }

  const handleUploadError = (err, reject) => {
    setError(err.message)
    setUploading(false)
    
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1
      setTimeout(() => {
        if (selectedFile) {
          uploadVideo(selectedFile, retryCountRef.current)
            .then(resolve => resolve)
            .catch(reject)
        }
      }, 2000 * retryCountRef.current) // Exponential backoff
    } else {
      retryCountRef.current = 0
      if (reject) {
        reject(err)
      }
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file')
        return
      }
      
      // Validate file size (e.g., max 500MB)
      const maxSize = 500 * 1024 * 1024 // 500MB
      if (file.size > maxSize) {
        setError('File size must be less than 500MB')
        return
      }

      setSelectedFile(file)
      setError(null)
      retryCountRef.current = 0
      
      if (onFileSelect) {
        onFileSelect(file)
      }
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        id="video-upload"
      />
      <label
        htmlFor="video-upload"
        className={`inline-block px-6 py-3 rounded cursor-pointer transition-colors duration-300 ${
          uploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-[#333]'
        }`}
      >
        {uploading ? 'Uploading...' : selectedFile ? 'Change Video File' : 'Select Video File'}
      </label>

      {selectedFile && !uploading && (
        <div className="mt-4 p-4 rounded bg-blue-50 border border-blue-200">
          <p className="text-blue-800 font-medium mb-2">✓ Video selected</p>
          <div className="text-sm text-blue-700 space-y-1">
            <p>File: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-xs text-blue-600 mt-2">Video will be uploaded when you create the post</p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-text-light mt-2">
            Uploading: {uploadProgress}%
            {retryCountRef.current > 0 && (
              <span className="ml-2 text-orange-600">
                (Retry attempt {retryCountRef.current}/{maxRetries})
              </span>
            )}
          </p>
        </div>
      )}

      {error && !uploading && (
        <div className="mt-4 p-4 rounded bg-red-50 border border-red-200">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
})

export default VideoUploader
