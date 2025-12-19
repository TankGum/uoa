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
    // Paginate videos when page changes
    const skip = (currentPage - 1) * itemsPerPage
    const paginatedVideos = allVideos.slice(skip, skip + itemsPerPage)
    setVideos(paginatedVideos)
    setTotalPages(Math.ceil(allVideos.length / itemsPerPage))
  }, [allVideos, currentPage])

  const fetchAllVideos = async () => {
    try {
      setLoading(true)
      // Fetch all posts to get all videos
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
      
      // Extract all videos from all posts
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
    <div>
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl md:text-3xl font-light text-center mb-12 uppercase tracking-[2px] text-[#001f3f]">All Videos</h2>
          
          {loading ? (
            <div className="spinner"></div>
          ) : videos.length === 0 ? (
            <p className="text-center text-text-light mt-8">
              No videos found.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {videos.map((video) => {
                  const streamingUrl = getStreamingVideoUrl(video.url, video.public_id, {
                    quality: 'auto',
                    format: 'auto',
                    streamingProfile: 'auto',
                    flags: ['streaming_attachment']
                  })
                  const thumbnailUrl = getVideoThumbnail(video.url, video.public_id, 1)
                  
                  return (
                    <Link key={video.id} to={`/post/${video.postId}`}>
                      <div className="relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-black group">
                        <video
                          muted
                          loop
                          autoPlay
                          preload="metadata"
                          poster={thumbnailUrl || undefined}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          playsInline
                        >
                          <source src={streamingUrl} type={`video/${video.format || 'mp4'}`} />
                          <source src={video.url} type={`video/${video.format || 'mp4'}`} />
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-sm font-medium">
                            {video.postTitle}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
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

export default AllVideos

