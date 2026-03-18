const API_BASE_URL = 'https://localhost:7259/api/feedback'

const getAuthToken = (): string | null => {
  return localStorage.getItem('token')
}

const getAuthHeaders = (requireAuth: boolean = false) => {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (requireAuth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export interface FeedbackItem {
  id: number
  userId: number
  userName: string
  rating: number
  comment: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface FeedbackListResponse {
  message: string
  page: number
  pageSize: number
  count: number
  data: FeedbackItem[]
}

export interface FeedbackAverageResponse {
  message: string
  data: {
    averageRating: number
  }
}

export interface FeedbackDetailResponse {
  message: string
  data: FeedbackItem
}

export interface SaveFeedbackPayload {
  rating: number
  comment?: string | null
}

const extractErrorMessage = async (response: Response, fallback: string) => {
  try {
    const errorBody = await response.json()
    return errorBody?.message || fallback
  } catch {
    return fallback
  }
}

export const getFeedbacks = async (page: number = 1, pageSize: number = 10): Promise<FeedbackListResponse> => {
  const response = await fetch(`${API_BASE_URL}?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to fetch feedbacks'))
  }

  return response.json()
}

export const getAverageRating = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/average-rating`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to fetch average rating'))
  }

  const result: FeedbackAverageResponse = await response.json()
  return result.data?.averageRating ?? 0
}

export const getMyFeedback = async (): Promise<FeedbackItem> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: getAuthHeaders(true),
  })

  if (!response.ok) {
    const message = await extractErrorMessage(response, 'Failed to fetch your feedback')
    throw new Error(message)
  }

  const result: FeedbackDetailResponse = await response.json()
  return result.data
}

export const createFeedback = async (payload: SaveFeedbackPayload): Promise<FeedbackItem> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to create feedback'))
  }

  const result: FeedbackDetailResponse = await response.json()
  return result.data
}

export const updateMyFeedback = async (payload: SaveFeedbackPayload): Promise<FeedbackItem> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to update feedback'))
  }

  const result: FeedbackDetailResponse = await response.json()
  return result.data
}