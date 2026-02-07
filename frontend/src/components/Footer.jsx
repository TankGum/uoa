import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-auto bg-zinc-950 overflow-hidden pt-32">
      {/* Massive CTA Section */}
      <div className="max-w-7xl mx-auto px-6 mb-40">
        <div className="relative border-y border-white/5 py-32 group overflow-hidden">
          {/* Subtle background text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-[25vw] font-black uppercase tracking-tighter leading-none translate-y-8">CREATE</span>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-4 mb-10"
            >
              <div className="h-px w-8 bg-[#e8bb69]" />
              <span className="text-[#e8bb69] font-black uppercase text-[10px] tracking-[0.5em]">
                Join the vision
              </span>
              <div className="h-px w-8 bg-[#e8bb69]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.85] mb-16"
            >
              Hãy tạo ra <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8bb69] via-white to-[#e8bb69] bg-[length:200%_auto] animate-gradient-x">Điều gì đó đáng chú ý</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-4 px-16 py-6 bg-white text-zinc-950 font-black uppercase text-xs tracking-[0.5em] transition-all duration-500 hover:bg-[#e8bb69] active:scale-95"
              >
                Start a Project
                <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Simplified 2-Column Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-start">

          {/* Left: Brand & Statement */}
          <div className="space-y-12">
            <div>
              <Link to="/home" className="inline-block group">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white uppercase tracking-tighter group-hover:text-[#e8bb69] transition-colors duration-500">ÚÒa</span>
                  <motion.span
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-[#e8bb69] rounded-full"
                  />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[#e8bb69] block mt-2 opacity-80">Production Studio</span>
              </Link>
            </div>

            <p className="text-zinc-500 text-lg leading-relaxed max-w-md font-medium italic border-l border-zinc-800 pl-8">
              Tái định hình sự hỗn loạn của chuyển động thành sự tĩnh lặng điện ảnh. Một phòng thí nghiệm dành riêng cho chuyển động, ánh sáng và di sản thị giác.
            </p>

            <div className="flex justify-between pt-4">
              {[
                { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61583844592645' },
                { name: 'Youtube', href: 'https://www.youtube.com/@UOA_Production' },
                { name: 'Insta', href: 'https://www.instagram.com/uoa_production/' },
                { name: 'TikTok', href: 'https://www.tiktok.com/@uoa_production' },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/5 text-[10px] font-black text-zinc-600 uppercase tracking-widest
                            hover:border-[#e8bb69] hover:text-[#e8bb69]
                            transition-all duration-300 bg-zinc-900/30"
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Essential Contact Only */}
          <div className="space-y-16 md:pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Liên hệ</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Địa chỉ</span>
                <p className="text-sm font-bold text-zinc-300 tracking-tight leading-relaxed">
                  Hà Nội, Việt Nam
                </p>
              </div>

              <div className="space-y-4">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Email</span>
                <a href="mailto:uoafilmproduction@gmail.com" className="text-sm font-bold text-zinc-300 tracking-tight leading-relaxed hover:text-[#e8bb69] transition-colors">
                  uoafilmproduction@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5">
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-2">Trạng thái</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sẵn sàng cho dự án</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar - More Minimal */}
        <div className="pt-24 mt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">GMT+7</span>
              <span className="text-xs font-mono text-zinc-500">
                {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">
              © {currentYear} ÚÒa Production Studio
            </p>
            <div className="flex gap-2">
              <div className="h-1 w-8 bg-[#e8bb69]/20" />
              <div className="h-1 w-8 bg-[#e8bb69]/40" />
              <div className="h-1 w-8 bg-[#e8bb69]/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Flare */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#e8bb69]/30 to-transparent" />
    </footer>
  )
}

export default Footer
