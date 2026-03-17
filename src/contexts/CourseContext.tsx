import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// Define the shape of your course data matching the API requirements
export interface SectionMaterial {
  title: string
  description: string
  materialType: string
  fileUrl: string
  fileName: string
  fileSize: number
  orderIndex: number
}

export interface CourseSection {
  title: string
  description: string
  orderIndex: number
  materials: SectionMaterial[]
}

export interface QuizOption {
  optionText: string
  isCorrect: boolean
}

export interface QuizQuestion {
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'short_answer'
  options: QuizOption[]
}

export interface CourseQuiz {
  title: string
  questions: QuizQuestion[]
}

export interface CourseFlashcard {
  front: string
  back: string
}

export interface CourseData {
  title: string
  description: string
  categoryId: number
  level: string
  duration: number
  prerequisites: string
  sections: CourseSection[]
  quizzes: CourseQuiz[]
  flashcards: CourseFlashcard[]
}

export type CourseMode = 'create' | 'edit'

interface CourseContextType {
  courseData: CourseData
  mode: CourseMode
  editingCourseId: number | null
  updateCourseData: (data: Partial<CourseData>) => void
  setCourseData: (data: CourseData) => void
  setEditMode: (courseId: number) => void
  setCreateMode: () => void
  resetCourseData: () => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

const initialCourseData: CourseData = {
  title: '',
  description: '',
  categoryId: 0,
  level: 'beginner',
  duration: 0,
  prerequisites: '',
  sections: [],
  quizzes: [],
  flashcards: []
}

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courseData, setCourseData] = useState<CourseData>(initialCourseData)
  const [mode, setMode] = useState<CourseMode>('create')
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null)

  const updateCourseData = (data: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...data }))
  }

  const setFullCourseData = (data: CourseData) => {
    setCourseData(data)
  }

  const setEditMode = (courseId: number) => {
    setMode('edit')
    setEditingCourseId(courseId)
  }

  const setCreateMode = () => {
    setMode('create')
    setEditingCourseId(null)
  }

  const resetCourseData = () => {
    setCourseData(initialCourseData)
    setCreateMode()
  }

  return (
    <CourseContext.Provider
      value={{
        courseData,
        mode,
        editingCourseId,
        updateCourseData,
        setCourseData: setFullCourseData,
        setEditMode,
        setCreateMode,
        resetCourseData
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider')
  }
  return context
}
