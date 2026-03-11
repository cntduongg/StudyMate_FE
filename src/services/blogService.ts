const API_BASE_URL = 'https://localhost:7259/api/blog';

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export interface PostResponse {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginatedPostsResponse {
  message: string;
  page: number;
  pageSize: number;
  count: number;
  data: PostResponse[];
}

export interface CommentResponse {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string | null;
  content: string | null;
  createdAt: string | null;
}

export interface PostDetailResponse {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface CreateCommentRequest {
  content: string;
}

// Get all posts with pagination
export const getPosts = async (page: number = 1, pageSize: number = 10): Promise<PaginatedPostsResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

// Get post detail by ID
export const getPostById = async (postId: number): Promise<PostDetailResponse> => {
  console.log('Fetching post:', postId);
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  console.log('Post response status:', response.status);
  
  if (!response.ok) {
    throw new Error('Failed to fetch post details');
  }

  const data = await response.json();
  console.log('Post data received:', data);
  
  // If API returns { data: {...} }, extract the object
  if (data && typeof data === 'object' && 'data' in data && !data.id) {
    return data.data;
  }
  
  return data;
};

// Create a new post
export const createPost = async (postData: CreatePostRequest): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
};

// Update a post
export const updatePost = async (postId: number, postData: UpdatePostRequest): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error('Failed to update post');
  }

  return response.json();
};

// Delete a post
export const deletePost = async (postId: number): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  return response.json();
};

// Get posts by user ID
export const getUserPosts = async (userId: number): Promise<PostResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user posts');
  }

  return response.json();
};

// Like/unlike a post (toggle)
export const toggleLikePost = async (postId: number): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to like/unlike post');
  }

  return response.json();
};

// Add comment to a post
export const addComment = async (postId: number, commentData: CreateCommentRequest): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  return response.json();
};

// Get all comments for a post
export const getPostComments = async (postId: number): Promise<CommentResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  const data = await response.json();
  console.log('GET Comments Response:', data); // Debug log
  
  // If API returns { data: [...] }, extract the array
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  
  // If API returns array directly
  return data;
};
