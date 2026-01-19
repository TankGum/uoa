import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { uploadToCloudinary } from '../utils/cloudinaryUpload'

const ImageUploader = forwardRef(function ImageUploader({ onFileSelect, onProgress, multiple = false }, ref) {
  const [selectedFiles, setSelectedFiles] = useState([])
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
      if (selectedFiles.length === 0) {
        throw new Error('No files selected')
      }
      return await uploadImages(selectedFiles)
    },
    getFiles: () => selectedFiles,
    clearFiles: () => {
      setSelectedFiles([])
      setError(null)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    isUploading: () => uploading
  }))

  const uploadImages = async (files, retryAttempt = 0) => {
    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)

      // Upload all files directly to Cloudinary in parallel (get metadata)
      const uploadPromises = files.map(async (file, index) => {
        return uploadToCloudinary(
          file,
          'image',
          (progress) => {
            // Calculate total progress across all files
            const fileProgress = progress / files.length
            const completedFilesProgress = (index / files.length) * 100
            const totalProgress = completedFilesProgress + fileProgress
            setUploadProgress(Math.round(totalProgress))
            if (onProgress) {
              onProgress(Math.round(totalProgress))
            }
          }
        )
      })

      const results = await Promise.all(uploadPromises)
      setUploadProgress(100)
      setUploading(false)
      retryCountRef.current = 0
      return results
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
        if (selectedFiles.length > 0) {
          uploadImages(selectedFiles, retryCountRef.current)
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

  const processFiles = (files) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    // Validate file types
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      setError('Please select only image files')
      return
    }
    
    // Validate file sizes (e.g., max 10MB per image)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = fileArray.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...fileArray])
    } else {
      setSelectedFiles(fileArray.slice(0, 1))
    }
    
    setError(null)
    retryCountRef.current = 0
    
    if (onFileSelect) {
      onFileSelect(multiple ? fileArray : fileArray[0])
    }
  }

  const handleFileSelect = (e) => {
    processFiles(e.target.files || [])
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

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        multiple={multiple}
        className="hidden"
        id="image-upload"
      />
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
          isDragging
            ? 'border-[#cfb970] bg-[#cfb970]/10'
            : 'border-gray-300 bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="text-center">
          <label
            htmlFor="image-upload"
            className={`inline-block px-6 py-3 rounded cursor-pointer transition-colors duration-300 ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-[#333]'
            }`}
          >
            {uploading ? 'Uploading...' : selectedFiles.length > 0 ? `Add Image${multiple ? 's' : ''}` : `Select Image${multiple ? 's' : ''}`}
          </label>
          {!uploading && (
            <p className="mt-2 text-sm text-gray-600">
              or drag and drop image{multiple ? 's' : ''} here
            </p>
          )}
        </div>
      </div>

      {selectedFiles.length > 0 && !uploading && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative p-4 rounded bg-blue-50 border border-blue-200 flex items-center gap-4 min-w-0">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-20 h-20 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 text-sm text-blue-700 min-w-0">
                <p className="font-medium truncate" title={file.name}>{file.name}</p>
                <p className="truncate">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex-shrink-0 shadow-md"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <p className="text-xs text-blue-600">
            Image{selectedFiles.length > 1 ? 's' : ''} will be uploaded when you save the post
          </p>
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

export default ImageUploader

