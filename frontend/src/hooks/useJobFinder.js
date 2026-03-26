import { useState, useEffect, useCallback } from 'react'
import { jobsApi, savedApi, applyApi } from '../services/api'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true); setError(null)
    try {
      const hasParams = Object.values(params).some(v => v !== undefined && v !== '' && v !== null)
      const data = hasParams ? await jobsApi.search(params) : await jobsApi.getAll()
      setJobs(data)
    } catch (e) {
      setError('Failed to load jobs. Is the backend running?')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])
  return { jobs, loading, error, fetchJobs }
}

export function useSaved() {
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    savedApi.getSavedIds().then(setSavedIds).catch(() => {})
  }, [])

  const toggle = useCallback(async (jobId) => {
    const token = localStorage.getItem('token')
    if (!token) { alert('Please sign in to save jobs.'); return }
    try {
      const res = await savedApi.toggle(jobId)
      setSavedIds(prev => res.saved ? [...prev, jobId] : prev.filter(id => id !== jobId))
    } catch (e) { console.error('Toggle save error:', e) }
  }, [])

  return { savedIds, toggle, isSaved: (id) => savedIds.includes(id) }
}

export function useApplications() {
  const [appliedIds, setAppliedIds] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    applyApi.getMyApplications()
      .then(apps => { setApplications(apps); setAppliedIds(apps.map(a => a.jobId)) })
      .catch(() => {})
  }, [])

  const apply = useCallback(async (data) => {
    const res = await applyApi.submit(data)
    setAppliedIds(prev => [...prev, data.jobId])
    setApplications(prev => [res, ...prev])
    return res
  }, [])

  return { appliedIds, applications, apply, hasApplied: (id) => appliedIds.includes(id) }
}
