import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import Pagination from '../components/Pagination'

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
    // Paginate images when page changes
    const skip = (currentPage - 1) * itemsPerPage
    const paginatedImages = allImages.slice(skip, skip + itemsPerPage)
    setImages(paginatedImages)
    setTotalPages(Math.ceil(allImages.length / itemsPerPage))
  }, [allImages, currentPage])

  const fetchAllImages = async () => {
    try {
      setLoading(true)
      // Fetch all posts to get all images
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
      
      // Extract all images from all posts
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
    <div>
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl md:text-3xl font-light text-center mb-12 uppercase tracking-[2px] text-[#001f3f]">All Images</h2>
          
          {loading ? (
            <div className="spinner"></div>
          ) : images.length === 0 ? (
            <p className="text-center text-text-light mt-8">
              No images found.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {images.map((image) => (
                  <Link key={image.id} to={`/post/${image.postId}`}>
                    <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-secondary group">
                      <img 
                        src={image.url} 
                        alt={image.postTitle}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                          {image.postTitle}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

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

