import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authApi = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login:    (data) => api.post('/auth/login', data).then(r => r.data),
  me:       ()     => api.get('/auth/me').then(r => r.data),
  updateProfile: (data) => api.put('/auth/profile', data).then(r => r.data),
  uploadResume:  (file) => {
    const fd = new FormData(); fd.append('file', file)
    return api.post('/auth/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
  },
}

export const jobsApi = {
  getAll:  ()       => api.get('/jobs').then(r => r.data),
  getById: (id)     => api.get(`/jobs/${id}`).then(r => r.data),
  search:  (params) => api.get('/jobs/search', { params }).then(r => r.data),
}

export const savedApi = {
  getSaved:    () => api.get('/saved').then(r => r.data),
  getSavedIds: () => api.get('/saved/ids').then(r => r.data),
  toggle: (jobId)  => api.post(`/saved/${jobId}`).then(r => r.data),
}

export const applyApi = {
  submit:           (data) => api.post('/applications', data).then(r => r.data),
  getMyApplications: ()    => api.get('/applications/my').then(r => r.data),
}

export default api
