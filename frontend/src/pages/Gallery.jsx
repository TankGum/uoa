import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import { getMuxPlaybackUrl, getMuxThumbnailUrl } from '../utils/mux'
import Pagination from '../components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'

function Projects() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const itemsPerPage = 12

  useEffect(() => {
    fetchCategories()
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await client.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const skip = (currentPage - 1) * itemsPerPage
      const params = {
        status: 'published',
        skip,
        limit: itemsPerPage
      }
      if (selectedCategory) {
        params.category_id = selectedCategory
      }
      const response = await client.get('/posts', { params })
      setPosts(response.data.items || response.data)
      if (response.data.total !== undefined) {
        setTotal(response.data.total)
        setTotalPages(response.data.total_pages)
      } else {
        setTotal(response.data.length)
        setTotalPages(Math.ceil(response.data.length / itemsPerPage))
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const postsWithFirstMedia = posts
    .filter(post => post.media && post.media.length > 0)
    .map(post => ({
      ...post,
      firstMedia: post.media.find(m => m.is_featured) || post.media[0]
    }))

  const selectedCategoryName = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory || cat.id.toString() === selectedCategory)?.name || 'Dự án'
    : 'Tất cả dự án'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#e8bb69] selection:text-zinc-950 pt-20">
      {/* Hero Section - Editorial style */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#e8bb69]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#e8bb69] font-bold">Archives</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                Dự án<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8bb69] to-[#cfb970]">Sáng tạo</span>
              </h1>
            </div>
            <div className="md:max-w-md text-right md:text-left">
              <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic border-r-4 border-[#e8bb69] pr-6 md:border-r-0 md:border-l-4 md:pl-6">
                Tuyển tập những khoảnh khắc chuyển động và câu chuyện hình ảnh được chế tác tỉ mỉ.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#e8bb69] opacity-[0.02] -skew-x-12 translate-x-1/2" />
        <div className="absolute top-20 left-10 text-[20vw] font-black text-white opacity-[0.01] pointer-events-none select-none uppercase">
          Work
        </div>
      </section>

      {/* Categories Filter - Scalable Grid Style */}
      <section className="bg-zinc-950 border-y border-white/5 relative z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-8 gap-6">
            {/* Active Category Info */}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-2 whitespace-nowrap">Đang xem</span>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight break-words">
                {selectedCategoryName}
              </h2>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-4 group cursor-pointer focus:outline-none self-end md:self-center"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-300 group-hover:text-[#e8bb69] transition-colors">
                {isFilterOpen ? 'Đóng bộ lọc' : 'Khám phá danh mục'}
              </span>
              <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-[#e8bb69] ${isFilterOpen ? 'rotate-45' : ''}`}>
                <div className="relative w-4 h-4">
                  <span className="absolute top-1/2 left-0 w-full h-0.5 bg-white group-hover:bg-[#e8bb69] -translate-y-1/2" />
                  <span className="absolute top-0 left-1/2 w-0.5 h-full bg-white group-hover:bg-[#e8bb69] -translate-x-1/2" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Categories Grid Overlay */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden bg-zinc-900/50 backdrop-blur-xl border-t border-white/5"
            >
              <div className="max-w-7xl mx-auto px-6 py-16 text-left">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                  <button
                    className={`group focus:outline-none cursor-pointer min-w-0 text-left`}
                    onClick={() => {
                      setSelectedCategory(null)
                      setIsFilterOpen(false)
                      window.history.pushState({}, '', '/gallery')
                    }}
                  >
                    <div className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mb-2 group-hover:text-[#e8bb69] transition-colors">00</div>
                    <div className={`text-sm font-bold uppercase tracking-widest transition-all break-words line-clamp-2 ${selectedCategory === null ? 'text-[#e8bb69] pl-4 border-l-2 border-[#e8bb69]' : 'text-zinc-300 group-hover:text-white group-hover:pl-2'}`}>
                      Tất cả dự án
                    </div>
                  </button>

                  {categories.map((category, index) => {
                    const isSelected = selectedCategory === category.id || selectedCategory === category.id.toString()
                    return (
                      <button
                        key={category.id}
                        className={`group focus:outline-none cursor-pointer min-w-0 text-left`}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setIsFilterOpen(false)
                          window.history.pushState({}, '', `/gallery?category=${category.id}`)
                        }}
                      >
                        <div className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mb-2 group-hover:text-[#e8bb69] transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className={`text-sm font-bold uppercase tracking-widest transition-all break-words line-clamp-2 ${isSelected ? 'text-[#e8bb69] pl-4 border-l-2 border-[#e8bb69]' : 'text-zinc-300 group-hover:text-white group-hover:pl-2'}`}>
                          {category.name}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Projects Grid Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Indicator */}
          <div className="flex items-baseline gap-4 mb-16">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              {selectedCategoryName}
            </h2>
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {total} RESULTS
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-[#e8bb69] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {postsWithFirstMedia.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {postsWithFirstMedia.map((post, index) => (
                      <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        className="group block relative cursor-pointer"
                        aria-label={`View project: ${post.title}`}
                      >
                        {/* Media Container with 4:5 aspect ratio (Editorial style) */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 mb-6">
                          {post.firstMedia.type === 'image' ? (
                            <img
                              src={post.firstMedia.url}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            (() => {
                              const isMux = post.firstMedia.provider === 'mux'
                              const streamingUrl = isMux
                                ? getMuxPlaybackUrl(post.firstMedia.public_id)
                                : getStreamingVideoUrl(post.firstMedia.url, post.firstMedia.public_id, {
                                  quality: 'auto',
                                  format: 'auto'
                                })
                              const thumbnailUrl = isMux
                                ? getMuxThumbnailUrl(post.firstMedia.public_id)
                                : getVideoThumbnail(post.firstMedia.url, post.firstMedia.public_id, 1)

                              return (
                                <video
                                  muted
                                  loop
                                  autoPlay
                                  preload="metadata"
                                  poster={thumbnailUrl || undefined}
                                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                  playsInline
                                  crossOrigin="anonymous"
                                >
                                  <source src={streamingUrl} type={isMux ? 'application/x-mpegURL' : `video/${post.firstMedia.format || 'mp4'}`} />
                                  <source src={post.firstMedia.url} type={`video/${post.firstMedia.format || 'mp4'}`} />
                                </video>
                              )
                            })()
                          )}

                          {/* Inner Overlay Border */}
                          <div className="absolute inset-0 border-[12px] border-zinc-950/0 group-hover:border-zinc-950/20 transition-all duration-500" />

                          {/* Floating Badge (Editorial Style) */}
                          <div className="absolute top-0 right-0 p-4 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-expo">
                            <div className="bg-[#e8bb69] text-zinc-950 text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1">
                              {post.firstMedia.type}
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#e8bb69] tracking-[0.2em]">{String(index + 1).padStart(2, '0')}</span>
                            <div className="h-px w-8 bg-zinc-800" />
                          </div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#e8bb69] transition-colors duration-300 leading-none">
                            {post.title}
                          </h3>
                          {post.categories && post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {post.categories.map(cat => (
                                <span key={cat.id} className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-white/10 px-2 py-1">
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
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
              ) : (
                <div className="text-center py-20">
                  <div className="mb-6 flex justify-center">
                    <svg className="w-16 h-16 text-[#e8bb69]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                    Không tìm thấy dự án
                  </h3>
                  <p className="text-zinc-400 mb-8">
                    {selectedCategory
                      ? 'Hãy chọn một danh mục khác hoặc xem tất cả dự án.'
                      : 'Không có dự án nào khả dụng tại thời điểm hiện tại.'}
                  </p>
                  {selectedCategory && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        window.history.pushState({}, '', '/gallery')
                      }}
                      className="px-8 py-4 bg-[#e8bb69] text-zinc-950 font-bold text-sm uppercase tracking-wide hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-[#e8bb69] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors cursor-pointer"
                    >
                      Xem tất cả dự án
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Projects