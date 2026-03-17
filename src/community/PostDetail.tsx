import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MainHeader from '../components/MainHeader'
import { 
  getPostById, 
  getPostComments, 
  toggleLikePost, 
  addComment,
  deletePost,
  type PostDetailResponse,
  type CommentResponse 
} from '../services/blogService'

const CommentItem: React.FC<{ comment: CommentResponse }> = ({ comment }) => {
  const avatarUrl = comment.authorAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.authorName)
  const createdDate = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'
  
  return (
    <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
      <img src={avatarUrl} alt={comment.authorName} className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <p className="font-semibold text-slate-800">{comment.authorName}</p>
          <span className="text-xs text-slate-500">• {createdDate}</span>
        </div>
        <p className="text-sm text-slate-700 mt-1">{comment.content || ''}</p>
      </div>
    </div>
  )
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const [post, setPost] = useState<PostDetailResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchPostData = async () => {
    if (!postId) {
      console.log('No postId provided');
      return;
    }

    console.log('fetchPostData called with postId:', postId);

    try {
      setLoading(true)
      setError(null)
      
      const [postData, commentsData] = await Promise.all([
        getPostById(Number(postId)),
        getPostComments(Number(postId))
      ])
      
      console.log('Fetched postData:', postData);
      console.log('Fetched commentsData:', commentsData);
      
      setPost(postData)
      setComments(commentsData)
    } catch (error) {
      console.error('Failed to fetch post data:', error)
      setError('Failed to load post. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPostData()
  }, [postId])

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like posts.')
      return
    }
    
    if (!postId || isLiking) return

    try {
      setIsLiking(true)
      await toggleLikePost(Number(postId))
      await fetchPostData() // Refresh post data
    } catch (error) {
      console.error('Failed to toggle like:', error)
      alert('Failed to like/unlike post')
    } finally {
      setIsLiking(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Please log in to comment.')
      return
    }
    
    if (!postId || newComment.trim() === '' || isCommenting) return

    try {
      setIsCommenting(true)
      await addComment(Number(postId), { content: newComment.trim() })
      setNewComment('')
      await fetchPostData() // Refresh to show new comment
    } catch (error) {
      console.error('Failed to add comment:', error)
      alert('Failed to add comment. Please try again.')
    } finally {
      setIsCommenting(false)
    }
  }

  const handleDelete = async () => {
    if (!postId || isDeleting) return

    try {
      setIsDeleting(true)
      await deletePost(Number(postId))
      navigate('/community')
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post. Please try again.')
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976d2]"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">{error || 'Post not found.'}</p>
          <Link to="/community" className="text-[#1976d2] hover:underline">
            Back to Community
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = user && post.authorId === user.id

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MainHeader />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link to="/community" className="text-[#1976d2] hover:underline text-sm font-medium">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Community
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-slate-800">{post.authorName}</p>
              <p className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            
            {isAuthor && (
              <div className="flex gap-2">
                <Link
                  to={`/community/edit/${post.id}`}
                  className="px-3 py-1 text-sm rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <i className="fa-solid fa-edit mr-1"></i>
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <i className="fa-solid fa-trash mr-1"></i>
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">{post.title}</h1>
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-6" />
          )}
          <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={handleUpvote}
              disabled={isLiking}
              className={`flex items-center gap-1 text-lg font-bold px-4 py-2 rounded-full transition-colors ${
                post.isLikedByCurrentUser 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className={`fa-solid fa-heart ${post.isLikedByCurrentUser ? 'text-red-600' : 'text-slate-400'}`}></i>
              {post.likeCount}
            </button>
            <div className="flex items-center gap-1 text-lg font-bold text-slate-600">
              <i className="fa-solid fa-comment text-slate-400"></i>
              {post.commentCount} Comments
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Delete Post?</h3>
              <p className="text-slate-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h2>
          
          {isAuthenticated && (
            <form onSubmit={handleAddComment} className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-slate-200">
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2] text-sm"
                rows={3}
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isCommenting}
              ></textarea>
              <button
                type="submit"
                disabled={isCommenting || !newComment.trim()}
                className="mt-3 bg-[#1976d2] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#1565c0] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCommenting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Adding...
                  </>
                ) : (
                  'Add Comment'
                )}
              </button>
            </form>
          )}

          <div className="space-y-5">
            {comments.length > 0 ? (
              comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="text-slate-500 text-center py-10 bg-white rounded-lg border border-dashed border-slate-200">No comments yet. Be the first to comment!</p>
            )}
          </div>
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

export default PostDetail
