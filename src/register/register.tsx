import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://localhost:7259/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      // Registration successful
      const data = await response.json()
      console.log('Registration success:', data)
      alert('Registration successful! Please sign in.')
      navigate('/login')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
      <div className="mb-10 flex flex-col items-center space-y-3">
        {/* Brand logo image */}
        <div className="flex items-center justify-center">
          <img
            src={LogoImg}
            alt="StudyMate Logo"
            className="h-16 w-auto object-contain drop-shadow-md mr-4"
          />
        </div>
        <p className="text-sm text-gray-600">Start your learning journey today</p>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200 px-10 py-8">
        <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
        <p className="mt-1 text-xs text-gray-500">
          Sign up to start learning with StudyMate
        </p>

        {error && (
          <div className="mt-4 p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Full Name
            </label>
            <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm focus-within:border-[#1976d2] focus-within:ring-1 focus-within:ring-[#1976d2]">
              <span className="mr-2 text-gray-400">
                <i className="fa-regular fa-user" />
              </span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border-none outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm focus-within:border-[#1976d2] focus-within:ring-1 focus-within:ring-[#1976d2]">
              <span className="mr-2 text-gray-400">
                <i className="fa-regular fa-envelope" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full border-none outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm focus-within:border-[#1976d2] focus-within:ring-1 focus-within:ring-[#1976d2]">
              <span className="mr-2 text-gray-400">
                <i className="fa-solid fa-lock" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border-none outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Role
            </label>
            <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm focus-within:border-[#1976d2] focus-within:ring-1 focus-within:ring-[#1976d2]">
              <span className="mr-2 text-gray-400">
                <i className="fa-solid fa-id-badge" />
              </span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border-none outline-none text-gray-800 bg-transparent text-sm"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-md bg-[#1976d2] py-2 text-sm font-medium text-white shadow hover:bg-[#145ca5] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="mt-4 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="mx-3 text-[10px] text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="text-[#ea4335] text-base">G</span>
            <span>Continue with Google</span>
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1976d2] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

