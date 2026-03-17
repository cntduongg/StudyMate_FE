const API_BASE_URL = 'https://localhost:7259/api/Course'

const getAuthToken = () => localStorage.getItem('token')

const buildAuthHeaders = (extraHeaders?: HeadersInit): HeadersInit => {
  const token = getAuthToken()
  return {
    ...(extraHeaders || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const parseErrorMessage = async (response: Response, fallback: string) => {
  const errorText = await response.text()
  if (!errorText) return fallback

  try {
    const errorJson = JSON.parse(errorText)
    return errorJson?.message || fallback
  } catch {
    return errorText
  }
}

export interface CourseApiResponse<T> {
  message?: string
  count?: number
  data: T
}

export interface CourseSummary {
  id: number
  title: string
  description?: string
  status?: string
  categoryId?: number
  categoryName?: string
  thumbnailUrl?: string
  averageRating?: number
  totalRatings?: number
  totalEnrollments?: number
  totalSections?: number
  totalQuizzes?: number
  totalFlashcards?: number
  updatedAt?: string
}

export interface CourseDetail extends CourseSummary {
  sections?: Array<{
    id?: number
    title: string
    description?: string
    orderIndex: number
    materials?: Array<{
      id?: number
      title: string
      description?: string
      materialType: string
      fileUrl: string
      fileName?: string
      fileSize?: number
      orderIndex: number
    }>
  }>
  quizzes?: Array<{
    id?: number
    title: string
    questions: Array<{
      id?: number
      questionText: string
      questionType: 'multiple_choice' | 'true_false' | 'short_answer'
      options: Array<{
        id?: number
        optionText: string
        isCorrect: boolean
      }>
    }>
  }>
  flashcards?: Array<{
    id?: number
    front: string
    back: string
  }>
}

export interface UpsertCoursePayload {
  title: string
  description: string
  categoryId: number
  sections: Array<{
    title: string
    description: string
    orderIndex: number
    materials: Array<{
      title: string
      description: string
      materialType: string
      fileUrl: string
      fileName: string
      fileSize: number
      orderIndex: number
    }>
  }>
  quizzes: Array<{
    title: string
    questions: Array<{
      questionText: string
      questionType: 'multiple_choice' | 'true_false' | 'short_answer'
      options: Array<{
        optionText: string
        isCorrect: boolean
      }>
    }>
  }>
  flashcards: Array<{
    front: string
    back: string
  }>
}

export const courseService = {
  async getMyCourses() {
    const response = await fetch(`${API_BASE_URL}/my-courses`, {
      headers: buildAuthHeaders()
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, 'Failed to fetch courses'))
    }

    const result = (await response.json()) as CourseApiResponse<CourseSummary[]>
    return result.data || []
  },

  async getTeacherCourseDetail(courseId: number) {
    const response = await fetch(`${API_BASE_URL}/${courseId}`, {
      headers: buildAuthHeaders()
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, 'Failed to fetch course detail'))
    }

    const result = (await response.json()) as CourseApiResponse<CourseDetail>
    return result.data
  },

  async createCourse(payload: UpsertCoursePayload) {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: buildAuthHeaders({
        'Content-Type': 'application/json',
        accept: '*/*'
      }),
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, 'Failed to create course'))
    }

    return response.json()
  },

  async updateCourse(courseId: number, payload: UpsertCoursePayload) {
    const response = await fetch(`${API_BASE_URL}/update/${courseId}`, {
      method: 'PUT',
      headers: buildAuthHeaders({
        'Content-Type': 'application/json',
        accept: '*/*'
      }),
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, 'Failed to update course'))
    }

    return response.json()
  },

  async deleteCourse(courseId: number) {
    const response = await fetch(`${API_BASE_URL}/${courseId}`, {
      method: 'DELETE',
      headers: buildAuthHeaders()
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, 'Failed to delete course'))
    }

    return response.json()
  }
}
