import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import { getMuxPlaybackUrl, getMuxThumbnailUrl } from '../utils/mux'
import Pagination from '../components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#e8bb69] selection:text-zinc-950 pt-20">
      {/* Hero Section - Editorial style */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#e8bb69]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#e8bb69] font-bold">Motion</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                Thư viện<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8bb69] to-[#cfb970]">Phim</span>
              </h1>
            </div>
            <div className="md:max-w-md text-right md:text-left">
              <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic border-r-4 border-[#e8bb69] pr-6 md:border-r-0 md:border-l-4 md:pl-6">
                Nơi những chuyển động hội tụ thành câu chuyện, và mỗi thước phim là một tác phẩm nghệ thuật.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#e8bb69] opacity-[0.02] -skew-x-12 translate-x-1/2" />
        <div className="absolute top-20 left-10 text-[20vw] font-black text-white opacity-[0.01] pointer-events-none select-none uppercase">
          Motion
        </div>
      </section>

      {/* Stats & Header Section */}
      <section className="bg-zinc-950 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-1">Trạng thái</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                Toàn bộ thư viện phim
              </h2>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-white leading-none tracking-tighter select-none">
                {allVideos.length}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#e8bb69] font-bold mt-1">FILMS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid Content */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-[#e8bb69] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                Thư viện trống
              </h3>
              <p className="text-zinc-500 mb-10 max-w-sm mx-auto font-medium">
                Hiện tại chưa có thước phim nào được tải lên hệ thống.
              </p>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-4 bg-white text-zinc-950 px-8 py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-[#e8bb69] transition-colors duration-500"
              >
                Trở lại Gallery
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              >
                <AnimatePresence>
                  {videos.map((video, index) => {
                    const isMux = video.provider === 'mux'
                    const streamingUrl = isMux
                      ? getMuxPlaybackUrl(video.public_id)
                      : getStreamingVideoUrl(video.url, video.public_id, {
                        quality: 'auto',
                        format: 'auto'
                      })
                    const thumbnailUrl = isMux
                      ? getMuxThumbnailUrl(video.public_id)
                      : getVideoThumbnail(video.url, video.public_id, 1)

                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index % 12) * 0.05 }}
                        layout
                      >
                        <Link
                          to={`/post/${video.postId}`}
                          className="group block relative cursor-pointer"
                          aria-label={`View project: ${video.postTitle}`}
                        >
                          {/* Video Container - Editorial 16:9 style for film gallery */}
                          <div className="relative aspect-video overflow-hidden bg-zinc-900 mb-6">
                            <video
                              preload="metadata"
                              poster={thumbnailUrl || undefined}
                              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                              playsInline
                              crossOrigin="anonymous"
                            >
                              <source src={streamingUrl} type={isMux ? 'application/x-mpegURL' : `video/${video.format || 'mp4'}`} />
                              <source src={video.url} type={`video/${video.format || 'mp4'}`} />
                            </video>

                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-colors duration-500" />

                            {/* Inner Overlay Border */}
                            <div className="absolute inset-0 border-[12px] border-zinc-950/0 group-hover:border-zinc-950/20 transition-all duration-500" />

                            {/* Play Button Indicator */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                              <div className="w-16 h-16 rounded-full bg-[#e8bb69] flex items-center justify-center shadow-2xl">
                                <svg className="w-6 h-6 text-zinc-950 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-[#e8bb69] tracking-[0.2em]">{String(index + 1).padStart(2, '0')}</span>
                              <div className="h-px w-8 bg-zinc-800" />
                              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase truncate max-w-[200px]">{video.postTitle}</span>
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-[#e8bb69] transition-colors duration-300 leading-none">
                              Xem thước phim
                            </h3>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>

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