import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-4 z-[10003] md:hidden p-2 text-[#001f3f] rounded-full shadow-lg transition-all duration-300 ${
          isMenuOpen ? 'left-[280px]' : 'left-4'
        }`}
        style={{ backgroundColor: '#cfb970' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a55f'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#cfb970'}
        aria-label="Toggle menu"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none" 
          stroke="#001f3f" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[10001] md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-64 text-[#001f3f] z-[10002] transform transition-transform duration-300 ease-in-out md:hidden ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ backgroundColor: '#cfb970' }}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="p-6 border-b border-[#001f3f]/20">
            <Link 
              to="/home" 
              className="flex flex-col items-center gap-2"
              onClick={closeMenu}
            >
              <img 
                src="/logo.png" 
                alt="ÚÒa Production Logo" 
                className="h-12 object-contain"
              />
              <span className="text-2xl font-light tracking-wide text-[#001f3f] uppercase text-center">
                ÚÒa Production
              </span>
            </Link>
          </div>

          {/* Menu items */}
          <ul className="flex flex-col list-none flex-1 overflow-y-auto py-4">
            <li>
              <Link 
                to="/home" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/home') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/gallery" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/gallery') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link 
                to="/images" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/images') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                Images
              </Link>
            </li>
            <li>
              <Link 
                to="/videos" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/videos') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                Videos
              </Link>
            </li>
            <li>
              <Link 
                to="/booking" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/booking') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                Book Session
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/about') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/contact') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                to="/admin" 
                onClick={closeMenu}
                className={`transition-colors duration-300 font-light text-sm uppercase tracking-[1px] block py-3 px-6 ${
                  isActive('/admin') ? 'text-[#001f3f] bg-[#001f3f]/10 border-l-4 border-[#001f3f]' : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/5'
                }`}
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Desktop Navbar */}
      <nav 
        className="hidden md:block text-[#001f3f] py-2 z-[1000] shadow-lg" 
        style={{ 
          backgroundColor: '#cfb970'
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Brand - Left */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              onClick={closeMenu}
            >
              <img 
                src="/logo.png" 
                alt="ÚÒa Production Logo" 
                className="h-10 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Menu items - Right - Pill Design */}
            <ul className="flex flex-row list-none gap-1.5 lg:gap-2 items-center bg-[#001f3f]/5 rounded-full px-2 py-2.5">
              <li>
                <Link 
                  to="/home" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/home') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/gallery') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/images" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/images') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  Images
                </Link>
              </li>
              <li>
                <Link 
                  to="/videos" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/videos') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link 
                  to="/booking" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/booking') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  Book
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/about') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/contact') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin" 
                  onClick={closeMenu}
                  className={`transition-all duration-300 text-xs lg:text-sm uppercase tracking-wider px-3 lg:px-4 py-2 rounded-full font-medium whitespace-nowrap ${
                    isActive('/admin') 
                      ? 'bg-[#001f3f] text-white shadow-lg transform scale-105' 
                      : 'text-[#001f3f]/80 hover:text-[#001f3f] hover:bg-[#001f3f]/10 hover:scale-105'
                  }`}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

