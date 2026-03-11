import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import { NavItem } from '../home/StudentHome'
import { getPosts, toggleLikePost, type PostResponse } from '../services/blogService'

const PostCard: React.FC<{ post: PostResponse; onLikeToggle: () => void }> = ({ post, onLikeToggle }) => {
  const { isAuthenticated } = useAuth()
  const [isLiking, setIsLiking] = useState(false)

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like posts.')
      return
    }
    
    if (isLiking) return

    try {
      setIsLiking(true)
      await toggleLikePost(post.id)
      onLikeToggle()
    } catch (error) {
      console.error('Failed to toggle like:', error)
      alert('Failed to like/unlike post')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <div className="mb-3">
          <p className="text-sm font-semibold text-slate-800">{post.authorName}</p>
          <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <Link to={`/community/${post.id}`} className="block">
          <h3 className="text-xl font-bold text-slate-900 hover:text-[#1976d2] transition-colors leading-tight">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 mt-2 line-clamp-3">{post.content}</p>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100">
          <button 
            onClick={handleUpvote}
            disabled={isLiking}
            className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${
              post.isLikedByCurrentUser 
                ? 'bg-red-100 text-red-600' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <i className={`fa-solid fa-heart ${post.isLikedByCurrentUser ? 'text-red-600' : 'text-slate-400'}`}></i>
            {post.likeCount}
          </button>
          <Link to={`/community/${post.id}`} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#1976d2]">
            <i className="fa-solid fa-comment text-slate-400"></i>
            {post.commentCount} Comments
          </Link>
        </div>
      </div>
    </div>
  )
}

const CommunityPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const fetchPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getPosts(pageNum, pageSize)
      setPosts(response.data)
      setPage(response.page)
      setTotalCount(response.count)
      setTotalPages(Math.ceil(response.count / response.pageSize))
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setError('Failed to load posts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(page)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      fetchPosts(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleLikeToggle = () => {
    fetchPosts(page) // Refresh current page
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoImg} alt="StudyMate" className="h-8 w-auto" />
              <span className="text-xl font-bold text-[#1976d2] tracking-tight">StudyMate</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/courses">Courses</NavItem>
              <NavItem to="/community">Community</NavItem>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/profile" className="h-8 w-8 rounded-full bg-[#1976d2] text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-bold text-slate-700">Log In</Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Community Forum</h1>
          {isAuthenticated && (
            <Link to="/community/create" className="bg-[#1976d2] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#1565c0] transition-colors text-sm">
              <i className="fa-solid fa-plus mr-2"></i>
              Create Post
            </Link>
          )}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976d2]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-10 text-center">
            <p className="text-slate-500">No posts yet. Be the first to create one!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            page === pageNum
                              ? 'bg-[#1976d2] text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-2 py-2">...</span>
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 mt-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
          © 2025 StudyMate. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default CommunityPage
