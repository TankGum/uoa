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
        className={`fixed top-6 z-[10003] md:hidden p-3 bg-orange-500 text-zinc-950 transition-all duration-300 rounded-full hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 cursor-pointer ${
          isMenuOpen ? 'left-[280px]' : 'left-6'
        }`}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isMenuOpen ? 'rotate-90' : 'rotate-0'
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

      {/* Mobile Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 bg-zinc-950 text-white z-[10002] transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-8 border-b border-orange-500/20">
            <Link 
              to="/home" 
              className="block focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset rounded cursor-pointer" 
              onClick={closeMenu}
              aria-label="Go to homepage"
            >
              <div className="text-3xl font-black uppercase tracking-tight text-white mb-1">
                ÚÒa
              </div>
              <div className="text-sm font-medium uppercase tracking-widest text-orange-500">
                Production
              </div>
            </Link>
          </div>

          {/* Mobile Menu Items */}
          <ul className="flex flex-col list-none flex-1 overflow-y-auto py-6">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
            <Link
              to={path}
              onClick={closeMenu}
              className={`transition-all duration-300 font-bold text-base uppercase tracking-wider block py-4 px-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset cursor-pointer ${
                isActive(path)
                  ? 'text-zinc-950 bg-orange-500 border-l-4 border-orange-400'
                  : 'text-white hover:text-orange-500 hover:bg-zinc-900 border-l-4 border-transparent'
              }`}
            >
              {label}
            </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Footer */}
          <div className="p-8 border-t border-orange-500/20">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              © {new Date().getFullYear()} ÚÒa Production
            </p>
          </div>
        </div>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md text-white py-4 z-[1000] border-b border-orange-500/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link 
              to="/home" 
              className="group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 rounded cursor-pointer" 
              onClick={closeMenu}
              aria-label="Go to homepage"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black uppercase tracking-tight text-white group-hover:text-orange-500 transition-colors">
                  ÚÒa
                </div>
                <div className="h-8 w-px bg-orange-500/30"></div>
                <div className="text-xs font-medium uppercase tracking-widest text-orange-500">
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
                    className={`transition-all duration-300 text-sm uppercase tracking-wider px-5 py-2.5 font-bold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-950 cursor-pointer ${
                      isActive(path)
                        ? 'bg-orange-500 text-zinc-950'
                        : 'text-white hover:text-orange-500'
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
