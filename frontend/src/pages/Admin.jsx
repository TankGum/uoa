import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import VideoUploader from '../components/VideoUploader'
import ImageUploader from '../components/ImageUploader'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import { useModal } from '../hooks/useModal'
import { getVideoThumbnail } from '../utils/cloudinary'
import { authService } from '../services/auth'

function Admin() {
  const navigate = useNavigate()
  const { modalState, showAlert, showConfirm, closeModal } = useModal()
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [bookings, setBookings] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsPage, setPostsPage] = useState(1)
  const [postsTotalPages, setPostsTotalPages] = useState(1)
  const [bookingsPage, setBookingsPage] = useState(1)
  const [bookingsTotalPages, setBookingsTotalPages] = useState(1)
  const itemsPerPage = 10
  const [editingPost, setEditingPost] = useState(null)
  const [editingBooking, setEditingBooking] = useState(null)
  const [showPostForm, setShowPostForm] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  // Sort states
  const [postsSortColumn, setPostsSortColumn] = useState(null)
  const [postsSortDirection, setPostsSortDirection] = useState('desc')
  const [bookingsSortColumn, setBookingsSortColumn] = useState(null)
  const [bookingsSortDirection, setBookingsSortDirection] = useState('asc')
  const [categoriesSortColumn, setCategoriesSortColumn] = useState(null)
  const [categoriesSortDirection, setCategoriesSortDirection] = useState('asc')

  // Search states
  const [postsSearchInput, setPostsSearchInput] = useState('')
  const [postsSearch, setPostsSearch] = useState('')
  const [bookingsSearchInput, setBookingsSearchInput] = useState('')
  const [bookingsSearch, setBookingsSearch] = useState('')
  const [categoriesSearchInput, setCategoriesSearchInput] = useState('')
  const [categoriesSearch, setCategoriesSearch] = useState('')

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/admin/login')
      return
    }
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/admin/login')
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'posts') {
        const skip = (postsPage - 1) * itemsPerPage
        const params = { skip, limit: itemsPerPage }
        if (postsSortColumn) {
          params.sort_by = postsSortColumn
          params.sort_order = postsSortDirection
        }
        if (postsSearch.trim()) {
          params.search = postsSearch.trim()
        }
        const response = await client.get('/posts', { params })
        setPosts(response.data.items || response.data)
        if (response.data.total_pages !== undefined) {
          setPostsTotalPages(response.data.total_pages)
        } else {
          setPostsTotalPages(Math.ceil((response.data.items || response.data).length / itemsPerPage))
        }
      } else if (activeTab === 'bookings') {
        const skip = (bookingsPage - 1) * itemsPerPage
        const params = { skip, limit: itemsPerPage }
        if (bookingsSortColumn) {
          params.sort_by = bookingsSortColumn
          params.sort_order = bookingsSortDirection
        }
        if (bookingsSearch.trim()) {
          params.search = bookingsSearch.trim()
        }
        const response = await client.get('/bookings', { params })
        setBookings(response.data.items || response.data)
        if (response.data.total_pages !== undefined) {
          setBookingsTotalPages(response.data.total_pages)
        } else {
          setBookingsTotalPages(Math.ceil((response.data.items || response.data).length / itemsPerPage))
        }
      } else if (activeTab === 'categories') {
        const params = {}
        if (categoriesSortColumn) {
          params.sort_by = categoriesSortColumn
          params.sort_order = categoriesSortDirection
        }
        if (categoriesSearch.trim()) {
          params.search = categoriesSearch.trim()
        }
        const response = await client.get('/categories', { params })
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Reset page, sort, and search when tab changes
    setPostsPage(1)
    setBookingsPage(1)
    setPostsSortColumn(null)
    setPostsSortDirection('desc')
    setBookingsSortColumn(null)
    setBookingsSortDirection('asc')
    setCategoriesSortColumn(null)
    setCategoriesSortDirection('asc')
    setPostsSearchInput('')
    setPostsSearch('')
    setBookingsSearchInput('')
    setBookingsSearch('')
    setCategoriesSearchInput('')
    setCategoriesSearch('')
  }, [activeTab])

  useEffect(() => {
    fetchData()
  }, [activeTab, postsPage, bookingsPage, postsSortColumn, postsSortDirection, bookingsSortColumn, bookingsSortDirection, categoriesSortColumn, categoriesSortDirection, postsSearch, bookingsSearch, categoriesSearch])

  // Reset page when search changes
  useEffect(() => {
    setPostsPage(1)
  }, [postsSearch])

  useEffect(() => {
    setBookingsPage(1)
  }, [bookingsSearch])

  // Search handlers
  const handlePostsSearch = () => {
    setPostsSearch(postsSearchInput.trim())
    setPostsPage(1)
  }

  const handleBookingsSearch = () => {
    setBookingsSearch(bookingsSearchInput.trim())
    setBookingsPage(1)
  }

  const handleCategoriesSearch = () => {
    setCategoriesSearch(categoriesSearchInput.trim())
  }

  const handleClearPostsSearch = () => {
    setPostsSearchInput('')
    setPostsSearch('')
    setPostsPage(1)
  }

  const handleClearBookingsSearch = () => {
    setBookingsSearchInput('')
    setBookingsSearch('')
    setBookingsPage(1)
  }

  const handleClearCategoriesSearch = () => {
    setCategoriesSearchInput('')
    setCategoriesSearch('')
  }

  const handleDeletePost = async (id) => {
    const confirmed = await showConfirm('Are you sure you want to delete this post?', 'Delete Post')
    if (!confirmed) return
    try {
      await client.delete(`/posts/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting post:', error)
      await showAlert('Failed to delete post', 'Error')
    }
  }

  const handleDeleteBooking = async (id) => {
    const confirmed = await showConfirm('Are you sure you want to delete this contact?', 'Delete Contact')
    if (!confirmed) return
    try {
      await client.delete(`/bookings/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting contact:', error)
      await showAlert('Failed to delete contact', 'Error')
    }
  }

  const handleDeleteCategory = async (id) => {
    const confirmed = await showConfirm('Are you sure you want to delete this category?', 'Delete Category')
    if (!confirmed) return
    try {
      await client.delete(`/categories/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting category:', error)
      await showAlert('Failed to delete category', 'Error')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  // Sort functions
  const handleSort = (column, type, setSortColumn, setSortDirection, sortColumn, sortDirection) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection(type === 'posts' && column === 'created' ? 'desc' : 'asc')
    }
  }

  const SortIcon = ({ column, sortColumn, sortDirection }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 inline-block ml-1" style={{ color: '#999' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 inline-block ml-1" style={{ color: '#001f3f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 inline-block ml-1" style={{ color: '#001f3f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#e8bb69] selection:text-zinc-950 pt-20">
      {/* Header Section */}
      <section className="relative pt-12 pb-8 px-6 overflow-hidden border-b border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#e8bb69]" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#e8bb69] font-bold">Control Panel</span>
            </div>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Quản lý<br />
              <span className="text-zinc-500">Hệ thống</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 pb-2">
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Phiên đăng nhập</span>
              <span className="text-sm font-bold text-white uppercase tracking-wider">Administrator</span>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-[#e8bb69] hover:bg-[#e8bb69] hover:text-zinc-950 transition-all duration-300 transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Đăng xuất</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4-4H3" /></svg>
            </button>
          </div>
        </div>
      </section>


      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 md:gap-8 mb-16 overflow-x-auto no-scrollbar border-b border-white/5">
          {[
            { id: 'posts', label: 'Bài viết' },
            { id: 'bookings', label: 'Tin nhắn' },
            { id: 'categories', label: 'Danh mục' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`pb-6 text-sm md:text-lg font-black uppercase tracking-widest transition-all relative group cursor-pointer ${activeTab === tab.id ? 'text-[#e8bb69]' : 'text-zinc-600 hover:text-white'
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#e8bb69]"
                />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {activeTab === 'posts' && (
              <div>
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                  <div className="flex-1 flex gap-2">
                    <div className="relative flex-1 group">
                      <input
                        type="text"
                        placeholder="TÌM KIẾM..."
                        value={postsSearchInput}
                        onChange={(e) => setPostsSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePostsSearch()}
                        className="w-full bg-zinc-900 border border-white/5 p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#e8bb69] transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                    </div>
                    <button
                      onClick={handlePostsSearch}
                      className="px-8 py-4 bg-[#e8bb69] text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-white transition-all cursor-pointer"
                    >
                      Lọc
                    </button>
                    <button
                      onClick={handleClearPostsSearch}
                      className="p-4 border border-white/10 hover:border-red-500/50 text-zinc-500 hover:text-red-500 transition-all cursor-pointer"
                      title="Xóa bộ lọc"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowPostForm(true)}
                    className="px-8 py-4 bg-white text-zinc-950 font-black uppercase text-xs tracking-[0.2em] hover:bg-[#e8bb69] transition-all cursor-pointer flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">+</span> Mẫu mới
                  </button>
                </div>
                {showPostForm && (
                  <PostForm
                    onClose={() => {
                      setShowPostForm(false)
                      setEditingPost(null)
                    }}
                    onSuccess={() => {
                      setShowPostForm(false)
                      setEditingPost(null)
                      fetchData()
                    }}
                    post={editingPost}
                  />
                )}
                <div className="overflow-x-auto border border-white/5">
                  <table className="w-full border-collapse bg-zinc-900/50 backdrop-blur-md min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 w-16">STT</th>
                        <th
                          className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-[#e8bb69] transition-colors"
                          onClick={() => handleSort('title', 'posts', setPostsSortColumn, setPostsSortDirection, postsSortColumn, postsSortDirection)}
                        >
                          <div className="flex items-center gap-2">
                            Tiêu đề
                            <SortIcon column="title" sortColumn={postsSortColumn} sortDirection={postsSortDirection} />
                          </div>
                        </th>
                        <th
                          className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-[#e8bb69] transition-colors"
                          onClick={() => handleSort('status', 'posts', setPostsSortColumn, setPostsSortDirection, postsSortColumn, postsSortDirection)}
                        >
                          <div className="flex items-center gap-2">
                            Trạng thái
                            <SortIcon column="status" sortColumn={postsSortColumn} sortDirection={postsSortDirection} />
                          </div>
                        </th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 hidden md:table-cell">Danh mục</th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 hidden lg:table-cell">Phương tiện</th>
                        <th
                          className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-[#e8bb69] transition-colors"
                          onClick={() => handleSort('created', 'posts', setPostsSortColumn, setPostsSortDirection, postsSortColumn, postsSortDirection)}
                        >
                          <div className="flex items-center gap-2">
                            Ngày tạo
                            <SortIcon column="created" sortColumn={postsSortColumn} sortDirection={postsSortDirection} />
                          </div>
                        </th>
                        <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post, index) => {
                        // Get featured media or first media as representative
                        const representativeMedia = post.media?.find(m => m.is_featured) || post.media?.[0]
                        const mediaCount = post.media?.length || 0
                        const stt = (postsPage - 1) * itemsPerPage + index + 1

                        return (
                          <tr key={post.id} className="hover:bg-zinc-800/50">
                            <td className="p-2 md:p-4 text-left text-xs md:text-sm text-gray-600">{stt}</td>
                            <td className="p-2 md:p-4 text-left text-xs md:text-sm">{post.title}</td>
                            <td className="p-6 text-left border-b border-white/5">
                              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border ${post.status === 'published'
                                ? 'bg-[#e8bb69]/10 text-[#e8bb69] border-[#e8bb69]/30'
                                : 'bg-zinc-800 text-zinc-500 border-white/5'
                                }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="p-2 md:p-4 text-left text-xs md:text-sm hidden md:table-cell">
                              {post.categories?.map(c => c.name).join(', ') || '-'}
                            </td>
                            <td className="p-2 md:p-4 text-left hidden lg:table-cell">
                              {representativeMedia ? (
                                <div className="flex items-center gap-3">
                                  {representativeMedia.type === 'video' ? (
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-black rounded overflow-hidden flex-shrink-0">
                                      {(() => {
                                        const thumbnailUrl = getVideoThumbnail(representativeMedia.url, representativeMedia.public_id, 1)
                                        return thumbnailUrl ? (
                                          <img
                                            src={thumbnailUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <video
                                            src={representativeMedia.url}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            playsInline
                                          />
                                        )
                                      })()}
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                      </div>
                                    </div>
                                  ) : (
                                    <img
                                      src={representativeMedia.url}
                                      alt={post.title}
                                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded flex-shrink-0"
                                    />
                                  )}
                                  <div className="hidden xl:flex flex-col">
                                    <span className="text-xs md:text-sm text-text">
                                      {representativeMedia.type === 'video' ? 'Video' : 'Image'}
                                    </span>
                                    {mediaCount > 1 && (
                                      <span className="text-xs text-text-light">
                                        +{mediaCount - 1} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-text-light text-xs md:text-sm">-</span>
                              )}
                            </td>
                            <td className="p-2 md:p-4 text-left text-xs md:text-sm whitespace-nowrap">{formatDate(post.created_at)}</td>
                            <td className="p-6 text-right border-b border-white/5">
                              <div className="flex justify-end gap-3">
                                <button
                                  className="p-3 bg-zinc-800 border border-white/5 hover:border-[#e8bb69] hover:text-[#e8bb69] transition-all cursor-pointer"
                                  onClick={() => {
                                    setEditingPost(post)
                                    setShowPostForm(true)
                                  }}
                                  title="Sửa"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button
                                  className="p-3 bg-zinc-800 border border-white/5 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer"
                                  onClick={() => handleDeletePost(post.id)}
                                  title="Xóa"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {postsTotalPages > 1 && (
                  <Pagination
                    currentPage={postsPage}
                    totalPages={postsTotalPages}
                    onPageChange={setPostsPage}
                  />
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                  <div className="flex-1 flex gap-2">
                    <div className="relative flex-1 group">
                      <input
                        type="text"
                        placeholder="TÌM KIẾM..."
                        value={bookingsSearchInput}
                        onChange={(e) => setBookingsSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleBookingsSearch()}
                        className="w-full bg-zinc-900 border border-white/5 p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#e8bb69] transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                    </div>
                    <button
                      onClick={handleBookingsSearch}
                      className="px-8 py-4 bg-[#e8bb69] text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-white transition-all cursor-pointer"
                    >
                      Lọc
                    </button>
                    <button
                      onClick={handleClearBookingsSearch}
                      className="p-4 border border-white/10 hover:border-red-500/50 text-zinc-500 hover:text-red-500 transition-all cursor-pointer"
                      title="Xóa bộ lọc"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="px-8 py-4 bg-white text-zinc-950 font-black uppercase text-xs tracking-[0.2em] hover:bg-[#e8bb69] transition-all cursor-pointer flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">+</span> Tin nhắn mới
                  </button>
                </div>

                {showBookingForm && (
                  <BookingForm
                    onClose={() => {
                      setShowBookingForm(false)
                      setEditingBooking(null)
                    }}
                    onSuccess={() => {
                      setShowBookingForm(false)
                      setEditingBooking(null)
                      fetchData()
                    }}
                    booking={editingBooking}
                  />
                )}

                <div className="overflow-x-auto border border-white/5">
                  <table className="w-full border-collapse bg-zinc-900/50 backdrop-blur-md min-w-[900px]">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 w-16">STT</th>
                        <th
                          className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-[#e8bb69] transition-colors"
                          onClick={() => handleSort('client_name', 'bookings', setBookingsSortColumn, setBookingsSortDirection, bookingsSortColumn, bookingsSortDirection)}
                        >
                          <div className="flex items-center gap-2">
                            Khách hàng
                            <SortIcon column="client_name" sortColumn={bookingsSortColumn} sortDirection={bookingsSortDirection} />
                          </div>
                        </th>
                        <th
                          className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-[#e8bb69] transition-colors"
                          onClick={() => handleSort('email', 'bookings', setBookingsSortColumn, setBookingsSortDirection, bookingsSortColumn, bookingsSortDirection)}
                        >
                          <div className="flex items-center gap-2">
                            Email
                            <SortIcon column="email" sortColumn={bookingsSortColumn} sortDirection={bookingsSortDirection} />
                          </div>
                        </th>
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500">Nội dung</th>
                        <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => {
                        const stt = (bookingsPage - 1) * itemsPerPage + index + 1
                        return (
                          <tr key={booking.id} className="hover:bg-zinc-800/50 transition-colors border-b border-white/5 last:border-0">
                            <td className="p-6 text-left text-xs font-bold text-zinc-500">{stt}</td>
                            <td className="p-6 text-left text-sm font-black text-white uppercase tracking-tight">{booking.client_name}</td>
                            <td className="p-6 text-left text-sm font-medium text-zinc-400">{booking.client_email}</td>
                            <td className="p-6 text-left text-sm text-zinc-500">
                              {booking.message ? (
                                <span className="block max-w-md line-clamp-2 italic" title={booking.message}>
                                  "{booking.message}"
                                </span>
                              ) : (
                                <span className="text-zinc-700 uppercase text-[10px] tracking-widest">Không có nội dung</span>
                              )}
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  className="p-3 bg-zinc-800 border border-white/5 hover:border-[#e8bb69] hover:text-[#e8bb69] transition-all cursor-pointer"
                                  onClick={() => {
                                    setEditingBooking(booking)
                                    setShowBookingForm(true)
                                  }}
                                  title="Sửa"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button
                                  className="p-3 bg-zinc-800 border border-white/5 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer"
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  title="Xóa"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {bookingsTotalPages > 1 && (
                  <Pagination
                    currentPage={bookingsPage}
                    totalPages={bookingsTotalPages}
                    onPageChange={setBookingsPage}
                  />
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                  <div className="flex-1 flex gap-2">
                    <div className="relative flex-1 group">
                      <input
                        type="text"
                        placeholder="TÌM KIẾM..."
                        value={categoriesSearchInput}
                        onChange={(e) => setCategoriesSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCategoriesSearch()}
                        className="w-full bg-zinc-900 border border-white/5 p-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-[#e8bb69] transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                    </div>
                    <button
                      onClick={handleCategoriesSearch}
                      className="px-8 py-4 bg-[#e8bb69] text-zinc-950 font-black uppercase text-xs tracking-widest hover:bg-white transition-all cursor-pointer"
                    >
                      Lọc
                    </button>
                    <button
                      onClick={handleClearCategoriesSearch}
                      className="p-4 border border-white/10 hover:border-red-500/50 text-zinc-500 hover:text-red-500 transition-all cursor-pointer"
                      title="Xóa bộ lọc"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowCategoryForm(true)}
                    className="px-8 py-4 bg-white text-zinc-950 font-black uppercase text-xs tracking-[0.2em] hover:bg-[#e8bb69] transition-all cursor-pointer flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">+</span> Danh mục mới
                  </button>
                </div>

                {showCategoryForm && (
                  <CategoryForm
                    onClose={() => setShowCategoryForm(false)}
                    onSuccess={() => {
                      setShowCategoryForm(false)
                      fetchData()
                    }}
                  />
                )}

                <div className="overflow-x-auto border border-white/5">
                  <table className="w-full border-collapse bg-zinc-900/50 backdrop-blur-md min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 w-16">STT</th>
                        <th
                          className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-[#e8bb69] transition-colors"
                          onClick={() => handleSort('name', 'categories', setCategoriesSortColumn, setCategoriesSortDirection, categoriesSortColumn, categoriesSortDirection)}
                        >
                          <div className="flex items-center gap-2">
                            Tên danh mục
                            <SortIcon column="name" sortColumn={categoriesSortColumn} sortDirection={categoriesSortDirection} />
                          </div>
                        </th>
                        <th
                          className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-[#e8bb69] transition-colors hidden md:table-cell"
                          onClick={() => handleSort('created', 'categories', setCategoriesSortColumn, setCategoriesSortDirection, categoriesSortColumn, categoriesSortDirection)}
                        >
                          <div className="flex items-center gap-2">
                            Ngày tạo
                            <SortIcon column="created" sortColumn={categoriesSortColumn} sortDirection={categoriesSortDirection} />
                          </div>
                        </th>
                        <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, index) => {
                        const stt = index + 1
                        return (
                          <tr key={category.id} className="hover:bg-zinc-800/50 transition-colors border-b border-white/5 last:border-0">
                            <td className="p-6 text-left text-xs font-bold text-zinc-500">{stt}</td>
                            <td className="p-6 text-left text-sm font-black text-white uppercase tracking-tight">{category.name}</td>
                            <td className="p-6 text-left text-sm text-zinc-400 whitespace-nowrap hidden md:table-cell">{formatDate(category.created_at)}</td>
                            <td className="p-6 text-right">
                              <button
                                className="p-3 bg-zinc-800 border border-white/5 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer"
                                onClick={() => handleDeleteCategory(category.id)}
                                title="Xóa"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
      />
    </div>
  )
}

function PostForm({ onClose, onSuccess, post }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    description: post?.description || '',
    status: post?.status || 'draft',
    category_ids: post?.categories?.map(c => c.id) || [],
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingMedia, setExistingMedia] = useState(post?.media || []) // Media hiện có của post
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const categoryDropdownRef = useRef(null)
  const videoUploaderRef = useRef(null)
  const imageUploaderRef = useRef(null)

  useEffect(() => {
    fetchCategories()
    // Load existing media when editing
    if (post?.id) {
      // Reload post from server to get latest data including is_featured
      client.get(`/posts/${post.id}`)
        .then(response => {
          console.log('Loaded post from server:', response.data)
          if (response.data?.media) {
            const mediaWithDefaults = response.data.media.map(m => ({
              ...m,
              is_featured: m.is_featured === true || m.is_featured === 'true', // Handle both boolean and string
              display_order: m.display_order || 0
            }))
            console.log('Setting existingMedia:', mediaWithDefaults.map(m => ({ id: m.id, is_featured: m.is_featured })))
            setExistingMedia(mediaWithDefaults)
          }
        })
        .catch(error => {
          console.error('Error loading post:', error)
          // Fallback to post.media if reload fails
          if (post?.media) {
            setExistingMedia(post.media.map(m => ({
              ...m,
              is_featured: m.is_featured === true || m.is_featured === 'true',
              display_order: m.display_order || 0
            })))
          }
        })
    } else if (post?.media) {
      // For new posts or if no id, use post.media directly
      setExistingMedia(post.media.map(m => ({
        ...m,
        is_featured: m.is_featured === true || m.is_featured === 'true',
        display_order: m.display_order || 0
      })))
    } else {
      // Reset if no post
      setExistingMedia([])
    }
  }, [post?.id]) // Only reload when post.id changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false)
        setCategorySearch('') // Reset search when closing
      }
    }

    if (categoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [categoryDropdownOpen])

  const fetchCategories = async () => {
    try {
      const response = await client.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let mediaData = []

      // Upload video to Cloudinary if file is selected (for both new and edit)
      if (videoUploaderRef.current) {
        const file = videoUploaderRef.current.getFile()
        if (file) {
          try {
            // Upload video - VideoUploader component will handle progress display
            const result = await videoUploaderRef.current.upload()
            mediaData.push(result)
          } catch (uploadErr) {
            setError(`Video upload failed: ${uploadErr.message}`)
            setLoading(false)
            return
          }
        }
      }

      // Upload images to Cloudinary if files are selected
      if (imageUploaderRef.current) {
        const files = imageUploaderRef.current.getFiles()
        if (files && files.length > 0) {
          try {
            // Upload images - ImageUploader component will handle progress display
            const results = await imageUploaderRef.current.upload()
            mediaData.push(...results)
          } catch (uploadErr) {
            setError(`Image upload failed: ${uploadErr.message}`)
            setLoading(false)
            return
          }
        }
      }

      // Create/update post with media data
      let finalMediaData = []

      if (post) {
        // Editing: convert existing media to MediaCreateInput format + add new media
        console.log('existingMedia before mapping:', existingMedia.map(m => ({ id: m.id, is_featured: m.is_featured })))
        const existingMediaInput = existingMedia.map((m, idx) => {
          const mediaItem = {
            type: m.type,
            provider: m.provider || 'cloudinary',
            public_id: m.public_id,
            secure_url: m.url, // url field maps to secure_url
            asset_id: m.meta_data?.asset_id || m.metadata?.asset_id,
            duration: m.duration,
            width: m.width,
            height: m.height,
            format: m.format,
            size: m.size,
            is_featured: Boolean(m.is_featured), // Ensure boolean value
            display_order: m.display_order !== undefined ? m.display_order : idx
          }
          console.log(`Media ${idx}:`, { public_id: m.public_id?.substring(0, 20), is_featured: mediaItem.is_featured, provider: mediaItem.provider })
          return mediaItem
        })
        finalMediaData = [...existingMediaInput, ...mediaData.map((m, idx) => ({
          ...m,
          is_featured: false, // New media is not featured by default
          display_order: existingMediaInput.length + idx
        }))]
      } else {
        // Creating: only new media, mark first one as featured
        finalMediaData = mediaData.map((m, idx) => ({
          ...m,
          is_featured: idx === 0, // First media is featured by default
          display_order: idx
        }))
      }

      const payload = {
        ...formData,
        // Always include media array when editing (even if empty, to allow deletion)
        // For new posts, only include if there's media
        ...(post ? { media: finalMediaData } : (mediaData.length > 0 ? { media: mediaData } : {}))
      }

      // Debug: log payload to check is_featured
      console.log('Payload media:', finalMediaData.map(m => ({
        public_id: m.public_id?.substring(0, 20),
        is_featured: m.is_featured,
        display_order: m.display_order
      })))

      if (post) {
        await client.put(`/posts/${post.id}`, payload)
      } else {
        await client.post('/posts', payload)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }


  const handleRemoveExistingMedia = (mediaId) => {
    setExistingMedia(prev => prev.filter(m => m.id !== mediaId))
  }

  const handleCategoryToggle = (categoryId) => {
    setFormData({
      ...formData,
      category_ids: formData.category_ids.includes(categoryId)
        ? formData.category_ids.filter(id => id !== categoryId)
        : [...formData.category_ids, categoryId]
    })
  }

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const handleSetFeatured = (mediaId) => {
    console.log('Setting featured for media:', mediaId)
    console.log('Current existingMedia:', existingMedia.map(m => ({ id: m.id, is_featured: m.is_featured })))
    setExistingMedia(prev => {
      const updated = prev.map(m => ({
        ...m,
        is_featured: String(m.id) === String(mediaId) // Convert to string for comparison
      }))
      console.log('Updated existingMedia:', updated.map(m => ({ id: m.id, is_featured: m.is_featured })))
      return updated
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-light mb-6">{post ? 'Edit Post' : 'Create Post'}</h2>
        {error && <div className="p-4 rounded mb-6 bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Title *</label>
            <input
              type="text"
              className="w-full p-3 border rounded transition-colors duration-300 text-base focus:outline-none"
              style={{
                borderColor: '#e0e0e0',
                color: '#001f3f'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e8bb69'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Description</label>
            <textarea
              className="w-full p-3 border border-border rounded transition-colors duration-300 text-base focus:outline-none focus:border-primary resize-y min-h-[120px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Status</label>
            <select
              className="w-full p-3 border rounded transition-colors duration-300 text-base focus:outline-none"
              style={{
                borderColor: '#e0e0e0',
                color: '#001f3f'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e8bb69'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Tags/Categories</label>
            <div ref={categoryDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full p-3 border rounded transition-colors duration-300 text-base focus:outline-none text-left flex items-center justify-between"
                style={{
                  borderColor: categoryDropdownOpen ? '#e8bb69' : '#e0e0e0',
                  color: '#001f3f'
                }}
              >
                <span className="truncate">
                  {formData.category_ids.length > 0
                    ? `${formData.category_ids.length} categor${formData.category_ids.length === 1 ? 'y' : 'ies'} selected`
                    : 'Select categories...'}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoryDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {/* Search input */}
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full p-2 border rounded text-sm focus:outline-none"
                      style={{
                        borderColor: '#e0e0e0',
                        color: '#001f3f'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#e8bb69'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    />
                  </div>
                  {/* Categories list */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={formData.category_ids.includes(cat.id)}
                            onChange={() => handleCategoryToggle(cat.id)}
                            className="w-4 h-4"
                            style={{ accentColor: '#e8bb69' }}
                          />
                          <span style={{ color: '#001f3f' }}>{cat.name}</span>
                        </label>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">
                        {categorySearch ? 'No categories found' : 'No categories available'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {formData.category_ids.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.category_ids.map((catId) => {
                  const cat = categories.find(c => c.id === catId)
                  return cat ? (
                    <span
                      key={catId}
                      className="px-2 py-1 text-xs rounded"
                      style={{ backgroundColor: '#e8bb69', color: '#001f3f' }}
                    >
                      {cat.name}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
          {/* Hiển thị media hiện có khi edit */}
          {post && existingMedia.length > 0 && (
            <div className="mb-6">
              <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Current Media ({existingMedia.length})</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                {existingMedia.map((media) => (
                  <div key={media.id} className="relative group border border-border rounded-lg overflow-hidden bg-secondary min-w-0">
                    {media.type === 'video' ? (
                      <div className="relative">
                        <video
                          src={media.url}
                          className="w-full h-40 object-cover"
                          controls={false}
                          muted
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {media.is_featured && (
                            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                              FEATURED
                            </div>
                          )}
                          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                            VIDEO
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetFeatured(media.id)}
                            className="px-4 py-2 rounded text-sm font-medium transition-all duration-300"
                            style={{
                              backgroundColor: media.is_featured ? '#e8bb69' : '#e8bb69',
                              color: '#001f3f'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a55f'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8bb69'}
                          >
                            {media.is_featured ? 'Featured' : 'Set Featured'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingMedia(media.id)}
                            className="px-4 py-2 rounded text-sm font-medium transition-all duration-300"
                            style={{
                              backgroundColor: '#001f3f',
                              color: '#ffffff'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003366'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#001f3f'}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={media.url}
                          alt={media.public_id}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {media.is_featured && (
                            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                              FEATURED
                            </div>
                          )}
                          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                            IMAGE
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetFeatured(media.id)}
                            className="px-4 py-2 rounded text-sm font-medium transition-all duration-300"
                            style={{
                              backgroundColor: media.is_featured ? '#e8bb69' : '#e8bb69',
                              color: '#001f3f'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8a55f'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8bb69'}
                          >
                            {media.is_featured ? 'Featured' : 'Set Featured'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingMedia(media.id)}
                            className="px-4 py-2 rounded text-sm font-medium transition-all duration-300"
                            style={{
                              backgroundColor: '#001f3f',
                              color: '#ffffff'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003366'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#001f3f'}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="p-2 min-w-0">
                      <p className="text-xs text-text-light truncate" title={media.public_id}>
                        {media.public_id.split('/').pop()}
                      </p>
                      {media.type === 'video' && media.duration && (
                        <p className="text-xs text-text-light truncate">Duration: {Math.round(media.duration)}s</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-light">
                Hover over media and click "Remove" to delete. Upload new files below to add more.
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Video (Optional)</label>
            <VideoUploader ref={videoUploaderRef} />
            {post && (
              <p className="text-xs text-text-light mt-2">
                Upload a new video to add to the post
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Images (Optional)</label>
            <ImageUploader ref={imageUploaderRef} multiple={true} />
            {post && (
              <p className="text-xs text-text-light mt-2">
                Upload new images to add to the post
              </p>
            )}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded text-base font-medium cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#e8bb69', color: '#001f3f' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#b8a55f')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8bb69'}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded border-2 text-base font-medium cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: 'transparent',
                color: '#001f3f',
                borderColor: '#001f3f'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8bb69'
                e.currentTarget.style.color = '#001f3f'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#001f3f'
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function BookingForm({ onClose, onSuccess, booking }) {
  const [formData, setFormData] = useState({
    client_name: booking?.client_name || '',
    client_email: booking?.client_email || '',
    message: booking?.message || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
      }
      if (booking) {
        await client.put(`/bookings/${booking.id}`, payload)
      } else {
        await client.post('/bookings', payload)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-light mb-6">{booking ? 'Edit Contact' : 'Create Contact'}</h2>
        {error && <div className="p-4 rounded mb-6 bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Client Name *</label>
            <input
              type="text"
              className="w-full p-3 border rounded transition-colors duration-300 text-base focus:outline-none"
              style={{
                borderColor: '#e0e0e0',
                color: '#001f3f'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e8bb69'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Client Email *</label>
            <input
              type="email"
              className="w-full p-3 border rounded transition-colors duration-300 text-base focus:outline-none"
              style={{
                borderColor: '#e0e0e0',
                color: '#001f3f'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e8bb69'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Message</label>
            <textarea
              className="w-full p-3 border rounded transition-colors duration-300 text-base focus:outline-none resize-none"
              style={{
                borderColor: '#e0e0e0',
                color: '#001f3f',
                minHeight: '100px'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e8bb69'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Optional message from client..."
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded text-base font-medium cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#e8bb69', color: '#001f3f' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#b8a55f')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8bb69'}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded border-2 text-base font-medium cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: 'transparent',
                color: '#001f3f',
                borderColor: '#001f3f'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8bb69'
                e.currentTarget.style.color = '#001f3f'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#001f3f'
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CategoryForm({ onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await client.post('/categories', { name })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-light mb-6">Create Category</h2>
        {error && <div className="p-4 rounded mb-6 bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: '#001f3f' }}>Name *</label>
            <input
              type="text"
              className="w-full p-3 border rounded transition-colors duration-300 text-base focus:outline-none"
              style={{
                borderColor: '#e0e0e0',
                color: '#001f3f'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e8bb69'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded text-base font-medium cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#e8bb69', color: '#001f3f' }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#b8a55f')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8bb69'}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded border-2 text-base font-medium cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: 'transparent',
                color: '#001f3f',
                borderColor: '#001f3f'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8bb69'
                e.currentTarget.style.color = '#001f3f'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#001f3f'
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Admin
