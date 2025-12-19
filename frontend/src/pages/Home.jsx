import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'

function Home() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [postsResponse, categoriesResponse] = await Promise.all([
        client.get('/posts', { params: { status: 'published', limit: 100 } }), // Get more posts for home page
        client.get('/categories')
      ])
      // Handle both paginated response and array response (backward compatible)
      const postsData = postsResponse.data.items || postsResponse.data
      setPosts(Array.isArray(postsData) ? postsData : [])
      setCategories(categoriesResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setPosts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Group posts by category (each category is a project)
  // Show first media from first post in each category
  const getCategoryProjects = () => {
    const categoryProjects = []
    
    categories.forEach(category => {
      // Find posts that belong to this category
      const categoryPosts = posts.filter(post => 
        post.categories?.some(cat => cat.id === category.id) &&
        post.media && post.media.length > 0
      )
      
      if (categoryPosts.length > 0) {
        // Get first post with media
        const firstPost = categoryPosts[0]
        // Get featured media or first media
        const featuredMedia = firstPost.media?.find(m => m.is_featured) || firstPost.media?.[0]
        
        if (featuredMedia) {
          categoryProjects.push({
            categoryId: category.id,
            categoryName: category.name,
            firstMedia: featuredMedia,
            postCount: categoryPosts.length
          })
        }
      }
    })
    
    return categoryProjects
  }

  const categoryProjects = getCategoryProjects()

  return (
    <div className="min-h-screen">
      <section className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary to-[#2d2d2d] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="none"/><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></svg>')`
        }}></div>
        <div className="relative z-10 max-w-3xl px-5">
          <h1 className="text-4xl md:text-4xl font-light tracking-[2px] mb-4 uppercase text-[#cfb970]">Filmmaker & Photographer</h1>
          <p className="text-2xl md:text-xl font-light mb-8 opacity-90">Capturing moments, telling stories, creating art</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/gallery" className="btn btn-primary bg-[#cfb970] hover:bg-[#b8a55f] text-[#001f3f]">
              View Projects
            </Link>
            <Link to="/booking" className="btn btn-primary bg-[#cfb970] hover:bg-[#b8a55f] text-[#001f3f]">
              Book Session
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl md:text-3xl font-light text-center mb-12 uppercase tracking-[2px]">Projects</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : categoryProjects.length === 0 ? (
            <p className="text-center text-text-light">
              No projects available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryProjects.map((project) => (
                <Link 
                  key={project.categoryId} 
                  to={`/gallery?category=${project.categoryId}`}
                  className="block group"
                >
                  <div className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl aspect-[4/3]">
                    {project.firstMedia.type === 'image' ? (
                      <>
                        <img 
                          src={project.firstMedia.url} 
                          alt={project.categoryName}
                          className="w-full h-full object-cover bg-secondary transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-light text-white uppercase tracking-wide mb-2">{project.categoryName}</h3>
                          <p className="text-sm text-white/80">{project.postCount} {project.postCount === 1 ? 'post' : 'posts'}</p>
                        </div>
                      </>
                    ) : (
                      <div className="relative w-full h-full bg-black">
                        {(() => {
                          const streamingUrl = getStreamingVideoUrl(project.firstMedia.url, project.firstMedia.public_id, {
                            quality: 'auto',
                            format: 'auto',
                            streamingProfile: 'auto',
                            flags: ['streaming_attachment']
                          })
                          const thumbnailUrl = getVideoThumbnail(project.firstMedia.url, project.firstMedia.public_id, 1)
                          
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
                              >
                                <source src={streamingUrl} type={`video/${project.firstMedia.format || 'mp4'}`} />
                                <source src={project.firstMedia.url} type={`video/${project.firstMedia.format || 'mp4'}`} />
                                Your browser does not support the video tag.
                              </video>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-2xl font-light text-white uppercase tracking-wide mb-2">{project.categoryName}</h3>
                                <p className="text-sm text-white/80">{project.postCount} {project.postCount === 1 ? 'post' : 'posts'}</p>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

