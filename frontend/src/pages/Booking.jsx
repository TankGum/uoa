import { useState } from 'react'
import client from '../api/client'

function Booking() {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    start_time: '',
    end_time: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await client.post('/bookings', {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      })
      setSuccess(true)
      setFormData({
        client_name: '',
        client_email: '',
        start_time: '',
        end_time: '',
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl md:text-3xl font-light text-center mb-12 uppercase tracking-[2px] text-[#001f3f]">Book a Session</h2>
          
          <form className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
            {success && (
              <div className="p-4 rounded mb-6 bg-[#d4edda] text-[#155724] border border-[#c3e6cb]">
                Booking request submitted successfully! We'll get back to you soon.
              </div>
            )}
            
            {error && (
              <div className="p-4 rounded mb-6 bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-2 font-medium text-text" htmlFor="client_name">
                Name *
              </label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary"
                value={formData.client_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-text" htmlFor="client_email">
                Email *
              </label>
              <input
                type="email"
                id="client_email"
                name="client_email"
                className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary"
                value={formData.client_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-text" htmlFor="start_time">
                Start Time *
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-text" htmlFor="end_time">
                End Time *
              </label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Booking

