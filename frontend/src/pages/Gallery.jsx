import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import Pagination from '../components/Pagination'

function Projects() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
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
    if (categories.length > 0) {
      fetchPosts()
    }
  }, [selectedCategory, categories, currentPage])

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
    ? categories.find(cat => cat.id === selectedCategory || cat.id.toString() === selectedCategory)?.name 
    : 'All Projects'

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
            Dự án
          </h1>
          <div className="h-1 w-32 bg-zinc-950 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-zinc-900 font-medium max-w-2xl mx-auto">
            Khám phá các dự án của chúng tôi trong các danh mục khác nhau
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 px-6 bg-zinc-900 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === null 
                  ? 'bg-orange-500 text-zinc-950 shadow-lg' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:text-orange-500'
              }`}
              onClick={() => {
                setSelectedCategory(null)
                window.history.pushState({}, '', '/gallery')
              }}
            >
              Tất cả
            </button>
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id || selectedCategory === category.id.toString()
              return (
                <button
                  key={category.id}
                  className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                    isSelected
                      ? 'bg-orange-500 text-zinc-950 shadow-lg' 
                      : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:text-orange-500'
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    window.history.pushState({}, '', `/gallery?category=${category.id}`)
                  }}
                >
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Current Category Display */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
              {selectedCategoryName}
            </h2>
            <div className="h-1 w-24 bg-orange-500"></div>
            {total > 0 && (
              <p className="text-zinc-400 mt-4 text-sm uppercase tracking-wider">
                {total} {total === 1 ? 'Dự án' : 'Dự án'} tìm thấy
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {postsWithFirstMedia.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {postsWithFirstMedia.map((post) => (
                      <Link 
                        key={post.id} 
                        to={`/post/${post.id}`} 
                        className="group relative aspect-square overflow-hidden bg-zinc-900"
                      >
                        {/* Media */}
                        <div className="absolute inset-0">
                          {post.firstMedia.type === 'image' ? (
                            <img 
                              src={post.firstMedia.url} 
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            (() => {
                              const streamingUrl = getStreamingVideoUrl(post.firstMedia.url, post.firstMedia.public_id, {
                                quality: 'auto',
                                format: 'auto',
                                streamingProfile: 'auto',
                                flags: ['streaming_attachment']
                              })
                              const thumbnailUrl = getVideoThumbnail(post.firstMedia.url, post.firstMedia.public_id, 1)
                              
                              return (
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
                                    if (videoEl.src !== post.firstMedia.url) {
                                      videoEl.src = post.firstMedia.url
                                      videoEl.load()
                                    }
                                  }}
                                >
                                  <source src={post.firstMedia.url} type={`video/${post.firstMedia.format || 'mp4'}`} />
                                  <source src={streamingUrl} type={`video/${post.firstMedia.format || 'mp4'}`} />
                                  Your browser does not support the video tag.
                                </video>
                              )
                            })()
                          )}
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                            {post.title}
                          </h3>
                          {post.categories && post.categories.length > 0 && (
                            <p className="text-orange-500 font-bold uppercase text-xs tracking-wider">
                              {post.categories.map(cat => cat.name).join(' • ')}
                            </p>
                          )}
                        </div>

                        {/* Hover Border */}
                        <div className="absolute inset-0 border-4 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Media Type Badge */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-3 py-1 bg-orange-500 text-zinc-950 text-xs font-bold uppercase tracking-wider">
                            {post.firstMedia.type}
                          </div>
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
                  <div className="text-6xl mb-6">📁</div>
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
                      className="px-8 py-4 bg-orange-500 text-zinc-950 font-bold text-sm uppercase tracking-wide hover:bg-orange-400 transition-colors"
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