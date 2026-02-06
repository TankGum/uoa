import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import { getMuxPlaybackUrl, getMuxThumbnailUrl } from '../utils/mux'
import CountUp from '../components/CountUp'

function Home() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)
  const [activeProcess, setActiveProcess] = useState(0)

  useEffect(() => {
    fetchData()

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [postsResponse, categoriesResponse] = await Promise.all([
        client.get('/posts', {
          params: { status: 'published', limit: 100 }
        }),
        client.get('/categories')
      ])

      const postsData = postsResponse.data.items || postsResponse.data
      setPosts(Array.isArray(postsData) ? postsData : [])
      setCategories(categoriesResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const getCategoryProjects = () => {
    const categoryProjects = []
    categories.forEach(category => {
      const categoryPosts = posts.filter(post =>
        post.categories?.some(cat => cat.id === category.id) &&
        post.media && post.media.length > 0
      )

      if (categoryPosts.length > 0) {
        const firstPost = categoryPosts[0]
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

  // Mock team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Laiyi',
      role: 'Creative Director',
      staticImage: '/members/static/Upright.webp',
      gifImage: '/members/gif/Upright.gif'
    },
    {
      id: 2,
      name: 'Trần Văn A',
      role: 'Lead Photographer',
      staticImage: '/members/static/Upright1.webp',
      gifImage: '/members/gif/Upright1.gif'
    },
    {
      id: 3,
      name: 'Nguyễn Văn B',
      role: 'Videographer',
      staticImage: '/members/static/Upright2.webp',
      gifImage: '/members/gif/Upright2.gif'
    },
    {
      id: 4,
      name: 'Nguyễn Văn C',
      role: 'Production Manager',
      staticImage: '/members/static/Upright3.webp',
      gifImage: '/members/gif/Upright3.gif'
    },
    {
      id: 5,
      name: 'Nguyễn Văn D',
      role: 'Art Director',
      staticImage: '/members/static/Upright.webp',
      gifImage: '/members/gif/Upright.gif'
    },
    {
      id: 6,
      name: 'Nguyễn Văn E',
      role: 'Editor',
      staticImage: '/members/static/Upright1.webp',
      gifImage: '/members/gif/Upright1.gif'
    }
  ]

  const processSteps = [
    { title: 'Concept', description: 'Nghiên cứu, Ý tưởng & Kịch bản - Đặt nền móng vững chắc cho câu chuyện, đảm bảo thông điệp được truyền tải rõ ràng và ấn tượng.' },
    { title: 'Production', description: 'Quay phim, Ánh sáng & Chỉ đạo - Biến ý tưởng thành hiện thực sống động với thiết bị hiện đại và đội ngũ chuyên nghiệp.' },
    { title: 'Post', description: 'Dựng phim, VFX & Màu sắc - Thổi hồn và cảm xúc vào từng khung hình, tạo nên sản phẩm cuối cùng hoàn hảo.' }
  ]

  const services = [
    {
      title: 'Visual Storytelling',
      description: 'Xây dựng câu chuyện bằng hình ảnh cho thương hiệu và con người',
    },
    {
      title: 'Film Production',
      description: 'Từ ý tưởng đến hậu kỳ, tạo nên những thước phim có cảm xúc',
    },
    {
      title: 'Wedding & Love Stories',
      description: 'Kể lại những câu chuyện tình yêu bằng ngôn ngữ điện ảnh',
    },
    {
      title: 'Creative Projects',
      description: 'Các dự án hình ảnh mang tính thử nghiệm và cá nhân hóa',
    }
  ]

  const manifestoKeywords = [
    { text: 'EMOTION', x: '10%', y: '20%', delay: 0 },
    { text: 'STORY', x: '60%', y: '40%', delay: 0.2 },
    { text: 'VISION', x: '20%', y: '60%', delay: 0.4 },
    { text: 'CRAFT', x: '70%', y: '15%', delay: 0.6 },
    { text: 'IMPACT', x: '45%', y: '80%', delay: 0.8 }
  ]

  const stats = [
    { number: '100+', label: 'Câu chuyện được kể' },
    { number: '50+', label: 'Wedding & Personal Projects' },
    { number: '3+', label: 'Năm làm nghề' },
    { number: '∞', label: 'Cảm hứng sáng tạo' }
  ]

  const heroVideo = {
    id: 1,
    type: 'video',
    url: 'https://stream.mux.com/vpLevFP00WhlAndl02evlfSAE00Q7IPpI4lhjlhebtmZks',
    title: 'Cinematic Motion'
  }

  // Calculate parallax values for depth effect
  const getParallaxValues = () => {
    // Extended scroll journey: 300vh
    const journeyLimit = window.innerHeight * 3
    const progress = Math.min(scrollY / journeyLimit, 1)

    // Hero fades out over the first 80% of the journey
    const heroProgress = Math.min(scrollY / (window.innerHeight * 2.5), 1)

    // Specific progress stages
    const stage1 = Math.min(scrollY / window.innerHeight, 1) // First fold
    const stage2 = Math.max(0, Math.min((scrollY - window.innerHeight) / window.innerHeight, 1)) // Second fold

    return {
      // Hero veil effect - creates the "diving through" feeling
      heroOpacity: Math.max(0, 1 - heroProgress * 1.5),
      heroScale: 1 + heroProgress * 1.2,
      heroBlur: heroProgress * 30,
      heroZ: heroProgress * 200,

      // Background moves slower (creates depth)
      bgTransform: scrollY * 0.4,
      bgHueRotate: scrollY * 0.05,

      // Lens Flare
      flareX: scrollY * 0.5,
      flareOpacity: Math.max(0, 0.4 - stage1 * 0.5),

      // Pattern fades and zooms
      patternOpacity: 0.1 * (1 - heroProgress),
      patternScale: 1 + progress * 2,

      // Kinetic Typography - subtle movements to prevent overflow
      line1X: scrollY * 0.1,
      line2X: -scrollY * 0.08,
      line3X: scrollY * 0.05,

      // Floating particles
      particlesY: -scrollY * 0.3,

      // Geometric elements move at different speeds
      geo1: {
        rotate: scrollY * 0.15,
        translateX: scrollY * 0.3,
        translateY: scrollY * 0.5,
        opacity: 1 - heroProgress
      },
      geo2: {
        translateX: -scrollY * 0.2,
        translateY: -scrollY * 0.4,
        opacity: 1 - heroProgress
      },
      geo3: {
        rotate: -scrollY * 0.3,
        translateX: scrollY * 0.4,
        translateY: -scrollY * 0.2,
        opacity: 1 - heroProgress
      },

      // Content fades and scales
      contentOpacity: 1 - heroProgress * 2,
      contentScale: 1 + heroProgress * 0.5,
      contentBlur: heroProgress * 15,

      // Scroll indicator fades fast
      scrollOpacity: 1 - stage1 * 3,

      // Sections reveal later in the journey
      sectionsOpacity: Math.max(0, (heroProgress - 0.5) * 2),
      sectionsScale: 0.9 + (heroProgress * 0.1),
      heroProgress,

      // Manifesto transformations
      manifesto: manifestoKeywords.map((_, i) => {
        const start = 0.2 + (i * 0.1)
        const end = start + 0.4
        const localProgress = Math.max(0, Math.min((heroProgress - start) / (end - start), 1))

        return {
          opacity: localProgress > 0 && localProgress < 1 ? Math.sin(localProgress * Math.PI) : 0,
          scale: 0.5 + localProgress * 4,
          z: localProgress * 500,
          blur: localProgress > 0.8 ? (localProgress - 0.8) * 50 : 0
        }
      })
    }
  }

  const parallax = getParallaxValues()

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Hero Section - Fixed Veil that reveals content behind */}
      <section
        ref={heroRef}
        className="fixed inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-20 overflow-hidden pointer-events-none"
        style={{
          opacity: parallax.heroOpacity,
          transform: `scale(${parallax.heroScale}) translateZ(${parallax.heroZ}px)`,
          filter: `blur(${parallax.heroBlur}px)`,
          zIndex: 50,
          visibility: parallax.heroOpacity > 0 ? 'visible' : 'hidden'
        }}
      >
        {/* Background layer - moves slowest */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #e8bb69 0%, #f5b134ff 25%, #eedcbaff 50%, #e8bb69 75%, #e8bb69 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
            transform: `translateY(${parallax.bgTransform}px)`,
            filter: `hue-rotate(${parallax.bgHueRotate}deg)`
          }}
        />

        {/* Floating Particles Layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translateY(${parallax.particlesY}px)` }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full blur-[1px]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                opacity: Math.random() * 0.5 + 0.2,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`
              }}
            />
          ))}
        </div>

        {/* Animated mesh gradient background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            transform: `translateY(${parallax.bgTransform * 0.7}px)`
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(0,0,0,0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)
              `
            }}
          />
        </div>

        {/* Diagonal grid pattern - zooms and fades */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: parallax.patternOpacity,
            transform: `scale(${parallax.patternScale}) translateY(${parallax.bgTransform * 0.3}px)`,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.3) 2px,
              rgba(0,0,0,0.3) 4px
            )`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Lens Flare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden"
          style={{ opacity: parallax.flareOpacity }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]"
            style={{
              background: `radial-gradient(circle at calc(50% + ${parallax.flareX}px) 50%, rgba(251, 146, 60, 0.15) 0%, transparent 40%)`
            }}
          />
        </div>

        {/* Main Content - Centered Cinematic Focus */}
        <div
          className="relative z-10 max-w-5xl mx-auto w-full transition-all duration-100 px-4"
          style={{
            transform: `scale(${parallax.contentScale})`,
            opacity: parallax.contentOpacity,
            filter: `blur(${parallax.contentBlur}px)`
          }}
        >
          <div className="flex flex-col items-center text-center pointer-events-auto">
            {/* Top Brand Label */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 mb-12"
            >
              <div className="h-px w-8 sm:w-16 bg-zinc-950/20" />
              <span className="text-[10px] sm:text-xs font-bold text-zinc-950 uppercase tracking-[0.5em]">
                ÚÒa Production
              </span>
              <div className="h-px w-8 sm:w-16 bg-zinc-950/20" />
            </motion.div>

            {/* The Main Stage - Central Video */}
            <div className="relative w-full aspect-video sm:aspect-[16/9] lg:aspect-[21/9] max-w-6xl mx-auto">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[#e8bb69] blur-[150px] opacity-20 -z-10" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full overflow-hidden bg-zinc-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-white/10 group"
              >
                <video
                  src={heroVideo.url}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />

                {/* Minimal Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950/60" />

                {/* Floating Content within Video */}
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-[#e8bb69] uppercase tracking-widest block mb-1">Current Focus</span>
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">{heroVideo.title}</h2>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Cinematic Reels // 2024</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Subtle CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-6 mt-16 items-center"
            >
              <Link
                to="/gallery"
                className="group flex items-center gap-4 text-zinc-950 hover:text-white transition-colors"
              >
                <span className="text-xs font-black uppercase tracking-[0.3em]">Khám phá Portfolio</span>
                <div className="w-12 h-12 rounded-full border border-zinc-950/20 group-hover:bg-zinc-950 group-hover:border-zinc-950 flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </Link>

              <div className="h-px w-12 bg-zinc-950/10 hidden sm:block" />

              <Link
                to="/contact"
                className="text-[10px] font-bold text-zinc-950/60 uppercase tracking-[0.3em] hover:text-[#e8bb69] transition-colors"
              >
                Hợp tác sản xuất
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - fades out */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-300 pointer-events-auto"
          aria-hidden="true"
          style={{
            opacity: parallax.scrollOpacity
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-950/60 uppercase tracking-widest">Scroll</span>
            <svg className="w-5 h-5 text-zinc-950/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Custom Animations */}
        <style>{`
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0) translateX(0); }
          }
          
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </section>

      {/* Spacer to allow scrolling - Increased for a longer journey */}
      <div className="h-[300vh]" />

      {/* Manifesto Layer - Shown during transition */}
      <div
        className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden"
        style={{ visibility: parallax.heroProgress > 0.1 && parallax.heroProgress < 0.9 ? 'visible' : 'hidden' }}
      >
        {manifestoKeywords.map((kw, i) => (
          <div
            key={i}
            className="absolute font-black text-white mix-blend-overlay tracking-[0.2em] whitespace-nowrap transition-all duration-75"
            style={{
              left: kw.x,
              top: kw.y,
              opacity: parallax.manifesto[i].opacity * 0.4,
              transform: `scale(${parallax.manifesto[i].scale}) translateZ(${parallax.manifesto[i].z}px)`,
              filter: `blur(${parallax.manifesto[i].blur}px)`,
              fontSize: '8vw'
            }}
          >
            {kw.text}
          </div>
        ))}
      </div>

      {/* Content Sections - Revealed behind the hero veil */}
      <div
        className="relative z-10 transition-all duration-300"
        style={{
          opacity: parallax.sectionsOpacity,
          transform: `scale(${parallax.sectionsScale})`
        }}
      >
        {/* Projects Section - Asymmetric Grid */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950">
          {/* Subtle background texture */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative max-w-7xl mx-auto">
            {/* Section Header - Editorial style */}
            <div className="sticky top-0 z-10 bg-zinc-950 py-4 sm:static sm:mb-20 sm:py-0">
              <div className="flex items-baseline gap-6 mb-6">
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                  Dự án
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#e8bb69] via-[#e8bb69]/50 to-transparent mt-4" />
              </div>
              <p className="text-zinc-400 text-sm uppercase tracking-widest ml-2">Featured Work</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-zinc-900 animate-pulse" />
                ))}
              </div>
            ) : categoryProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-zinc-500 font-medium">Không có dự án nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {categoryProjects.map((project, index) => {
                  const mediaType = project.firstMedia.type === 'image' ? 'image' : 'video'
                  return (
                    <Link
                      key={project.categoryId}
                      to={`/post/${project.firstMedia.post_id}`}
                      className="group relative aspect-[4/5] overflow-hidden bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#e8bb69] focus:ring-offset-2 focus:ring-offset-zinc-950 cursor-pointer"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                      aria-label={`View ${project.categoryName} projects`}
                    >
                      {/* Image/Video */}
                      <div className="absolute inset-0">
                        {mediaType === 'image' ? (
                          <img
                            src={project.firstMedia.url}
                            alt={`${project.categoryName} project preview`}
                            className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <video
                            src={project.firstMedia.provider === 'mux'
                              ? getMuxPlaybackUrl(project.firstMedia.public_id)
                              : getStreamingVideoUrl(project.firstMedia.url, project.firstMedia.public_id, {
                                quality: 'auto',
                                format: 'auto'
                              })}
                            poster={project.firstMedia.provider === 'mux'
                              ? getMuxThumbnailUrl(project.firstMedia.public_id)
                              : getVideoThumbnail(project.firstMedia.url, project.firstMedia.public_id, 1)}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            aria-label={`Video preview for ${project.categoryName}`}
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => {
                              e.target.pause()
                              e.target.currentTime = 0
                            }}
                          />
                        )}
                      </div>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                      {/* Content */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-end">
                        <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-4">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                            {project.categoryName}
                          </h3>
                          <p className="text-[#e8bb69] font-bold text-xs uppercase tracking-[0.2em]">
                            {project.postCount} {project.postCount === 1 ? 'post' : 'posts'}
                          </p>
                        </div>
                      </div>

                      {/* Border accent on hover */}
                      <div className="absolute inset-0 border-2 border-[#e8bb69] opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />

                      {/* Number overlay - Editorial style */}
                      <div className="absolute top-4 right-4 text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-300">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Team Section - Editorial Grid */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-zinc-900">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="sticky top-0 z-10 bg-zinc-900 py-4 sm:static sm:mb-20 sm:py-0">
              <div className="flex items-baseline gap-6 mb-6">
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                  Đội ngũ
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#e8bb69] via-[#e8bb69]/50 to-transparent mt-4" />
              </div>
              <p className="text-zinc-400 text-sm uppercase tracking-widest ml-2">Creative Minds</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="group cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${member.name}, ${member.role}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-800 mb-4">
                    <img
                      src={member.staticImage}
                      alt={`${member.name}, ${member.role}`}
                      className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                      loading="lazy"
                    />
                    <img
                      src={member.gifImage}
                      alt={`${member.name} animated`}
                      className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#e8bb69]/0 group-hover:bg-[#e8bb69]/10 group-focus-within:bg-[#e8bb69]/10 transition-colors duration-300" />
                  </div>
                  <h3 className="text-white font-bold text-sm uppercase mb-1 group-hover:text-[#e8bb69] group-focus-within:text-[#e8bb69] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section - Split Layout */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="sticky top-0 z-10 bg-zinc-900 py-4 sm:static sm:mb-20 sm:py-0">
                  <div className="flex items-baseline gap-6 mb-6">
                    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                      Tầm nhìn
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#e8bb69] via-[#e8bb69]/50 to-transparent mt-4" />
                  </div>
                  <p className="text-zinc-400 text-sm uppercase tracking-widest ml-2">Our Vision</p>
                </div>

                <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                  Chúng tôi tin vào sức mạnh của việc kể câu chuyện bằng hình ảnh để biến thương hiệu và tạo ra những ấn tượng lâu dài. Mỗi khung hình chúng tôi bắt, mỗi câu chuyện chúng tôi kể, đều được tạo ra với độ chính xác và đam mê.
                </p>
                <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                  Từ ý tưởng đến thực hiện, chúng tôi vượt qua giới hạn sáng tạo để cung cấp công việc không chỉ đáp ứng mong đợi—mà vượt xa mong đợi.
                </p>

                <Link
                  to="/about"
                  className="inline-block px-8 py-4 bg-[#e8bb69] text-zinc-950 font-bold text-sm uppercase tracking-wider hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-[#e8bb69] focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors duration-300 cursor-pointer"
                >
                  Tìm hiểu thêm
                </Link>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] bg-[#e8bb69] absolute -top-8 -left-8 w-full" />
                <div className="aspect-[4/5] relative z-10 border-2 border-zinc-700">
                  <img
                    src="https://scontent-dus1-1.xx.fbcdn.net/v/t39.30808-6/559808500_1386742949704907_7906766411868199157_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=f727a1&_nc_ohc=SluvQiombSQQ7kNvwEyq-TT&_nc_oc=AdkjmLCVXJ4nciGi1B4SLNvOfmZ1Kpqktwfh1JOQjrrQ6et-IhBHZwLxKhZ3htMRLIc&_nc_zt=23&_nc_ht=scontent-dus1-1.xx&_nc_gid=3c51OJorc5d54v3F4pTNig&oh=00_Afup3RL5EWXPaCToSR1NzC4L8TRd7OxmcJu3IzXCFVh5yQ&oe=6989C48B"
                    alt="Behind the scenes at ÚÒa Production"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Modern Editorial Grid */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950">
          <div className="relative max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="sticky top-0 z-10 bg-zinc-950 py-4 sm:static sm:mb-20 sm:py-0">
              <div className="flex items-baseline gap-6 mb-6">
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                  Dịch vụ
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#e8bb69] via-[#e8bb69]/50 to-transparent mt-4" />
              </div>
              <p className="text-zinc-400 text-sm uppercase tracking-widest ml-2">What We Do</p>
            </div>

            {/* Services Grid */}
            <div className="grid gap-1 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => {
                const serviceId = `service-${index}`
                return (
                  <div
                    key={serviceId}
                    className="group relative bg-zinc-900 p-8 sm:p-10 flex flex-col justify-between min-h-[350px] overflow-hidden transition-all duration-500 hover:bg-zinc-900"
                  >
                    {/* Background accent */}
                    <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#e8bb69]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Index - Editorial style */}
                    <div className="relative text-xs font-bold tracking-[0.3em] text-zinc-500 mb-8">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Title */}
                    <h3 className="relative text-2xl sm:text-3xl font-black uppercase leading-[1.05] text-white mb-6 transition-colors duration-300 group-hover:text-[#e8bb69]">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <div className="relative mt-auto">
                      <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-[90%]">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 text-zinc-500">
                        <span className="w-10 h-px bg-current" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process Section - Interactive Accordion */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-zinc-900 border-t border-zinc-950/50">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
            <div className="">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
                Quy trình<br />Sáng tạo
              </h2>
              <div className="h-2 w-24 bg-[#e8bb69] mb-8" />
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                Chúng tôi tuân thủ quy trình làm việc chuyên nghiệp, từ khâu lên ý tưởng đến khi sản phẩm cuối cùng được hoàn thiện, đảm bảo chất lượng cao nhất cho từng dự án.
              </p>
            </div>

            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`group border-l-4 p-8 transition-all duration-500 cursor-pointer ${activeProcess === index
                    ? 'border-[#e8bb69] bg-zinc-950/40'
                    : 'border-zinc-800 bg-transparent hover:border-zinc-700'
                    }`}
                  onMouseEnter={() => setActiveProcess(index)}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className={`text-sm font-bold tracking-[0.2em] transition-colors duration-300 ${activeProcess === index ? 'text-[#e8bb69]' : 'text-zinc-600'
                      }`}>
                      PHASE 0{index + 1}
                    </span>
                  </div>
                  <h3 className={`text-3xl font-black uppercase tracking-tight mb-4 transition-colors duration-300 ${activeProcess === index ? 'text-white' : 'text-zinc-500'
                    }`}>
                    {step.title}
                  </h3>
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${activeProcess === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Bold Numbers */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#e8bb69]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat) => {
                const statId = `stat-${stat.label}`
                return (
                  <div
                    key={statId}
                    className="text-center"
                  >
                    <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-zinc-950 mb-4 leading-none">
                      {stat.number === '∞' ? (
                        <>{stat.number}</>
                      ) : (
                        <CountUp
                          from={0}
                          to={stat.number}
                          separator=","
                          direction="up"
                          duration={1}
                          className="count-up-text"
                          startCounting={false}
                        />
                      )}
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Kinetic Manifesto - Bold Typography */}
        <section className="relative py-40 bg-[#e8bb69] overflow-hidden flex items-center justify-center">
          {/* Noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          <div className="relative z-10 max-w-full px-4 text-center">
            <div className="overflow-hidden">
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-zinc-950 uppercase leading-[0.85] tracking-tighter">
                <span className="block" style={{ transform: `translateX(0px)` }}>We Don't Just</span>
                <span className="block" style={{ transform: `translateX(0px)` }}>Shoot Video.</span>
                <span className="block mt-4 text-white selection:bg-black selection:text-white relative inline-block">
                  <span className="relative z-10">We Capture Souls</span>
                  <div className="absolute -inset-2 bg-zinc-950 -skew-y-2 z-0 transform scale-105" />
                </span>
              </h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home