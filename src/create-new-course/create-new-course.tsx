import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCourse } from '../contexts/CourseContext'
import type { CourseData } from '../contexts/CourseContext'
import { courseService } from '../services/courseService'
import MainHeader from '../components/MainHeader'

const Step: React.FC<{
  number: number
  title: string
  active?: boolean
  completed?: boolean
}> = ({ number, title, active = false, completed = false }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
          active
            ? 'bg-[#1976d2] text-white ring-4 ring-blue-100'
            : completed
            ? 'bg-green-500 text-white'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        {completed ? <i className="fa-solid fa-check"></i> : number}
      </div>
      <div
        className={`mt-2 text-[10px] font-medium uppercase tracking-wide ${
          active ? 'text-[#1976d2]' : 'text-slate-500'
        }`}
      >
        {title}
      </div>
    </div>
  )
}

const CreateNewCourse: React.FC = () => {
  const { courseData, updateCourseData, setCourseData, setEditMode, resetCourseData, mode, editingCourseId } = useCourse()
  const [searchParams] = useSearchParams()
  const currentStep: number = 1
  const [categories, setCategories] = useState<any[]>([])
  const [loadingCourse, setLoadingCourse] = useState(false)

  React.useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7259/api/Category/all')
        if (response.ok) {
          const result = await response.json()
          if (result && result.data) {
            setCategories(result.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  React.useEffect(() => {
    const modeParam = searchParams.get('mode')
    const courseIdParam = searchParams.get('courseId')

    if (modeParam === 'edit' && courseIdParam) {
      const courseId = Number(courseIdParam)
      if (!courseId || (mode === 'edit' && editingCourseId === courseId)) {
        return
      }

      const loadCourseForEdit = async () => {
        try {
          setLoadingCourse(true)
          const detail = await courseService.getTeacherCourseDetail(courseId)

          const mappedCourseData: CourseData = {
            title: detail.title || '',
            description: detail.description || '',
            categoryId: detail.categoryId || 0,
            level: 'beginner',
            duration: 0,
            prerequisites: '',
            sections: (detail.sections || []).map((section) => ({
              title: section.title || '',
              description: section.description || '',
              orderIndex: section.orderIndex || 0,
              materials: (section.materials || []).map((material) => ({
                title: material.title || '',
                description: material.description || '',
                materialType: material.materialType || 'other',
                fileUrl: material.fileUrl || '',
                fileName: material.fileName || '',
                fileSize: material.fileSize || 0,
                orderIndex: material.orderIndex || 0
              }))
            })),
            quizzes: (detail.quizzes || []).map((quiz) => ({
              title: quiz.title || '',
              questions: (quiz.questions || []).map((question) => ({
                questionText: question.questionText || '',
                questionType: question.questionType === 'true_false' ? 'true_false' : 'multiple_choice',
                options: (question.options || []).map((option) => ({
                  optionText: option.optionText || '',
                  isCorrect: option.isCorrect
                }))
              }))
            })),
            flashcards: (detail.flashcards || []).map((flashcard) => ({
              front: flashcard.front || '',
              back: flashcard.back || ''
            }))
          }

          setCourseData(mappedCourseData)
          setEditMode(courseId)
        } catch (error) {
          console.error('Failed to load course for edit:', error)
          alert(error instanceof Error ? error.message : 'Failed to load course data')
        } finally {
          setLoadingCourse(false)
        }
      }

      loadCourseForEdit()
      return
    }

    if (mode !== 'create') {
      resetCourseData()
    }
  }, [searchParams, setCourseData, setEditMode, resetCourseData, mode, editingCourseId])

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MainHeader />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1976d2] px-4 py-2 rounded-md hover:bg-[#1565c0] transition-colors mb-8 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">{mode === 'edit' ? 'Edit Course' : 'Create New Course'}</h1>
          <p className="mt-2 text-slate-600">Follow the steps to create your course</p>
        </div>

        {loadingCourse && (
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 text-sm font-medium">
            Loading course data for edit...
          </div>
        )}

        {/* Stepper */}
        <div className="mb-12 relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
          <div className="flex justify-between relative px-4">
            <Step number={1} title="Basic Info" active={currentStep === 1} completed={currentStep > 1} />
            <Step number={2} title="Curriculum" active={currentStep === 2} completed={currentStep > 2} />
            <Step number={3} title="Quiz Setup" active={currentStep === 3} completed={currentStep > 3} />
            <Step number={4} title="Flashcards" active={currentStep === 4} completed={currentStep > 4} />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
          
          <form className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Advanced React Patterns"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all"
                value={courseData.title}
                onChange={(e) => updateCourseData({ title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="What will students learn in this course?"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all resize-none"
                value={courseData.description}
                onChange={(e) => updateCourseData({ description: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all bg-white"
                value={courseData.categoryId}
                onChange={(e) => updateCourseData({ categoryId: Number(e.target.value) })}
              >
                <option value={0}>Select Category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value={1}>Development</option>
                    <option value={2}>Business</option>
                    <option value={3}>Design</option>
                    <option value={4}>Marketing</option>
                  </>
                )}
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                to="/create-new-course/curriculum"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1976d2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#1565c0] transition-colors"
              >
                Next <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateNewCourse
