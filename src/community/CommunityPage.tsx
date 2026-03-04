import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import { NavItem } from '../home/StudentHome'
import { mockPosts, type Post } from './data'

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [upvoted, setUpvoted] = useState(false)

  const handleUpvote = () => {
    if (!upvoted) {
      setUpvotes(prev => prev + 1)
      setUpvoted(true)
    } else {
      setUpvotes(prev => prev - 1)
      setUpvoted(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <img src={post.author.avatarUrl} alt={post.author.name} className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{post.author.name}</p>
            <p className="text-xs text-slate-500">{post.timestamp}</p>
          </div>
        </div>
        <Link to={`/community/${post.id}`} className="block">
          <h3 className="text-xl font-bold text-slate-900 hover:text-[#1976d2] transition-colors leading-tight">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 mt-2 line-clamp-3">{post.content}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map(tag => (
            <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100">
          <button 
            onClick={handleUpvote}
            className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${upvoted ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <i className={`fa-solid fa-heart ${upvoted ? 'text-red-600' : 'text-slate-400'}`}></i>
            {upvotes}
          </button>
          <Link to={`/community/${post.id}`} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#1976d2]">
            <i className="fa-solid fa-comment text-slate-400"></i>
            {post.comments.length} Comments
          </Link>
        </div>
      </div>
    </div>
  )
}

const CommunityPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()

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
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Community Forum</h1>
        
        <div className="space-y-6">
          {mockPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
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

export default CommunityPage
