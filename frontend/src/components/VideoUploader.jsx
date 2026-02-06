import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { uploadToCloudinary } from '../utils/cloudinaryUpload'
import { uploadToMux } from '../utils/muxUpload'

const VideoUploader = forwardRef(function VideoUploader({ onFileSelect, onProgress }, ref) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)
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

      // Upload directly to Mux
      const result = await uploadToMux(
        file,
        (progress) => {
          setUploadProgress(progress)
          if (onProgress) {
            onProgress(progress)
          }
        }
      )

      setUploadProgress(100)
      setUploading(false)
      retryCountRef.current = 0
      return result

    } catch (err) {
      handleUploadError(err, () => { })
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

  const processFile = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setError(`File size (${fileSizeMB} MB) exceeds maximum limit of 500MB. Please compress your video or use a smaller file.`)
      return
    }

    setSelectedFile(file)
    setError(null)
    retryCountRef.current = 0

    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    processFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!uploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set isDragging to false if we're leaving the drop zone
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (uploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
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
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${isDragging
          ? 'border-[#cfb970] bg-[#cfb970]/10'
          : 'border-gray-300 bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="text-center">
          <label
            htmlFor="video-upload"
            className={`inline-block px-6 py-3 rounded cursor-pointer transition-colors duration-300 ${uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-[#333]'
              }`}
          >
            {uploading ? 'Uploading...' : selectedFile ? 'Change Video File' : 'Select Video File'}
          </label>
          {!uploading && (
            <p className="mt-2 text-sm text-gray-600">
              or drag and drop video file here
            </p>
          )}
        </div>
      </div>

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
