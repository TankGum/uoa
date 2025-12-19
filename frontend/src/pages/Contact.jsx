import { useState } from 'react'
import client from '../api/client'

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
      // Create a booking as a contact form submission
      const now = new Date()
      const endTime = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour later
      
      await client.post('/bookings', {
        client_name: formData.name,
        client_email: formData.email,
        start_time: now.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending'
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
    <div className="min-h-screen">
      <section className="py-20">
        <div className="container">
          <h1 className="text-5xl md:text-4xl font-light text-center mb-12 uppercase tracking-[2px] text-[#001f3f]">
            Contact
          </h1>
          
          <div className="max-w-2xl mx-auto">
            {success && (
              <div className="mb-6 p-4 rounded bg-green-50 border border-green-200 text-green-800">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-800">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-text">Name *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-text">Email *</label>
                <input
                  type="email"
                  className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-text">Message</label>
                <textarea
                  className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary resize-y min-h-[200px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project or inquiry..."
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

