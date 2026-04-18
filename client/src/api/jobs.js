import api from './auth'

export const jobsAPI = {
  getAllJobs: () => api.get('/jobs'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getCompanyJobs: () => api.get('/jobs/company'),
}