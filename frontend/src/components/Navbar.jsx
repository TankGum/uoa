import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Trang chủ', path: '/home' },
  { label: 'Dự án', path: '/gallery' },
  { label: 'Hình ảnh', path: '/images' },
  { label: 'Film', path: '/videos' },
  { label: 'Về chúng tôi', path: '/about' },
  { label: 'Liên hệ', path: '/contact' },
  { label: 'Admin', path: '/admin' },
]

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed bottom-6 z-[10003] md:hidden p-3 bg-[#e8bb69]/60 text-zinc-950 transition-all duration-300 rounded-full shadow-lg backdrop-blur-md hover:scale-110 hover:opacity-100 active:scale-95 cursor-pointer ${isMenuOpen ? 'left-[5%] rotate-180 opacity-100 bg-[#e8bb69]' : 'left-[5%] opacity-70'
          }`}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[10001] md:hidden backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Full Screen Menu */}
      <nav
        className={`fixed inset-0 w-full bg-zinc-950 text-white z-[10002] transform transition-transform duration-500 ease-in-out md:hidden flex flex-col ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="flex flex-col h-full pt-12">
          {/* Brand */}
          <div className="p-10 border-b border-[#e8bb69]/10 flex flex-col items-center">
            <Link
              to="/home"
              className="text-center focus:outline-none rounded cursor-pointer"
              onClick={closeMenu}
              aria-label="Go to homepage"
            >
              <div className="text-2xl font-black uppercase tracking-tight text-white">
                ÚÒa
              </div>
              <div className="text-xs font-medium uppercase tracking-widest text-[#e8bb69]">
                Production
              </div>
            </Link>
          </div>

          {/* Mobile Menu Items - Refined Vertical List */}
          <div className="flex-1 flex flex-col justify-center px-10">
            <nav className="space-y-2">
              {NAV_LINKS.map(({ label, path }, index) => (
                <div
                  key={path}
                  className="overflow-hidden"
                  style={{
                    animation: isMenuOpen ? `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.1}s` : 'none',
                    opacity: 0,
                    transform: 'translateY(40px)'
                  }}
                >
                  <Link
                    to={path}
                    onClick={closeMenu}
                    className="group relative flex items-baseline gap-3 py-1 focus:outline-none cursor-pointer"
                  >
                    <span className="text-[#e8bb69] font-mono text-[10px] mb-2">0{index + 1}</span>
                    <span
                      className={`text-3xl sm:text-4xl font-black uppercase tracking-tighter transition-all duration-300 ${isActive(path) ? 'text-[#e8bb69]' : 'text-white group-hover:text-[#e8bb69]'
                        }`}
                    >
                      {label}
                    </span>
                    {isActive(path) && (
                      <div className="h-0.5 w-8 bg-[#e8bb69] self-center" />
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute bottom-0 right-0 p-8 pointer-events-none opacity-5">
            <span className="text-[15vw] font-black leading-none uppercase select-none">ÚÒa</span>
          </div>

          {/* Social Links / Footer */}
          <div className="p-8 flex justify-between items-center border-t border-white/5">
            <p className="text-[7.5px] uppercase tracking-[0.3em] text-zinc-500">
              © {new Date().getFullYear()} ÚÒa Production
            </p>
            <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#e8bb69] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Custom Menu Animations */}
        <style>{`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md text-white py-3 z-[1000] border-b border-[#e8bb69]/20">
        <div className="container mx-auto px-3 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link
              to="/home"
              className="group rounded cursor-pointer"
              onClick={closeMenu}
              aria-label="Go to homepage"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black uppercase tracking-tight text-white group-hover:text-[#e8bb69] transition-colors">
                  ÚÒa
                </div>
                <div className="h-8 w-px bg-[#e8bb69]/30"></div>
                <div className="text-xs font-medium uppercase tracking-widest text-[#e8bb69]">
                  Production
                </div>
              </div>
            </Link>

            {/* Desktop Menu Items */}
            <ul className="flex flex-row list-none gap-2 items-center">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={closeMenu}
                    className={`transition-all duration-300 text-sm uppercase tracking-wider px-3 py-2 font-bold whitespace-nowrap cursor-pointer ${isActive(path)
                      ? 'bg-[#e8bb69] text-zinc-950'
                      : 'text-white hover:text-[#e8bb69]'
                      }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
