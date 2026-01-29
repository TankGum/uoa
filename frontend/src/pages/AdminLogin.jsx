import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already authenticated, redirect to admin
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-[#2d2d2d]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-light mb-6 text-center uppercase tracking-[2px]">
          Admin Login
        </h1>
        <h2 className="text-xl font-light mb-8 text-center text-text-light">
          ÚÒa Production
        </h2>
        
        {error && (
          <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 font-medium text-text">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-text">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

