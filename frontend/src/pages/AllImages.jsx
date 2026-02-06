import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import Pagination from '../components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'

function AllImages() {
  const [allImages, setAllImages] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 24

  useEffect(() => {
    fetchAllImages()
  }, [])

  useEffect(() => {
    const skip = (currentPage - 1) * itemsPerPage
    const paginatedImages = allImages.slice(skip, skip + itemsPerPage)
    setImages(paginatedImages)
    setTotalPages(Math.ceil(allImages.length / itemsPerPage))
  }, [allImages, currentPage])

  const fetchAllImages = async () => {
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

      const extractedImages = allPosts.flatMap(post =>
        (post.media?.filter(m => m.type === 'image') || []).map(image => ({
          ...image,
          postId: post.id,
          postTitle: post.title
        }))
      )

      setAllImages(extractedImages)
    } catch (error) {
      console.error('Error fetching images:', error)
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
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#e8bb69] font-bold">Stills</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                Thư viện<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8bb69] to-[#cfb970]">Hình ảnh</span>
              </h1>
            </div>
            <div className="md:max-w-md text-right md:text-left">
              <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic border-r-4 border-[#e8bb69] pr-6 md:border-r-0 md:border-l-4 md:pl-6">
                Mỗi khung hình nói một câu chuyện, mỗi hình ảnh bắt trọn một khoảnh khắc chuyển động của thời gian.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#e8bb69] opacity-[0.02] -skew-x-12 translate-x-1/2" />
        <div className="absolute top-20 left-10 text-[20vw] font-black text-white opacity-[0.01] pointer-events-none select-none uppercase">
          Stills
        </div>
      </section>

      {/* Stats & Header Section */}
      <section className="bg-zinc-950 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-1">Trạng thái</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                Toàn bộ thư viện
              </h2>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-white leading-none tracking-tighter select-none">
                {allImages.length}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#e8bb69] font-bold mt-1">IMAGES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Images Grid Content */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-[#e8bb69] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                Thư viện trống
              </h3>
              <p className="text-zinc-500 mb-10 max-w-sm mx-auto font-medium">
                Hiện tại chưa có hình ảnh nào được tải lên hệ thống.
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence>
                  {images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % 12) * 0.05 }}
                      layout
                    >
                      <Link
                        to={`/post/${image.postId}`}
                        className="group block relative aspect-[3/4] overflow-hidden bg-zinc-900 overflow-hidden"
                        aria-label={`View project: ${image.postTitle}`}
                      >
                        {/* Image */}
                        <img
                          src={image.url}
                          alt={image.postTitle}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                          loading="lazy"
                        />

                        {/* Minimal Overlay - Shows only on hover */}
                        <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                          <div className="flex items-center gap-3 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="h-px w-8 bg-[#e8bb69]" />
                            <span className="text-[10px] font-bold text-[#e8bb69] tracking-widest uppercase truncate">{image.postTitle}</span>
                          </div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                            Xem dự án
                          </h3>
                        </div>

                        {/* Editorial Border Overlay */}
                        <div className="absolute inset-0 border-[1px] border-white/5 group-hover:border-[#e8bb69]/30 transition-colors duration-500" />

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-[#e8bb69]/50 transition-all duration-500" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/0 group-hover:border-[#e8bb69]/50 transition-all duration-500" />
                      </Link>
                    </motion.div>
                  ))}
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

export default AllImages