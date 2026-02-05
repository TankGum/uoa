import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/auth'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/admin')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#e8bb69]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-orange-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      <div className="relative w-full max-w-md mx-4 z-10">
        {/* Logo/Brand Area */}
        <div className="text-center mb-12">
          <Link to="/home" className="inline-block group">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-[#e8bb69] transition-colors">
              ÚÒa
            </h1>
            <div className="h-0.5 w-12 bg-[#e8bb69] mx-auto mb-2" />
            <p className="text-[10px] font-bold text-[#e8bb69] uppercase tracking-[0.4em]">
              Management
            </p>
          </Link>
        </div>

        {/* Login Panel */}
        <div className="bg-zinc-900 p-8 sm:p-12 border border-white/5 relative shadow-2xl overflow-hidden">
          {/* Subtle top light bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e8bb69] to-transparent" />

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-4 bg-zinc-950 border border-zinc-800 text-white font-medium focus:outline-none focus:border-[#e8bb69] focus:ring-1 focus:ring-[#e8bb69] transition-all duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="Bạn là ai?"
              />
            </div>

            <div className="mb-10">
              <label htmlFor="password" className="block mb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-4 bg-zinc-950 border border-zinc-800 text-white font-medium focus:outline-none focus:border-[#e8bb69] focus:ring-1 focus:ring-[#e8bb69] transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-[#e8bb69] text-zinc-950 font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-400 active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(232,187,105,0.2)]"
              disabled={loading}
            >
              {loading ? 'Đang xác minh...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link to="/home" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
              ← Trở lại trang chủ
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-10 text-center text-zinc-700 text-[9px] uppercase tracking-[0.4em]">
          Uoa Production Secure Interface
        </p>
      </div>
    </div>
  )
}

export default AdminLogin

