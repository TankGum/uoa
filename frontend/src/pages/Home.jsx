import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { getStreamingVideoUrl, getVideoThumbnail } from '../utils/cloudinary'
import CountUp from '../components/CountUp'

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

  // Mock team members data - replace with real data from your API
  const teamMembers = [
    {
      id: 1,
      name: 'Laiyi',
      role: 'Creative Director',
      staticImage: 'public/members/static/Upright.webp',
      gifImage: 'public/members/gif/Upright.gif'
    },
    {
      id: 2,
      name: 'Trần Văn A',
      role: 'Lead Photographer',
      staticImage: 'public/members/static/Upright1.webp',
      gifImage: 'public/members/gif/Upright1.gif'
    },
    {
      id: 3,
      name: 'Nguyễn Văn B',
      role: 'Videographer',
      staticImage: 'public/members/static/Upright2.webp',
      gifImage: 'public/members/gif/Upright2.gif'
    },
    {
      id: 4,
      name: 'Nguyễn Văn C',
      role: 'Production Manager',
      staticImage: 'public/members/static/Upright3.webp',
      gifImage: 'public/members/gif/Upright3.gif'
    },
    {
      id: 5,
      name: 'Nguyễn Văn D',
      role: 'Art Director',
      staticImage: 'public/members/static/Upright.webp',
      gifImage: 'public/members/gif/Upright.gif'
    },
    {
      id: 6,
      name: 'Nguyễn Văn E',
      role: 'Editor',
      staticImage: 'public/members/static/Upright1.webp',
      gifImage: 'public/members/gif/Upright1.gif'
    }
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
    <div className="min-h-screen bg-zinc-950">
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-600 to-amber-600">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Geometric Shapes Background */}
        <div className="absolute inset-0 opacity-10">
          {/* Large rotating square */}
          <div className="absolute top-20 left-10 w-64 h-64 border-4 border-zinc-950 rotate-45 animate-spin-slow"></div>

          {/* Medium rotating square */}
          <div className="absolute bottom-32 right-20 w-48 h-48 border-4 border-zinc-950 rotate-12 animate-spin-reverse"></div>

          {/* Small circles */}
          <div className="absolute top-1/3 right-1/4 w-32 h-32 border-4 border-zinc-950 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border-4 border-zinc-950 rounded-full animate-pulse"></div>

          {/* Diagonal lines */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-0 w-full h-1 bg-zinc-950 transform -rotate-12 animate-slide-right"></div>
            <div className="absolute top-2/3 left-0 w-full h-1 bg-zinc-950 transform rotate-12 animate-slide-left"></div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-zinc-950 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: Math.random() * 0.3 + 0.1
              }}
            ></div>
          ))}
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Radial glow effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        {/* Diagonal stripes */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)'
          }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6">
          {/* Brand line */}
          <div className="mb-6 sm:mb-8 inline-block">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 justify-center">
              <div className="h-px w-8 sm:w-12 bg-zinc-950 animate-expand-width"></div>
              <span className="text-xs sm:text-sm font-bold text-zinc-950 uppercase tracking-widest animate-fade-in">
                ÚÒa Production
              </span>
              <div className="h-px w-8 sm:w-12 bg-zinc-950 animate-expand-width"></div>
            </div>
          </div>

          {/* Heading */}
          <h1 className=" text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-black text-zinc-950 mb-6 sm:mb-8 tracking-tight uppercase leading-[1.05] animate-slide-up">
            Chúng tôi là<br />
            <span className="relative inline-block">
              Những người
              <div className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-4 bg-zinc-950 opacity-20 -skew-x-12 animate-slide-in"></div>
            </span><br />
            kể chuyện bằng hình ảnh
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-900 font-medium mb-10 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto animate-fade-in-delay">
            Bắt lấy những khoảnh khắc, tạo ra những câu chuyện, xây dựng những trải nghiệm thị giác
          </p>

          {/* CTA buttons */}
          <div className="flex sm:flex-row gap-4 justify-center animate-fade-in-delay-2 px-2 sm:px-6">
            <Link
              to="/gallery"
              className="group w-full sm:w-auto px-6 py-4 bg-zinc-950 text-white font-bold text-sm sm:text-lg uppercase tracking-wide hover:bg-zinc-800 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Xem dự án</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-10"></div>
            </Link>

            <Link
              to="/contact"
              className="group w-full sm:w-auto px-6 py-4 bg-white text-zinc-950 font-bold text-sm sm:text-lg uppercase tracking-wide hover:bg-zinc-100 transition-all duration-300 relative overflow-hidden border-2 border-zinc-950"
            >
              <span className="relative z-10">Liên hệ</span>
              <div className="absolute inset-0 bg-zinc-950 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10"></div>
            </Link>
          </div>

          {/* Scroll indicator – hidden on mobile */}

        </div>

        <div className="block absolute bottom-0 left-[48%] -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-zinc-950 uppercase tracking-widest">
              Scroll
            </span>
            <svg className="w-6 h-6 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>


        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes spin-reverse {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes slide-right {
            0%, 100% { transform: translateX(-100%) rotate(-12deg); }
            50% { transform: translateX(100%) rotate(-12deg); }
          }
          
          @keyframes slide-left {
            0%, 100% { transform: translateX(100%) rotate(12deg); }
            50% { transform: translateX(-100%) rotate(12deg); }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(-20px) translateX(10px);
            }
            50% {
              transform: translateY(-40px) translateX(-10px);
            }
            75% {
              transform: translateY(-20px) translateX(10px);
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
          
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-in {
            from {
              width: 0;
              opacity: 0;
            }
            to {
              width: 100%;
              opacity: 0.2;
            }
          }
          
          @keyframes expand-width {
            from { width: 0; }
            to { width: 3rem; }
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          .animate-spin-reverse {
            animation: spin-reverse 15s linear infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }
          
          .animate-slide-right {
            animation: slide-right 8s ease-in-out infinite;
          }
          
          .animate-slide-left {
            animation: slide-left 10s ease-in-out infinite;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          
          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
          
          .animate-fade-in-delay {
            animation: fade-in 1s ease-out 0.3s forwards;
            opacity: 0;
          }
          
          .animate-fade-in-delay-2 {
            animation: fade-in 1s ease-out 0.6s forwards;
            opacity: 0;
          }
          
          .animate-slide-in {
            animation: slide-in 1s ease-out 0.5s forwards;
          }
          
          .animate-expand-width {
            animation: expand-width 1s ease-out forwards;
          }
        `}</style>
      </section>

      {/* Projects Grid Section */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
              Dự án nổi bật
            </h2>
            <div className="h-1 w-32 bg-orange-500"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-zinc-900 animate-pulse"></div>
              ))}
            </div>
          ) : categoryProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-zinc-500 font-medium">
                Không có dự án nào.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryProjects.map((project) => (
                <Link
                  key={project.categoryId}
                  to={`/category/${project.categoryId}`}
                  className="group relative aspect-square overflow-hidden bg-zinc-900"
                >
                  <div className="absolute inset-0">
                    {project.firstMedia.type === 'image' ? (
                      <img
                        src={project.firstMedia.url}
                        alt={project.categoryName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                          e.target.pause()
                          e.target.currentTime = 0
                        }}
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2 transform transition-transform group-hover:translate-y-0 translate-y-2">
                      {project.categoryName}
                    </h3>
                    <p className="text-orange-500 font-bold uppercase text-sm tracking-wider">
                      {project.postCount} {project.postCount === 1 ? 'Project' : 'Projects'}
                    </p>
                  </div>
                  <div className="absolute inset-0 border-4 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
              Đội ngũ của chúng tôi
            </h2>
            <div className="h-1 w-32 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Trí tưởng tượng sáng tạo được dành cho việc mang ý tưởng của bạn đến với hiện thực
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-800 mb-4">
                  {/* Static Image */}
                  <img
                    src={member.staticImage}
                    alt={member.name}
                    className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {/* GIF Image on hover */}
                  <img
                    src={member.gifImage}
                    alt={`${member.name} animated`}
                    className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  {/* Orange overlay on hover */}
                  <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
                <h3 className="text-white font-bold text-sm uppercase mb-1 group-hover:text-orange-500 transition-colors">
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

      {/* About Section */}
      <section className="py-32 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-8">
                Tầm nhìn của chúng tôi
              </h2>
              <div className="h-1 w-32 bg-orange-500 mb-8"></div>
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                Chúng tôi tin vào sức mạnh của việc kể câu chuyện bằng hình ảnh để biến thương hiệu và tạo ra những ấn tượng lâu dài. Mỗi khung hình chúng tôi bắt, mỗi câu chuyện chúng tôi kể, đều được tạo ra với độ chính xác và đam mê.
              </p>
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                Từ ý tưởng đến thực hiện, chúng tôi vượt qua giới hạn sáng tạo để cung cấp công việc không chỉ đáp ứng mong đợi—mà vượt xa mong đợi.
              </p>
              <Link
                to="/about"
                className="inline-block px-8 py-4 bg-orange-500 text-zinc-950 font-bold text-lg uppercase tracking-wide hover:bg-orange-400 transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-orange-500 absolute -top-8 -left-8 w-full"></div>
              <div className="aspect-[4/5] relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=1000&fit=crop"
                  alt="Behind the scenes"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 bg-zinc-950 overflow-hidden">
        {/* Background subtle glow */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 -left-40 w-96 h-96 bg-orange-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6">
              Những gì chúng tôi làm
            </h2>
            <div className="h-1 w-32 bg-orange-500 mx-auto"></div>
          </div>

          {/* Services Grid */}
          <div className="grid gap-px bg-zinc-800 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="
        group
        relative
        bg-zinc-950
        p-10
        flex flex-col
        justify-between
        min-h-[300px]
        overflow-hidden
        transition-colors duration-300
        hover:bg-zinc-900
      "
              >
                {/* Soft background accent */}
                <div className="
        pointer-events-none
        absolute -top-24 -right-24
        w-72 h-72
        rounded-full
        bg-orange-500/5
        blur-3xl
        opacity-0
        group-hover:opacity-100
        transition-opacity duration-500
      " />

                {/* Index */}
                <div className="relative z-10 text-xs font-bold tracking-[0.3em] text-zinc-500 mb-8">
                  0{index + 1}
                </div>

                {/* Title */}
                <h3 className="
        relative z-10
        text-3xl
        font-black
        uppercase
        leading-[1.05]
        text-white
        mb-6
        transition-colors duration-300
        group-hover:text-orange-500
      ">
                  {service.title}
                </h3>

                {/* Bottom content */}
                <div className="relative z-10 mt-auto">
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-[90%]">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 text-zinc-500">
                    <span className="w-10 h-px bg-current"></span>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 bg-orange-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl md:text-8xl font-black text-zinc-950 mb-4">
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
                <div className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-8">
            Hãy tạo ra<br />Điều gì đó đáng chú ý
          </h2>
          <p className="text-xl text-white font-medium mb-12">
            Sẵn sàng mang ý tưởng của bạn đến với hiện thực? Liên hệ ngay.
          </p>
          <Link
            to="/contact"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-orange-500 text-zinc-950 font-black text-base sm:text-xl uppercase tracking-widest overflow-hidden transition-all duration-300 hover:bg-orange-400"
          >
            <span className="relative z-10">Bắt đầu dự án</span>
            <span className="absolute inset-0 bg-white opacity-10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home