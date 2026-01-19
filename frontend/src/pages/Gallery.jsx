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
    // Check if category is in URL params
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
    // Reset to page 1 when category changes
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
      setPosts(response.data.items || response.data) // Support both old and new format
      if (response.data.total !== undefined) {
        setTotal(response.data.total)
        setTotalPages(response.data.total_pages)
      } else {
        // Fallback for old format
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

  // Show posts with their featured media or first media
  // Each post represents a collection of media within a category/project
  const postsWithFirstMedia = posts
    .filter(post => post.media && post.media.length > 0)
    .map(post => ({
      ...post,
      // Get featured media if exists, otherwise first media
      firstMedia: post.media.find(m => m.is_featured) || post.media[0]
    }))

  return (
    <div>
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl md:text-3xl font-light text-center mb-12 uppercase tracking-[2px] text-[#001f3f]">Projects</h2>
          
          {categories.length > 0 && (
            <div className="flex gap-4 justify-center flex-wrap mb-12">
              <button
                className={`px-5 py-2 rounded-full border-2 transition-all duration-300 text-sm ${
                  selectedCategory === null 
                    ? 'bg-[#cfb970] text-[#001f3f] border-[#001f3f]' 
                    : 'bg-white text-[#001f3f] border-[#001f3f] hover:border-[#cfb970] hover:text-[#cfb970]'
                }`}
                onClick={() => {
                  setSelectedCategory(null)
                  window.history.pushState({}, '', '/gallery')
                }}
              >
                All
              </button>
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id || selectedCategory === category.id.toString()
                return (
                  <button
                    key={category.id}
                    className={`px-5 py-2 rounded-full border-2 transition-all duration-300 text-sm ${
                      isSelected
                        ? 'bg-[#cfb970] text-[#001f3f] border-[#001f3f]' 
                        : 'bg-white text-[#001f3f] border-[#001f3f] hover:border-[#cfb970] hover:text-[#cfb970]'
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
          )}

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              {/* Posts Grid - Mixed Images and Videos */}
              {postsWithFirstMedia.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {postsWithFirstMedia.map((post) => (
                      <Link key={post.id} to={`/post/${post.id}`} className="block group">
                        <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-secondary shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                          {post.firstMedia.type === 'image' ? (
                            <>
                              <img 
                                src={post.firstMedia.url} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white font-medium text-sm mb-1">{post.title}</h3>
                                {post.categories && post.categories.length > 0 && (
                                  <p className="text-white/80 text-xs">
                                    {post.categories.map(cat => cat.name).join(', ')}
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              {(() => {
                                const streamingUrl = getStreamingVideoUrl(post.firstMedia.url, post.firstMedia.public_id, {
                                  quality: 'auto',
                                  format: 'auto',
                                  streamingProfile: 'auto',
                                  flags: ['streaming_attachment']
                                })
                                const thumbnailUrl = getVideoThumbnail(post.firstMedia.url, post.firstMedia.public_id, 1)
                                
                                return (
                                  <>
                                    <video
                                      muted
                                      loop
                                      autoPlay
                                      preload="metadata"
                                      poster={thumbnailUrl || undefined}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <h3 className="text-white font-medium text-sm mb-1">{post.title}</h3>
                                      {post.categories && post.categories.length > 0 && (
                                        <p className="text-white/80 text-xs">
                                          {post.categories.map(cat => cat.name).join(', ')}
                                        </p>
                                      )}
                                    </div>
                                  </>
                                )
                              })()}
                            </>
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
                <p className="text-center text-text-light mt-8">
                  No posts found in this category.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Projects

