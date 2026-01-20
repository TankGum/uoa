import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import Pagination from '../components/Pagination'

function AllVideos() {
  const [allVideos, setAllVideos] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 24

  useEffect(() => {
    fetchAllVideos()
  }, [])

  useEffect(() => {
    const skip = (currentPage - 1) * itemsPerPage
    const paginatedVideos = allVideos.slice(skip, skip + itemsPerPage)
    setVideos(paginatedVideos)
    setTotalPages(Math.ceil(allVideos.length / itemsPerPage))
  }, [allVideos, currentPage])

  const fetchAllVideos = async () => {
    try {
      setLoading(true)
      let allPosts = []
      let skip = 0
      const limit = 100
      let hasMore = true

      while (hasMore) {
        const response = await client.get('/posts', { 
          params: { 
            status: 'published',
            skip,
            limit
          } 
        })
        
        const posts = response.data.items || response.data
        allPosts = [...allPosts, ...posts]
        
        if (posts.length < limit) {
          hasMore = false
        } else {
          skip += limit
        }
      }
      
      const extractedVideos = allPosts.flatMap(post => 
        (post.media?.filter(m => m.type === 'video') || []).map(video => ({
          ...video,
          postId: post.id,
          postTitle: post.title
        }))
      )
      
      setAllVideos(extractedVideos)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-orange-600 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black text-zinc-950 uppercase tracking-tight mb-4">
            Film
          </h1>
          <div className="h-1 w-32 bg-zinc-950 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-zinc-900 font-medium max-w-2xl mx-auto">
            Mỗi khung hình nói một câu chuyện, mỗi video bắt trọn một khoảnh khắc
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Header */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
              Thư viện
            </h2>
            <div className="h-1 w-24 bg-orange-500"></div>
            {allVideos.length > 0 && (
              <p className="text-zinc-400 mt-4 text-sm uppercase tracking-wider">
                {allVideos.length} film
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                Không tìm thấy video
              </h3>
              <p className="text-zinc-400 mb-8">
                Không có video nào khả dụng tại thời điểm hiện tại.
              </p>
              <Link
                to="/gallery"
                className="inline-block px-8 py-4 bg-orange-500 text-zinc-950 font-bold text-sm uppercase tracking-wide hover:bg-orange-400 transition-colors"
              >
                Xem tất cả dự án
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {videos.map((video) => {
                  const streamingUrl = getStreamingVideoUrl(video.url, video.public_id, {
                    quality: 'auto',
                    format: 'auto',
                    streamingProfile: 'auto',
                    flags: ['streaming_attachment']
                  })
                  const thumbnailUrl = getVideoThumbnail(video.url, video.public_id, 1)
                  
                  return (
                    <Link 
                      key={video.id} 
                      to={`/post/${video.postId}`}
                      className="group relative aspect-square overflow-hidden bg-zinc-900"
                    >
                      {/* Video */}
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
                          if (videoEl.src !== video.url) {
                            videoEl.src = video.url
                            videoEl.load()
                          }
                        }}
                      >
                        <source src={video.url} type={`video/${video.format || 'mp4'}`} />
                        <source src={streamingUrl} type={`video/${video.format || 'mp4'}`} />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">
                          {video.postTitle}
                        </h3>
                        <p className="text-orange-500 font-bold uppercase text-xs tracking-wider mt-1">
                          Xem dự án
                        </p>
                      </div>

                      {/* Hover Border */}
                      <div className="absolute inset-0 border-4 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Play Icon Badge */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 bg-orange-500 flex items-center justify-center">
                          <svg className="w-5 h-5 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Duration Badge (if you have duration data) */}
                      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-3 py-1 bg-zinc-950/80 backdrop-blur-sm">
                          <p className="text-white text-xs font-bold uppercase tracking-wider">
                            Film
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default AllVideos