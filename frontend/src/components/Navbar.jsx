import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Trang chủ', path: '/home' },
  { label: 'Dự án', path: '/gallery' },
  { label: 'Hình ảnh', path: '/images' },
  { label: 'Film', path: '/videos' },
  { label: 'Về chúng tôi', path: '/about' },
  { label: 'Liên hệ', path: '/contact' },
]

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed bottom-6 z-[10003] md:hidden p-3 bg-[#e8bb69]/80 text-zinc-950 transition-all duration-300 rounded-full shadow-lg backdrop-blur-md hover:scale-110 hover:opacity-100 active:scale-95 cursor-pointer ${isMenuOpen ? 'left-[5%] rotate-180 opacity-100 bg-[#e8bb69]' : 'left-[5%] opacity-70'
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[10001] md:hidden backdrop-blur-sm"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

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
            <nav className="space-y-4">
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
                    className="group relative flex items-baseline gap-4 py-2 focus:outline-none cursor-pointer"
                  >
                    <span className="text-[#e8bb69] font-mono text-xs opacity-50">0{index + 1}</span>
                    <span
                      className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter transition-all duration-300 ${isActive(path) ? 'text-[#e8bb69]' : 'text-white group-hover:text-[#e8bb69]'
                        }`}
                    >
                      {label}
                    </span>
                    {isActive(path) && (
                      <motion.div
                        layoutId="activeMobileLine"
                        className="h-1 w-12 bg-[#e8bb69] self-center ml-2"
                      />
                    )}
                  </Link>
                </div>
              ))}
              {/* Separate Admin Link for Mobile */}
              <div
                className="overflow-hidden pt-8 border-t border-white/5 mt-4"
                style={{
                  animation: isMenuOpen ? `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${NAV_LINKS.length * 0.1}s` : 'none',
                  opacity: 0,
                  transform: 'translateY(40px)'
                }}
              >
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="text-zinc-500 hover:text-[#e8bb69] text-sm uppercase tracking-widest font-bold transition-colors"
                >
                  Admin Portal
                </Link>
              </div>
            </nav>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute bottom-0 right-0 p-8 pointer-events-none opacity-[0.03]">
            <span className="text-[25vw] font-black leading-none uppercase select-none">ÚÒa</span>
          </div>

          {/* Social Links / Footer */}
          <div className="p-8 flex justify-between items-center border-t border-white/5">
            <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-500">
              © {new Date().getFullYear()} ÚÒa Production
            </p>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-[#e8bb69] animate-pulse" />
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`hidden md:block fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ${scrolled
          ? 'py-3'
          : 'py-6'
          }`}
      >
        <div className="max-w-[95%] mx-auto relative">
          {/* Background Glass Plate */}
          <div
            className={`absolute inset-0 transition-all duration-500 ease-out border-[#e8bb69]/10 ${scrolled
              ? 'bg-zinc-950/80 backdrop-blur-xl border-b shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]'
              : 'bg-transparent border-transparent'
              }`}
          />

          <div className="relative px-8 flex items-center justify-between">
            {/* Brand - Left */}
            <Link
              to="/home"
              className="group flex items-center gap-4 focus:outline-none"
              aria-label="Go to homepage"
            >
              <div className="flex items-baseline gap-1">
                <span className={`font-black uppercase tracking-tighter transition-all duration-500 ${scrolled ? 'text-2xl' : 'text-3xl'
                  } text-white group-hover:text-[#e8bb69]`}>
                  ÚÒa
                </span>
                <span className="w-1.5 h-1.5 bg-[#e8bb69] rounded-full" />
              </div>
              <div className={`h-6 w-px bg-white/10 transition-transform duration-500 ${scrolled ? 'scale-y-75' : 'scale-y-100'}`} />
              <div className={`overflow-hidden transition-all duration-500 ${scrolled ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#e8bb69] block whitespace-nowrap">
                  Production
                </span>
              </div>
            </Link>

            {/* Menu Links - Center */}
            <ul className="flex items-center gap-1 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={path} className="relative group">
                  <Link
                    to={path}
                    className={`relative px-4 py-2 block text-[11px] uppercase tracking-[0.2em] font-black transition-all duration-300 pointer-events-auto ${isActive(path)
                      ? 'text-[#e8bb69]'
                      : 'text-white/60 hover:text-white'
                      }`}
                  >
                    <span>{label}</span>
                    {isActive(path) && (
                      <motion.div
                        layoutId="navActive"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#e8bb69]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="absolute -bottom-1 left-4 right-4 h-[1px] bg-[#e8bb69] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-6">
              <Link
                to="/admin"
                className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${scrolled ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-40 hover:opacity-100 text-white'}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Admin</span>
              </Link>

              <Link
                to="/contact"
                className={`relative px-6 py-2.5 overflow-hidden group border transition-all duration-500 ${scrolled
                  ? 'border-[#e8bb69] bg-[#e8bb69] text-zinc-950 hover:bg-zinc-950 hover:text-[#e8bb69]'
                  : 'border-white/20 text-white hover:border-[#e8bb69]'}`}
              >
                <div className="absolute inset-0 bg-[#e8bb69] translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
                <span className="relative text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300">
                  Book A Call
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  )
}

export default Navbar
