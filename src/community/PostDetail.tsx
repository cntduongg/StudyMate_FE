import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import { NavItem } from '../home/StudentHome'
import { mockPosts, type Comment, type User, type Post } from './data'

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
      <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <p className="font-semibold text-slate-800">{comment.author.name}</p>
          <span className="text-xs text-slate-500">• {comment.timestamp}</span>
        </div>
        <p className="text-sm text-slate-700 mt-1">{comment.content}</p>
      </div>
    </div>
  )
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const { isAuthenticated, user } = useAuth()
  const [post, setPost] = useState<Post | undefined>(
    mockPosts.find(p => p.id === postId)
  )
  const [newComment, setNewComment] = useState('')
  const [upvotes, setUpvotes] = useState(post?.upvotes || 0)
  const [upvoted, setUpvoted] = useState(false)

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-xl text-slate-600">Post not found.</p>
      </div>
    )
  }

  const handleUpvote = () => {
    if (!isAuthenticated) {
      alert('Please log in to upvote.')
      return
    }
    if (!upvoted) {
      setUpvotes(prev => prev + 1)
      setUpvoted(true)
    } else {
      setUpvotes(prev => prev - 1)
      setUpvoted(false)
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('Please log in to comment.')
      return
    }
    if (newComment.trim() === '') return

    const commentAuthor: User = user ? {
      id: user.id || 'temp-user-id', // Assuming user has an id
      name: user.fullName || 'Anonymous',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg' // Default avatar
    } : {
      id: 'guest',
      name: 'Guest',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    }

    const comment: Comment = {
      id: `c${post.comments.length + 1}`,
      author: commentAuthor,
      content: newComment,
      timestamp: 'Just now'
    }

    setPost(prevPost => {
      if (!prevPost) return prevPost
      return {
        ...prevPost,
        comments: [...prevPost.comments, comment]
      }
    })
    setNewComment('')
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
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={post.author.avatarUrl} alt={post.author.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-lg font-semibold text-slate-800">{post.author.name}</p>
              <p className="text-sm text-slate-500">{post.timestamp}</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">{post.title}</h1>
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-6" />
          )}
          <p className="text-base text-slate-700 leading-relaxed">{post.content}</p>

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={handleUpvote}
              className={`flex items-center gap-1 text-lg font-bold px-4 py-2 rounded-full transition-colors ${upvoted ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <i className={`fa-solid fa-heart ${upvoted ? 'text-red-600' : 'text-slate-400'}`}></i>
              {upvotes}
            </button>
            <div className="flex items-center gap-1 text-lg font-bold text-slate-600">
              <i className="fa-solid fa-comment text-slate-400"></i>
              {post.comments.length} Comments
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Comments ({post.comments.length})</h2>
          
          {isAuthenticated && (
            <form onSubmit={handleAddComment} className="mb-8 p-5 bg-white rounded-lg shadow-sm border border-slate-200">
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2] text-sm"
                rows={3}
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-3 bg-[#1976d2] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#1565c0] transition-colors text-sm"
              >
                Add Comment
              </button>
            </form>
          )}

          <div className="space-y-5">
            {post.comments.length > 0 ? (
              post.comments.map(comment => (
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
