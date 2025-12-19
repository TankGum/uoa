const TOKEN_KEY = 'admin_token'

export const authService = {
  // Save token to localStorage
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken()
  },

  // Login
  async login(username, password) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      let errorMessage = 'Login failed'
      try {
        const error = await response.json()
        errorMessage = error.detail || errorMessage
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          const text = await response.text()
          errorMessage = text || errorMessage
        } catch (e2) {
          // Ignore
        }
      }
      throw new Error(errorMessage)
    }

    let data
    try {
      data = await response.json()
    } catch (e) {
      const text = await response.text()
      throw new Error(`Invalid response: ${text}`)
    }
    
    this.setToken(data.access_token)
    return data
  },

  // Logout
  logout() {
    this.removeToken()
  },

  // Get current user
  async getCurrentUser() {
    const token = this.getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get current user')
    }

    return await response.json()
  },
}

