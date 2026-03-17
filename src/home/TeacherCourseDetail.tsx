import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { courseService } from '../services/courseService'
import MainHeader from '../components/MainHeader'

const TeacherCourseDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        navigate('/courses')
        return
      }

      try {
        const courseDetail = await courseService.getTeacherCourseDetail(Number(id))
        setCourse(courseDetail)
      } catch (error) {
        console.error('Failed to fetch course detail:', error)
        alert(error instanceof Error ? error.message : 'Failed to fetch course detail')
        navigate('/courses')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await courseService.deleteCourse(Number(id))
      alert('Course deleted successfully')
      navigate('/courses')
    } catch (error) {
      console.error('Failed to delete course:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete course')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MainHeader />

      <main className="mx-auto max-w-5xl px-4 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-[#1976d2] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Loading course detail...</p>
          </div>
        ) : course ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900">{course.title}</h1>
                  <p className="text-slate-500 mt-2">{course.description || 'No description provided.'}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>{course.totalEnrollments || 0} students enrolled</span>
                    <span>{course.totalSections || 0} sections</span>
                    <span>{course.totalQuizzes || 0} quizzes</span>
                    <span>{course.totalFlashcards || 0} flashcards</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/create-new-course?mode=edit&courseId=${course.id}`)}
                    className="bg-[#1976d2] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1565c0] transition-colors"
                  >
                    Edit Course
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Sections</h2>
              {course.sections?.length ? (
                <div className="space-y-4">
                  {course.sections.map((section: any) => (
                    <div key={section.id || section.orderIndex} className="rounded-lg border border-slate-200 p-4">
                      <h3 className="font-bold text-slate-900">{section.orderIndex}. {section.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{section.description || 'No description'}</p>
                      <p className="text-xs text-slate-500 mt-2">Materials: {section.materials?.length || 0}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No sections yet.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Quiz & Flashcards</h2>
              <p className="text-sm text-slate-600">Quizzes: {course.quizzes?.length || 0} | Flashcards: {course.flashcards?.length || 0}</p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default TeacherCourseDetail
