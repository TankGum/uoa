import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import { getMuxPlaybackUrl, getMuxThumbnailUrl } from '../utils/mux'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [allMedia, setAllMedia] = useState([])

  useEffect(() => {
    fetchPost()
  }, [id])

  useEffect(() => {
    if (post?.media) {
      setAllMedia(post.media)
    }
  }, [post])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await client.get(`/posts/${id}`)
      setPost(response.data)
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % allMedia.length
      : (lightboxIndex - 1 + allMedia.length) % allMedia.length
    setLightboxIndex(newIndex)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') navigateLightbox('next')
      if (e.key === 'ArrowLeft') navigateLightbox('prev')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, lightboxIndex, allMedia])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-24 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#e8bb69]/20 border-t-[#e8bb69] rounded-full mb-4"
        />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8bb69]">Loading Story</span>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 px-6">
        <div className="max-w-xl mx-auto text-center border border-white/5 p-12 backdrop-blur-sm">
          <span className="text-[#e8bb69] font-mono text-xs mb-4 block">ERROR 404</span>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-6 leading-none">
            Story Not Found
          </h2>
          <p className="text-zinc-500 mb-10 text-sm leading-relaxed">
            The project you're looking for might have been moved or removed from our archives.
          </p>
          <Link
            to="/gallery"
            className="inline-flex px-10 py-4 bg-[#e8bb69] text-zinc-950 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all duration-500"
          >
            Back to Archive
          </Link>
        </div>
      </div>
    )
  }

  const images = post.media?.filter(m => m.type === 'image') || []
  const videos = post.media?.filter(m => m.type === 'video') || []

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Editorial Header */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/5">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#e8bb69] blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-4 text-white/40 hover:text-[#e8bb69] transition-all duration-500 mb-12"
            >
              <div className="w-8 h-px bg-current group-hover:w-12 transition-all" />
              <span className="font-bold uppercase text-[10px] tracking-[0.4em]">Back to Projects</span>
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#e8bb69] animate-pulse" />
                  <span className="text-[#e8bb69] text-[10px] font-black uppercase tracking-[0.4em]">Project Showcase</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                  {post.title}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-2 flex-wrap"
              >
                {post.categories?.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-4 py-1.5 border border-white/10 text-white/60 font-black uppercase text-[9px] tracking-[0.2em] hover:border-[#e8bb69] hover:text-[#e8bb69] transition-all duration-300"
                  >
                    {cat.name}
                  </span>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:max-w-xs"
            >
              <p className="text-zinc-500 text-sm leading-relaxed italic border-l border-[#e8bb69]/30 pl-6 py-2">
                {post.description || "A cinematic journey captured through our lens, blending technical precision with artistic vision."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="mb-32">
            <div className="flex items-baseline gap-6 mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Motion
              </h2>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#e8bb69] font-mono text-xs">{String(videos.length).padStart(2, '0')} Film(s)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((media, index) => {
                const isMux = media.provider === 'mux'
                const thumbnailUrl = isMux
                  ? getMuxThumbnailUrl(media.public_id)
                  : getVideoThumbnail(media.url, media.public_id, 1)
                const mediaIndex = allMedia.findIndex(m => m.id === media.id)

                return (
                  <motion.div
                    key={media.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative aspect-video overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
                    onClick={() => openLightbox(mediaIndex)}
                  >
                    <div className="absolute inset-0 z-10 pointer-events-none border border-white/0 group-hover:border-[#e8bb69]/50 transition-all duration-500" />
                    <img
                      src={thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />

                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#e8bb69] group-hover:border-[#e8bb69] transition-all duration-500">
                        <svg className="w-6 h-6 text-white group-hover:text-zinc-950 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute bottom-6 left-6 z-20">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 block mb-1">Film Chapter</span>
                      <span className="text-white text-lg font-black uppercase tracking-tighter">0{index + 1} // Cinematography</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Images Section */}
        {images.length > 0 && (
          <div className="mb-20">
            <div className="flex items-baseline gap-6 mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Still Life
              </h2>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#e8bb69] font-mono text-xs">{String(images.length).padStart(2, '0')} Photo(s)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((media, index) => {
                const mediaIndex = allMedia.findIndex(m => m.id === media.id)
                return (
                  <motion.div
                    key={media.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
                    onClick={() => openLightbox(mediaIndex)}
                  >
                    <div className="absolute inset-0 z-10 pointer-events-none border border-white/0 group-hover:border-[#e8bb69]/50 transition-all duration-500" />
                    <img
                      src={media.url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-4">
                      <div className="h-px w-8 bg-[#e8bb69]" />
                      <span className="text-white font-black uppercase text-[10px] tracking-[0.3em]">View Frame</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && videos.length === 0 && (
          <div className="text-center py-40 border border-dashed border-white/10">
            <span className="text-[#e8bb69] font-mono text-lg block mb-4">VOID</span>
            <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] font-black">
              No media archived for this story
            </p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950 z-[10001] flex flex-col pt-[70px]"
            onClick={closeLightbox}
          >
            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 h-[70px] flex items-center justify-between px-8 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl z-10">
              <div className="flex items-center gap-6">
                <span className="text-[#e8bb69] font-mono text-sm">
                  {String(lightboxIndex + 1).padStart(2, '0')} / {String(allMedia.length).padStart(2, '0')}
                </span>
                <span className="text-white/20 h-4 w-px bg-current" />
                <span className="text-white font-black uppercase text-[10px] tracking-[0.3em]">{post.title}</span>
              </div>

              <button
                onClick={closeLightbox}
                className="group flex items-center gap-4 text-white hover:text-[#e8bb69] transition-colors"
                aria-label="Close Lightbox"
              >
                <span className="font-bold uppercase text-[10px] tracking-[0.4em]">Close</span>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#e8bb69]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              {/* Previous Button */}
              {allMedia.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                  className="absolute left-4 md:left-8 z-20 group flex items-center gap-4 text-white hover:text-[#e8bb69] transition-all"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#e8bb69] backdrop-blur-sm bg-black/20 md:bg-transparent">
                    <svg className="w-4 h-4 md:w-5 md:h-5 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </button>
              )}

              {/* Next Button */}
              {allMedia.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                  className="absolute right-4 md:right-8 z-20 group flex items-center gap-4 text-white hover:text-[#e8bb69] transition-all"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#e8bb69] backdrop-blur-sm bg-black/20 md:bg-transparent">
                    <svg className="w-4 h-4 md:w-5 md:h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              )}

              {/* Media Container */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full h-full max-w-7xl max-h-[85vh] p-4 md:p-12 flex items-center justify-center touch-pan-y"
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500;
                  if (swipe || Math.abs(offset.x) > 100) {
                    if (offset.x > 0) {
                      navigateLightbox('prev');
                    } else {
                      navigateLightbox('next');
                    }
                  }
                }}
              >
                {allMedia[lightboxIndex].type === 'image' ? (
                  <img
                    src={allMedia[lightboxIndex].url}
                    alt={post.title}
                    className="max-w-full max-h-full object-contain shadow-2xl pointer-events-none select-none"
                  />
                ) : (
                  <div className="relative w-full aspect-video max-h-full pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                      playsInline
                      crossOrigin="anonymous"
                    >
                      {allMedia[lightboxIndex].provider === 'mux' ? (
                        <source src={getMuxPlaybackUrl(allMedia[lightboxIndex].public_id)} type="application/x-mpegURL" />
                      ) : (
                        <>
                          <source src={allMedia[lightboxIndex].url} type={`video/${allMedia[lightboxIndex].format || 'mp4'}`} />
                          <source
                            src={getStreamingVideoUrl(allMedia[lightboxIndex].url, allMedia[lightboxIndex].public_id, {
                              quality: 'auto',
                              format: 'auto'
                            })}
                            type={`video/${allMedia[lightboxIndex].format || 'mp4'}`}
                          />
                        </>
                      )}
                    </video>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Scroll/Swipe Suggestion for Mobile */}
            <div className="md:hidden flex justify-center py-6 text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
              Swipe to navigate
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PostDetail
