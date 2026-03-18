import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MainHeader from '../components/MainHeader'
import { useAuth } from '../contexts/AuthContext'
import {
  createFeedback,
  getAverageRating,
  getFeedbacks,
  getMyFeedback,
  type FeedbackItem,
  updateMyFeedback,
} from '../services/feedbackService'

const formatDate = (value: string | null) => {
  if (!value) return '--'
  return new Date(value).toLocaleString()
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, index) => (index < rating ? '★' : '☆')).join(' ')
}

const FeedbackPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const pageSize = 10

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hasMyFeedback, setHasMyFeedback] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingMyFeedback, setIsLoadingMyFeedback] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const myFeedbackSummary = useMemo(
    () => (hasMyFeedback ? 'Update your feedback' : 'Submit your feedback'),
    [hasMyFeedback],
  )

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / pageSize)), [totalCount, pageSize])

  const loadPublicData = async (targetPage: number) => {
    try {
      setIsLoadingList(true)
      const [feedbackResponse, avg] = await Promise.all([getFeedbacks(targetPage, pageSize), getAverageRating()])
      setFeedbacks(feedbackResponse.data)
      setPage(feedbackResponse.page)
      setTotalCount(feedbackResponse.count)
      setAverageRating(avg)
    } catch (fetchError: any) {
      setError(fetchError?.message || 'Failed to load feedback data')
    } finally {
      setIsLoadingList(false)
    }
  }

  const loadMyFeedback = async () => {
    if (!isAuthenticated) {
      setHasMyFeedback(false)
      setRating(5)
      setComment('')
      return
    }

    try {
      setIsLoadingMyFeedback(true)
      const myFeedback = await getMyFeedback()
      setRating(myFeedback.rating)
      setComment(myFeedback.comment || '')
      setHasMyFeedback(true)
    } catch (fetchError: any) {
      const message = fetchError?.message || ''
      if (message.toLowerCase().includes('not found')) {
        setHasMyFeedback(false)
        setRating(5)
        setComment('')
      } else {
        setError(message || 'Failed to load your feedback')
      }
    } finally {
      setIsLoadingMyFeedback(false)
    }
  }

  useEffect(() => {
    setError(null)
    loadPublicData(page)
  }, [page])

  useEffect(() => {
    setError(null)
    setSuccessMessage(null)
    loadMyFeedback()
  }, [isAuthenticated])

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!isAuthenticated) {
      setError('Please sign in to submit feedback')
      return
    }

    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5')
      return
    }

    if (comment.length > 1000) {
      setError('Comment must be 1000 characters or fewer')
      return
    }

    try {
      setIsSaving(true)
      const payload = {
        rating,
        comment: comment.trim() || null,
      }

      if (hasMyFeedback) {
        await updateMyFeedback(payload)
        setSuccessMessage('Your feedback has been updated successfully.')
      } else {
        await createFeedback(payload)
        setSuccessMessage('Your feedback has been submitted successfully.')
      }

      setHasMyFeedback(true)
      await Promise.all([loadPublicData(page), loadMyFeedback()])
    } catch (submitError: any) {
      setError(submitError?.message || 'Failed to save feedback')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MainHeader />

      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Website Feedback</h1>
          <p className="text-slate-600 mt-2">
            Share your experience with StudyMate. You can submit one feedback and update it anytime.
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Average rating</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {averageRating.toFixed(2)} / 5
              </p>
              <p className="text-amber-500 mt-1">{renderStars(Math.round(averageRating))}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total feedbacks</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</p>
              <p className="text-xs text-slate-500 mt-1">
                Page {page} / {totalPages}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900">{myFeedbackSummary}</h2>
            {isAuthenticated && (
              <span className="text-xs rounded-full px-3 py-1 bg-[#e3f2fd] text-[#1976d2] border border-[#bbdefb]">
                {user?.fullName || 'You'}
              </span>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
              Please <Link to="/login" className="font-semibold underline">sign in</Link> to submit or update your feedback.
            </div>
          ) : (
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Rating (1-5 stars)</p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1
                    const active = starValue <= rating
                    return (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        className={`text-2xl transition-colors ${active ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                        aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                      >
                        ★
                      </button>
                    )
                  })}
                  <span className="ml-2 text-sm font-semibold text-slate-700">{rating}/5</span>
                </div>
              </div>

              <div>
                <label htmlFor="feedback-comment" className="text-sm font-medium text-slate-700">
                  Comment
                </label>
                <textarea
                  id="feedback-comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you like and what we can improve"
                  maxLength={1000}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#64b5f6] focus:border-[#64b5f6]"
                />
                <p className="mt-1 text-xs text-slate-500">{comment.length}/1000</p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSaving || isLoadingMyFeedback}
                  className="rounded-md bg-[#1976d2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1565c0] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : hasMyFeedback ? 'Update Feedback' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900">Community feedbacks</h2>

          {isLoadingList ? (
            <div className="py-10 text-center text-slate-500">Loading feedbacks...</div>
          ) : feedbacks.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No feedback yet.</div>
          ) : (
            <>
              <div className="mt-4 space-y-4">
                {feedbacks.map((item) => (
                  <article key={item.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{item.userName}</p>
                        <p className="text-xs text-slate-500">
                          {item.updatedAt ? `Updated ${formatDate(item.updatedAt)}` : `Created ${formatDate(item.createdAt)}`}
                        </p>
                      </div>
                      <p className="text-amber-500 text-sm font-semibold">{renderStars(item.rating)}</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">{item.comment || 'No comment'}</p>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
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
                      }

                      if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <span key={pageNum} className="px-2 py-2 text-slate-500">
                            ...
                          </span>
                        )
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
        </section>
      </main>
    </div>
  )
}

export default FeedbackPage