import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialJobs } from '../utils/data';

const JobContext = createContext();
export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('job-tracker-pro-jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });

  useEffect(() => {
    localStorage.setItem('job-tracker-pro-jobs', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job) => setJobs(prev => [{...job, id: 'job_' + Date.now()}, ...prev]);
  const updateJob = (id, updates) => setJobs(prev => prev.map(j => j.id === id ? {...j, ...updates} : j));
  const deleteJob = (id) => setJobs(prev => prev.filter(j => j.id !== id));

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, setJobs }}>
      {children}
    </JobContext.Provider>
  );
};
