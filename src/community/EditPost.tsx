import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MainHeader from '../components/MainHeader'
import { getPostById, updatePost } from '../services/blogService'

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return

      try {
        setLoading(true)
        const postData = await getPostById(Number(postId))
        
        // Check if user is the author
        if (user && postData.authorId !== user.id) {
          alert('You can only edit your own posts.')
          navigate('/community')
          return
        }

        setTitle(postData.title)
        setContent(postData.content)
        setImageUrl(postData.imageUrl || '')
      } catch (error) {
        console.error('Failed to fetch post:', error)
        setError('Failed to load post. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (!isAuthenticated) {
      alert('Please log in to edit posts.')
      navigate('/login')
      return
    }

    fetchPost()
  }, [postId, isAuthenticated, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!postId) return

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const postData = {
        title: title.trim(),
        content: content.trim(),
        ...(imageUrl.trim() && { imageUrl: imageUrl.trim() })
      }

      await updatePost(Number(postId), postData)
      navigate(`/community/${postId}`)
    } catch (error) {
      console.error('Failed to update post:', error)
      setError('Failed to update post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976d2]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MainHeader />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link to={`/community/${postId}`} className="text-[#1976d2] hover:underline text-sm font-medium">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Post
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Edit Post</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2]"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-semibold text-slate-800 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content..."
                rows={10}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2] resize-y"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="mb-8">
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-slate-800 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2]"
                disabled={isSubmitting}
              />
              {imageUrl && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-2">Preview:</p>
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#1976d2] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1565c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save mr-2"></i>
                    Update Post
                  </>
                )}
              </button>
              <Link
                to={`/community/${postId}`}
                className="px-6 py-3 rounded-lg font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
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

export default EditPost
