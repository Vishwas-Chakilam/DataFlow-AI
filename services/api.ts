// API Service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('dataflow_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('dataflow_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('dataflow_token');
};

export const getUser = (): any | null => {
  const userStr = localStorage.getItem('dataflow_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: any): void => {
  localStorage.setItem('dataflow_user', JSON.stringify(user));
};

export const removeUser = (): void => {
  localStorage.removeItem('dataflow_user');
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// File upload helper
async function apiUpload<T>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Authentication APIs
export const authAPI = {
  signup: async (username: string, email: string, password: string) => {
    const response = await apiRequest<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    setToken(response.token);
    setUser(response.user);
    return response;
  },

  signin: async (email: string, password: string) => {
    const response = await apiRequest<{ token: string; user: any }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.token);
    setUser(response.user);
    return response;
  },

  logout: () => {
    removeToken();
    removeUser();
  },
};

// Dataset APIs
export const datasetAPI = {
  upload: async (file: File) => {
    return apiUpload<{ dataset: any; message: string }>('/datasets/upload', file);
  },

  get: async (datasetId: number) => {
    return apiRequest<any>(`/datasets/${datasetId}`);
  },
};

// Processing APIs
export const processingAPI = {
  gathering: async (datasetId: number) => {
    return apiRequest<{ workflow_id: number; data: any; insights: string }>('/process/gathering', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId }),
    });
  },

  cleaning: async (datasetId: number) => {
    return apiRequest<{ workflow_id: number; data: any }>('/process/cleaning', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId }),
    });
  },

  transformation: async (datasetId: number) => {
    return apiRequest<{ workflow_id: number; data: any }>('/process/transformation', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId }),
    });
  },
};

// Model APIs
export const modelAPI = {
  suggest: async (datasetId: number) => {
    return apiRequest<{ suggestions: string[] }>('/models/suggest', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId }),
    });
  },

  train: async (datasetId: number, models: string[], splitRatio: number) => {
    return apiRequest<{ models: any[]; message: string }>('/models/train', {
      method: 'POST',
      body: JSON.stringify({
        dataset_id: datasetId,
        models,
        split_ratio: splitRatio,
      }),
    });
  },

  get: async (modelId: number) => {
    return apiRequest<any>(`/models/${modelId}`);
  },

  predict: async (modelId: number, features: Record<string, string>) => {
    return apiRequest<{ prediction: any; prediction_id: number }>(`/models/${modelId}/predict`, {
      method: 'POST',
      body: JSON.stringify({ features }),
    });
  },

  download: async (modelId: number): Promise<Blob> => {
    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/models/${modelId}/download`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  },
};

// Visualization APIs
export const visualizationAPI = {
  generate: async (datasetId: number, type: string = 'auto') => {
    return apiRequest<{ visualization_id: number; data: any }>('/visualizations/generate', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, type }),
    });
  },
};

// History APIs
export const historyAPI = {
  getAll: async () => {
    return apiRequest<{ history: any[] }>('/history');
  },

  load: async (sessionId: number) => {
    return apiRequest<any>(`/history/${sessionId}/load`, {
      method: 'POST',
    });
  },
};

export default {
  auth: authAPI,
  dataset: datasetAPI,
  processing: processingAPI,
  model: modelAPI,
  visualization: visualizationAPI,
  history: historyAPI,
};