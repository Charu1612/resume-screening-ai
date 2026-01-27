import api from './auth'

export const resumeAPI = {
  uploadResume: (formData) => api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  analyzeResume: (data) => api.post('/resume/analyze', data),
  getATSScore: (jobId) => api.get(`/resume/ats-score/${jobId}`),
  getSkillAnalysis: (jobId) => api.get(`/resume/skill-analysis/${jobId}`),
}