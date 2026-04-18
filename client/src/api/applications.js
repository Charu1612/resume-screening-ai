import api from './auth'

export const applicationsAPI = {
  applyToJob: (applicationData) => api.post('/applications', applicationData),
  getCandidateApplications: () => api.get('/applications/candidate'),
  getCompanyApplications: () => api.get('/applications/company'),
  updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
}