import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

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

  if (loading) {
    return (
      <div className="py-12">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="py-12">
        <div className="container">
          <p>Post not found.</p>
          <Link to="/gallery" className="btn btn-primary mt-4">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const images = post.media?.filter(m => m.type === 'image') || []
  const videos = post.media?.filter(m => m.type === 'video') || []

  return (
    <div className="py-12">
      <div className="container">
        <Link to="/gallery" className="inline-block mb-8 text-text-light transition-colors duration-300 hover:text-primary">
          ← Back to Projects
        </Link>
        
        <article className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-4xl font-light mb-6 uppercase tracking-[1px]">{post.title}</h1>
          
          {post.description && (
            <div className="text-xl md:text-base leading-relaxed text-text-light mb-8">
              <p>{post.description}</p>
            </div>
          )}

          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-12">
              {post.categories.map((cat) => (
                <span key={cat.id} className="category-badge">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl md:text-2xl font-light mb-8 uppercase tracking-[1px]">Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((media) => (
                  <div key={media.id} className="relative aspect-square overflow-hidden rounded-lg cursor-pointer">
                    <img src={media.url} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl md:text-2xl font-light mb-8 uppercase tracking-[1px]">Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((media) => {
                  // Generate optimized streaming URL
                  const streamingUrl = getStreamingVideoUrl(media.url, media.public_id, {
                    quality: 'auto',
                    format: 'auto',
                    streamingProfile: 'auto',
                    flags: ['streaming_attachment']
                  })
                  
                  // Generate thumbnail for poster
                  const thumbnailUrl = getVideoThumbnail(media.url, media.public_id, 1)
                  
                  return (
                    <div key={media.id} className="relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-black">
                      <video 
                        controls 
                        preload="metadata"
                        poster={thumbnailUrl || undefined}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        playsInline
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Video load error:', {
                            error: e,
                            streamingUrl,
                            originalUrl: media.url,
                            publicId: media.public_id,
                            format: media.format,
                            videoElement: e.target
                          })
                          // Try to load original URL if streaming URL fails
                          const videoEl = e.target
                          if (videoEl.src !== media.url) {
                            videoEl.src = media.url
                            videoEl.load()
                          }
                        }}
                      >
                        <source src={media.url} type={`video/${media.format || 'mp4'}`} />
                        <source src={streamingUrl} type={`video/${media.format || 'mp4'}`} />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default PostDetail

