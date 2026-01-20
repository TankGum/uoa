import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxMedia, setLightboxMedia] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [allMedia, setAllMedia] = useState([])

  useEffect(() => {
    fetchPost()
  }, [id])

  useEffect(() => {
    if (post?.media) {
      setAllMedia(post.media)
    }
  }, [post])

  const fetchPost = async () => {
    try {
      const response = await client.get(`/posts/${id}`)
      setPost(response.data)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (media, index) => {
    setLightboxMedia(media)
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxMedia(null)
    document.body.style.overflow = 'unset'
  }

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next' 
      ? (lightboxIndex + 1) % allMedia.length
      : (lightboxIndex - 1 + allMedia.length) % allMedia.length
    
    setLightboxIndex(newIndex)
    setLightboxMedia(allMedia[newIndex])
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return
      
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') navigateLightbox('next')
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, lightboxIndex, allMedia])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4">
            Bài viết không tìm thấy
          </h2>
          <p className="text-zinc-400 mb-8">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link 
            to="/gallery" 
            className="inline-block px-8 py-4 bg-orange-500 text-zinc-950 font-bold text-sm uppercase tracking-wide hover:bg-orange-400 transition-colors"
          >
            Quay lại dự án
          </Link>
        </div>
      </div>
    )
  }

  const images = post.media?.filter(m => m.type === 'image') || []
  const videos = post.media?.filter(m => m.type === 'video') || []

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-orange-500/20 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/gallery" 
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-bold uppercase text-sm tracking-wider mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại dự án
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6">
            {post.title}
          </h1>
          <div className="h-1 w-32 bg-orange-500 mb-6"></div>
          
          {post.description && (
            <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl">
              {post.description}
            </p>
          )}

          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-8">
              {post.categories.map((cat) => (
                <span 
                  key={cat.id} 
                  className="px-4 py-2 bg-zinc-800 text-orange-500 font-bold uppercase text-xs tracking-wider"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Images Section */}
        {images.length > 0 && (
          <div className="mb-20">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                Hình ảnh
              </h2>
              <div className="h-1 w-24 bg-orange-500"></div>
              <p className="text-zinc-400 mt-4 text-sm uppercase tracking-wider">
                {images.length} {images.length === 1 ? 'Image' : 'Images'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((media, index) => {
                const mediaIndex = allMedia.findIndex(m => m.id === media.id)
                return (
                  <div 
                    key={media.id} 
                    className="group relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer"
                    onClick={() => openLightbox(media, mediaIndex)}
                  >
                    <img 
                      src={media.url} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    {/* Zoom Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-orange-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>

                    {/* Border Effect */}
                    <div className="absolute inset-0 border-4 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <div>
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                Video
              </h2>
              <div className="h-1 w-24 bg-orange-500"></div>
              <p className="text-zinc-400 mt-4 text-sm uppercase tracking-wider">
                {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((media, index) => {
                const streamingUrl = getStreamingVideoUrl(media.url, media.public_id, {
                  quality: 'auto',
                  format: 'auto',
                  streamingProfile: 'auto',
                  flags: ['streaming_attachment']
                })
                const thumbnailUrl = getVideoThumbnail(media.url, media.public_id, 1)
                const mediaIndex = allMedia.findIndex(m => m.id === media.id)
                
                return (
                  <div 
                    key={media.id} 
                    className="group relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer"
                    onClick={() => openLightbox(media, mediaIndex)}
                  >
                    <video 
                      muted
                      loop
                      autoPlay
                      preload="metadata"
                      poster={thumbnailUrl || undefined}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      playsInline
                      crossOrigin="anonymous"
                      onError={(e) => {
                        const videoEl = e.target
                        if (videoEl.src !== media.url) {
                          videoEl.src = media.url
                          videoEl.load()
                        }
                      }}
                    >
                      <source src={media.url} type={`video/${media.format || 'mp4'}`} />
                      <source src={streamingUrl} type={`video/${media.format || 'mp4'}`} />
                    </video>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-orange-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Border Effect */}
                    <div className="absolute inset-0 border-4 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && videos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📁</div>
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
              Không có media khả dụng
            </h3>
            <p className="text-zinc-400">
              Bài viết này không có hình ảnh hoặc video.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && lightboxMedia && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center mt-[70px]"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 w-12 h-12 text-white transition-colors flex items-center justify-center rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation - Previous */}
          {allMedia.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox('prev')
              }}
              className="absolute left-6 z-10 w-12 h-12 text-white transition-colors flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-400 opacity-70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Navigation - Next */}
          {allMedia.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateLightbox('next')
              }}
              className="absolute right-6 z-10 w-12 h-12 text-white transition-colors flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-400 opacity-70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Counter */}
          {allMedia.length > 1 && (
            <div className="absolute top-6 left-6 z-10 px-4 py-2 text-white font-bold text-sm rounded-full">
              <span className="text-white">
                {lightboxIndex + 1} / {allMedia.length}
              </span>
            </div>
          )}

          {/* Media Content */}
          <div 
            className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxMedia.type === 'image' ? (
              <img 
                src={lightboxMedia.url} 
                alt={post.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video 
                controls
                autoPlay
                className="max-w-full max-h-full"
                playsInline
                crossOrigin="anonymous"
              >
                <source src={lightboxMedia.url} type={`video/${lightboxMedia.format || 'mp4'}`} />
                <source 
                  src={getStreamingVideoUrl(lightboxMedia.url, lightboxMedia.public_id, {
                    quality: 'auto',
                    format: 'auto'
                  })} 
                  type={`video/${lightboxMedia.format || 'mp4'}`} 
                />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail