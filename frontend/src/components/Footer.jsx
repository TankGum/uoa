import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-auto bg-zinc-950 overflow-hidden">
      {/* Top Orange Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-[#e8bb69] via-[#fff] to-[#e8bb69]"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(251, 146, 60, 0.1) 49%, rgba(251, 146, 60, 0.1) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(251, 146, 60, 0.1) 49%, rgba(251, 146, 60, 0.1) 51%, transparent 52%)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="mb-6">
              <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
                ÚÒa
              </h3>
              <div className="h-1 w-20 bg-[#e8bb69] mx-auto md:mx-0"></div>
              <p className="text-sm font-medium text-[#e8bb69] uppercase tracking-widest mt-2">
                Production
              </p>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tạo ra những câu chuyện đầy sáng tạo và tính thử nghiệm bằng hình ảnh.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-black text-white uppercase tracking-wider mb-6">
              Liên hệ
            </h4>
            <div className="space-y-4 mb-6">
              <p className="text-zinc-400 text-sm">
                <span className="text-[#e8bb69] font-bold">Email:</span><br />
                hello@uoaproduction.com
              </p>
              <p className="text-zinc-400 text-sm">
                <span className="text-[#e8bb69] font-bold">Phone:</span><br />
                +84 909 090 909
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://www.facebook.com/uoaproduction"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-zinc-900 hover:bg-[#e8bb69] text-zinc-400 hover:text-zinc-950 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#e8bb69] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-300 group cursor-pointer"
                aria-label="Visit our Facebook page"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@uoaproduction"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-zinc-900 hover:bg-[#e8bb69] text-zinc-400 hover:text-zinc-950 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#e8bb69] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-300 group cursor-pointer"
                aria-label="Visit our YouTube channel"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/uoaproduction"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-zinc-900 hover:bg-[#e8bb69] text-zinc-400 hover:text-zinc-950 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#e8bb69] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-300 group cursor-pointer"
                aria-label="Visit our Instagram page"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@uoaproduction"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-zinc-900 hover:bg-[#e8bb69] text-zinc-400 hover:text-zinc-950 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#e8bb69] focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-300 group cursor-pointer"
                aria-label="Visit our TikTok page"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider with Dots */}
        <div className="relative mb-8">
          <div className="border-t border-zinc-800"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div className="w-2 h-2 bg-[#e8bb69] rotate-45"></div>
            <div className="w-2 h-2 bg-[#e8bb69] rotate-45"></div>
            <div className="w-2 h-2 bg-[#e8bb69] rotate-45"></div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">
            © {currentYear} ÚÒa Production. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Bottom Orange Strip */}
      <div className="h-1 bg-gradient-to-r from-[#e8bb69] via-[#fff] to-[#e8bb69]" />
    </footer>
  )
}

export default Footer