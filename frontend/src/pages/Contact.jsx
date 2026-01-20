import { useState } from 'react'
import client from '../api/client'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const now = new Date()
      const endTime = new Date(now.getTime() + 60 * 60 * 1000)
      
      await client.post('/bookings', {
        client_name: formData.name,
        client_email: formData.email,
        start_time: now.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending',
        message: formData.message || null
      })
      
      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            Get In Touch
          </h1>
          <div className="h-1 w-32 bg-zinc-950 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-zinc-900 font-medium max-w-2xl mx-auto">
            Hãy tạo ra điều gì đó đáng chú ý
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                Let's Talk
              </h2>
              <div className="h-1 w-24 bg-orange-500 mb-8"></div>
              
              <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
                Chúng tôi sẵn sàng giúp bạn tạo ra những câu chuyện đầy sáng tạo và tính thử nghiệm bằng hình ảnh.
              </p>

              {/* Contact Details */}
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-1">Email</h3>
                    <a href="mailto:hello@uoaproduction.com" className="text-orange-500 hover:text-orange-400 transition-colors">
                      hello@uoaproduction.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-1">Phone</h3>
                    <a href="tel:+15551234567" className="text-orange-500 hover:text-orange-400 transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-1">Studio</h3>
                    <p className="text-zinc-400">
                      Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-wider mb-1">Hours</h3>
                    <p className="text-zinc-400">
                      Thứ Hai - Thứ Sáu: 9:00 - 18:00<br />
                      Thứ Bảy: 10:00 - 16:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12">
                <h3 className="text-white font-bold uppercase tracking-wider mb-4">Theo dõi chúng tôi</h3>
                <div className="flex gap-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                     className="w-12 h-12 bg-zinc-900 hover:bg-orange-500 text-zinc-400 hover:text-zinc-950 flex items-center justify-center transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                     className="w-12 h-12 bg-zinc-900 hover:bg-orange-500 text-zinc-400 hover:text-zinc-950 flex items-center justify-center transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                     className="w-12 h-12 bg-zinc-900 hover:bg-orange-500 text-zinc-400 hover:text-zinc-950 flex items-center justify-center transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-zinc-900 p-8 lg:p-12">
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-8">
                Gửi tin nhắn
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-500 text-green-400">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-sm">Success!</p>
                      <p className="text-sm">Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500 text-red-400">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-3 font-bold text-white uppercase tracking-wider text-sm">
                    Tên của bạn *
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-zinc-950 border-2 border-zinc-800 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-3 font-bold text-white uppercase tracking-wider text-sm">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full p-4 bg-zinc-950 border-2 border-zinc-800 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="nguyenvana@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-3 font-bold text-white uppercase tracking-wider text-sm">
                    Tin nhắn
                  </label>
                  <textarea
                    className="w-full p-4 bg-zinc-950 border-2 border-zinc-800 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none h-40"
                    placeholder="Nhắc lại về dự án hoặc yêu cầu của bạn..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 text-zinc-950 font-bold text-lg uppercase tracking-wider hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gửi...
                    </span>
                  ) : 'Gửi tin nhắn'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact