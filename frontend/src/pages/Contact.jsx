import { useState } from 'react'
import client from '../api/client'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#e8bb69] selection:text-zinc-950 pt-20">
      {/* Hero Section - Editorial style */}
      <section className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#e8bb69]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#e8bb69] font-bold">Hit us up</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                Khởi đầu<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8bb69] to-[#cfb970]">Câu chuyện mới</span>
              </h1>
            </motion.div>
            <div className="md:max-w-md text-right md:text-left">
              <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic border-r-4 border-[#e8bb69] pr-6 md:border-r-0 md:border-l-4 md:pl-6">
                Hãy để chúng tôi đồng hành cùng bạn tạo ra những giá trị hình ảnh khác biệt và đầy cảm hứng.
              </p>
            </div>
          </div>
        </div>

        {/* Background Background text */}
        <div className="absolute top-20 right-10 text-[20vw] font-black text-white opacity-[0.01] pointer-events-none select-none uppercase">
          Connect
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-16">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Liên hệ trực tiếp</h2>
                <div className="h-1 w-24 bg-[#e8bb69]" />
              </div>

              <div className="space-y-12">
                {/* Item: Email */}
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1 group-hover:text-[#e8bb69] transition-colors">Digital reach</span>
                  <a href="mailto:uoafilmproduction@gmail.com" className="text-2xl md:text-3xl font-black text-white hover:text-[#e8bb69] transition-colors tracking-tighter uppercase break-words">
                    uoafilmproduction@gmail.com
                  </a>
                </div>

                {/* Item: Phone */}
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1 group-hover:text-[#e8bb69] transition-colors">Direct line</span>
                  <a href="tel:089 984 62 50" className="text-2xl md:text-3xl font-black text-white hover:text-[#e8bb69] transition-colors tracking-tighter uppercase">
                    +84 (0) 89 984 62 50
                  </a>
                </div>

                {/* Item: Office */}
                <div className="group">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Our Studio</span>
                  <p className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-tight">
                    Hà Nội, Việt Nam
                  </p>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 bg-zinc-900 border border-white/5 p-10 md:p-16 relative">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#e8bb69] opacity-20" />

              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-12">Gửi yêu cầu hợp tác</h2>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#e8bb69] text-zinc-950 p-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-zinc-950 flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Thành công!</h3>
                  <p className="font-bold">Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong 24h tới.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 border-2 border-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-zinc-950 hover:text-[#e8bb69] transition-colors"
                  >
                    Gửi thêm tin nhắn
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="group relative">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-4 group-focus-within:text-[#e8bb69] transition-colors">Tên của bạn*</label>
                    <input
                      type="text"
                      required
                      placeholder="HỌ VÀ TÊN"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-xl md:text-2xl font-black text-white focus:outline-none focus:border-[#e8bb69] transition-colors placeholder:text-zinc-800 uppercase"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="group relative">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-4 group-focus-within:text-[#e8bb69] transition-colors">Email nhận thông tin*</label>
                    <input
                      type="email"
                      required
                      placeholder="EMAIL@EXAMPLE.COM"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-xl md:text-2xl font-black text-white focus:outline-none focus:border-[#e8bb69] transition-colors placeholder:text-zinc-800 uppercase"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="group relative">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-4 group-focus-within:text-[#e8bb69] transition-colors">Bạn cần chúng tôi giúp gì?</label>
                    <textarea
                      placeholder="MÔ TẢ DỰ ÁN HOẶC NHU CẦU CỦA BẠN..."
                      className="w-full bg-transparent border-b border-white/10 py-4 text-xl md:text-2xl font-black text-white focus:outline-none focus:border-[#e8bb69] transition-colors placeholder:text-zinc-800 min-h-[150px] resize-none uppercase"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {error && <p className="text-red-500 font-bold uppercase text-xs tracking-widest">{error}</p>}

                  <button
                    disabled={loading}
                    className="w-full py-6 bg-[#e8bb69] text-zinc-950 font-black uppercase text-sm tracking-[0.3em] overflow-hidden group relative cursor-pointer disabled:opacity-50"
                  >
                    <span className="relative z-10">{loading ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact