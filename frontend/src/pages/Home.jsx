import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import CountUp from '../components/CountUp'

function Home() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)
  const servicesRef = useRef(null)
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

  const stats = [
    { number: '100+', label: 'Câu chuyện được kể' },
    { number: '50+', label: 'Wedding & Personal Projects' },
    { number: '3+', label: 'Năm làm nghề' },
    { number: '∞', label: 'Cảm hứng sáng tạo' }
  ]

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Hero Section - Editorial Style */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ea580c 0%, #f97316 25%, #fb923c 50%, #f97316 75%, #ea580c 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}
      >
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 opacity-40">
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

        {/* Diagonal grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
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

        {/* Floating geometric elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[15%] left-[10%] w-32 h-32 border-2 border-zinc-950/20 rotate-45"
            style={{
              transform: `rotate(${scrollY * 0.1}deg) translate(${scrollY * 0.05}px, ${scrollY * 0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div
            className="absolute bottom-[20%] right-[15%] w-24 h-24 border-2 border-zinc-950/20 rounded-full"
            style={{
              transform: `translate(${-scrollY * 0.03}px, ${-scrollY * 0.08}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div
            className="absolute top-[60%] right-[25%] w-16 h-16 border-2 border-zinc-950/20 rotate-12"
            style={{
              transform: `rotate(${-scrollY * 0.15}deg) translate(${scrollY * 0.07}px, ${scrollY * 0.05}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        </div>

        {/* Main Content - Asymmetric Layout */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Column - Brand & Text */}
            <div className="lg:col-span-7 space-y-8">
              {/* Brand label - Editorial style */}
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-16 bg-zinc-950/40" />
                <span
                  className="text-[10px] sm:text-xs font-bold text-zinc-950/60 uppercase tracking-[0.3em] letter-spacing-wider"
                  style={{ letterSpacing: '0.3em' }}
                >
                  ÚÒa Production
                </span>
                <div className="h-px w-16 bg-zinc-950/40" />
              </div>

              {/* Main Heading - Large, Bold, Editorial */}
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-zinc-950 leading-[0.9] tracking-tighter"
                style={{
                  fontVariationSettings: '"wght" 900',
                  textShadow: '0 0 40px rgba(0,0,0,0.1)'
                }}
              >
                <span className="block">Chúng tôi</span>
                <span className="block relative mt-2">
                  là những
                  <span
                    className="absolute -bottom-2 left-0 right-0 h-3 bg-zinc-950/15 -skew-x-12"
                    style={{ transform: 'skewX(-12deg)' }}
                  />
                </span>
                <span className="block mt-2">người kể</span>
                <span className="block">chuyện</span>
              </h1>

              {/* Subtitle - Refined typography */}
              <p className="text-lg sm:text-xl md:text-2xl text-zinc-900/90 font-medium max-w-2xl leading-relaxed mt-8">
                Bắt lấy những khoảnh khắc, tạo ra những câu chuyện, xây dựng những trải nghiệm thị giác không thể quên.
              </p>

              {/* CTA Buttons - Editorial style */}
              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  to="/gallery"
                  className="group relative px-8 py-4 bg-zinc-950 text-white font-bold text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 focus:ring-offset-orange-500 cursor-pointer"
                >
                  <span className="relative z-10">Xem dự án</span>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </Link>

                <Link
                  to="/contact"
                  className="group relative px-8 py-4 bg-transparent text-zinc-950 font-bold text-sm uppercase tracking-wider border-2 border-zinc-950 overflow-hidden transition-all duration-300 hover:bg-zinc-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 focus:ring-offset-orange-500 cursor-pointer"
                >
                  <span className="relative z-10">Liên hệ</span>
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                {/* Decorative frame */}
                <div className="absolute inset-0 border-4 border-zinc-950/20 rotate-6" />
                <div className="absolute inset-4 border-2 border-zinc-950/10 -rotate-3" />

                {/* Content area with gradient */}
                <div className="absolute inset-8 bg-gradient-to-br from-zinc-950/10 to-transparent flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl sm:text-7xl md:text-8xl font-black text-zinc-950/20">∞</div>
                    <p className="text-xs uppercase tracking-widest text-zinc-950/40 font-bold">Stories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-950/60 uppercase tracking-widest">Scroll</span>
            <svg className="w-5 h-5 text-zinc-950/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Custom Animations */}
        <style>{`
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
          <div className="mb-20">
            <div className="flex items-baseline gap-6 mb-6">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                Dự án
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500 via-orange-500/50 to-transparent mt-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProjects.map((project, index) => {
                const mediaType = project.firstMedia.type === 'image' ? 'image' : 'video'
                return (
                  <Link
                    key={project.categoryId}
                    to={`/category/${project.categoryId}`}
                    className="group relative aspect-[4/5] overflow-hidden bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 cursor-pointer"
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
                          src={getStreamingVideoUrl(project.firstMedia.url, project.firstMedia.public_id, {
                            quality: 'auto',
                            format: 'auto'
                          })}
                          poster={getVideoThumbnail(project.firstMedia.url, project.firstMedia.public_id, 1)}
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
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-4">
                        <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
                          {project.categoryName}
                        </h3>
                        <p className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em]">
                          {project.postCount} {project.postCount === 1 ? 'Project' : 'Projects'}
                        </p>
                      </div>
                    </div>

                    {/* Border accent on hover */}
                    <div className="absolute inset-0 border-2 border-orange-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />

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
          <div className="mb-20">
            <div className="flex items-baseline gap-6 mb-6">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                Đội ngũ
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500 via-orange-500/50 to-transparent mt-4" />
            </div>
            <p className="text-zinc-400 text-sm uppercase tracking-widest ml-2">Creative Minds</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900"
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
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 group-focus-within:bg-orange-500/10 transition-colors duration-300" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase mb-1 group-hover:text-orange-500 group-focus-within:text-orange-500 transition-colors duration-300">
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
              <div className="flex items-baseline gap-6 mb-8">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                  Tầm nhìn
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-500 via-orange-500/50 to-transparent mt-4" />
              </div>

              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                Chúng tôi tin vào sức mạnh của việc kể câu chuyện bằng hình ảnh để biến thương hiệu và tạo ra những ấn tượng lâu dài. Mỗi khung hình chúng tôi bắt, mỗi câu chuyện chúng tôi kể, đều được tạo ra với độ chính xác và đam mê.
              </p>
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                Từ ý tưởng đến thực hiện, chúng tôi vượt qua giới hạn sáng tạo để cung cấp công việc không chỉ đáp ứng mong đợi—mà vượt xa mong đợi.
              </p>

              <Link
                to="/about"
                className="inline-block px-8 py-4 bg-orange-500 text-zinc-950 font-bold text-sm uppercase tracking-wider hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors duration-300 cursor-pointer"
              >
                Tìm hiểu thêm
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-orange-500 absolute -top-8 -left-8 w-full opacity-20" />
              <div className="aspect-[4/5] relative z-10 border-2 border-zinc-700">
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=1000&fit=crop"
                  alt="Behind the scenes at ÚÒa Production"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Stack Effect */}
      <section
        ref={servicesRef}
        className="relative py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 -left-40 w-96 h-96 bg-orange-600 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-20">
            <div className="flex items-baseline gap-6 mb-6">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                Dịch vụ
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500 via-orange-500/50 to-transparent mt-4" />
            </div>
            <p className="text-zinc-400 text-sm uppercase tracking-widest ml-2">What We Do</p>
          </div>

          {/* Services Grid - Stack Effect */}
          <div className="grid gap-1 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const isSticky = index < 2 // First two items stick
              const serviceId = `service-${index}`
              return (
                <div
                  key={serviceId}
                  className={`
                    group relative bg-zinc-950 p-8 sm:p-10 flex flex-col justify-between min-h-[350px] overflow-hidden
                    transition-all duration-500 hover:bg-zinc-900
                    ${isSticky ? 'sticky' : ''}
                  `}
                  style={{
                    top: isSticky ? `${index * 20}px` : 'auto',
                    zIndex: services.length - index
                  }}
                >
                  {/* Background accent */}
                  <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Index - Editorial style */}
                  <div className="relative z-10 text-xs font-bold tracking-[0.3em] text-zinc-500 mb-8">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Title */}
                  <h3 className="relative z-10 text-2xl sm:text-3xl font-black uppercase leading-[1.05] text-white mb-6 transition-colors duration-300 group-hover:text-orange-500">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <div className="relative z-10 mt-auto">
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
          <div className="sticky top-32">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              Quy trình<br />Sáng tạo
            </h2>
            <div className="h-2 w-24 bg-orange-500 mb-8" />
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Chúng tôi tuân thủ quy trình làm việc chuyên nghiệp, từ khâu lên ý tưởng đến khi sản phẩm cuối cùng được hoàn thiện, đảm bảo chất lượng cao nhất cho từng dự án.
            </p>
          </div>

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`group border-l-4 p-8 transition-all duration-500 cursor-pointer ${activeProcess === index
                  ? 'border-orange-500 bg-zinc-950/40'
                  : 'border-zinc-800 bg-transparent hover:border-zinc-700'
                  }`}
                onMouseEnter={() => setActiveProcess(index)}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <span className={`text-sm font-bold tracking-[0.2em] transition-colors duration-300 ${activeProcess === index ? 'text-orange-500' : 'text-zinc-600'
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
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-orange-500">
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
      <section className="relative py-40 bg-orange-500 overflow-hidden flex items-center justify-center">
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

      {/* CTA Section - Minimal */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
            Hãy tạo ra<br />Điều gì đó<br />đáng chú ý
          </h2>
          <p className="text-xl text-white/80 font-medium mb-12 max-w-2xl mx-auto">
            Sẵn sàng mang ý tưởng của bạn đến với hiện thực? Liên hệ ngay.
          </p>
          <Link
            to="/contact"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-orange-500 text-zinc-950 font-black text-base sm:text-xl uppercase tracking-widest overflow-hidden transition-all duration-300 hover:bg-orange-400 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 cursor-pointer"
          >
            <span className="relative z-10">Bắt đầu dự án</span>
            <span className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
