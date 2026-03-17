import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { courseService } from '../services/courseService'
import MainHeader from '../components/MainHeader'

const CourseCard: React.FC<{
  course: any
  onView: (courseId: number) => void
  onEdit: (courseId: number) => void
  onDelete: (courseId: number) => void
}> = ({ course, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group p-5">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 aspect-video bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-book text-3xl"></i>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1976d2] transition-colors">{course.title}</h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{course.description || 'No description provided.'}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {course.status === 'active' ? 'Published' : 'Draft'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-users text-slate-400"></i>
              <span>{course.totalEnrollments || 0} students enrolled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-clock text-slate-400"></i>
              <span>Last updated: {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => onView(course.id)}
              className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              View Course
            </button>
            <button
              onClick={() => onEdit(course.id)}
              className="bg-[#1976d2] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1565c0] transition-colors"
            >
              Edit Course
            </button>
            <button
              onClick={() => onDelete(course.id)}
              className="ml-auto text-red-500 hover:text-red-700 text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TeacherCourses: React.FC = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseData = await courseService.getMyCourses()
        setCourses(courseData)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewCourse = (courseId: number) => {
    navigate(`/teacher/courses/${courseId}`)
  }

  const handleEditCourse = (courseId: number) => {
    navigate(`/create-new-course?mode=edit&courseId=${courseId}`)
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await courseService.deleteCourse(courseId)
      setCourses(prev => prev.filter(c => c.id !== courseId))
      alert('Course deleted successfully')
    } catch (error) {
      console.error('Failed to delete course:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete course')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MainHeader />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Course Management</h1>
            <p className="text-slate-500 mt-1">Create, edit, and manage your educational content</p>
          </div>
          <Link 
            to="/create-new-course"
            className="bg-[#1976d2] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#1565c0] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Create New Course
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search your courses by title..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-[#1976d2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your courses...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onView={handleViewCourse}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-book-open text-3xl text-slate-300"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">No courses found</h3>
              <p className="text-slate-500 mt-2">
                {searchTerm ? 'Try adjusting your search term' : "You haven't created any courses yet."}
              </p>
              {!searchTerm && (
                <Link 
                  to="/create-new-course" 
                  className="mt-6 inline-block bg-[#1976d2] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#1565c0]"
                >
                  Create Your First Course
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TeacherCourses
