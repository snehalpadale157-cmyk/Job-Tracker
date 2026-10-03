import React from 'react';
import { useJobs } from '../context/JobContext';
import { Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { jobs } = useJobs();
  
  const stats = {
    total: jobs.length,
    interviews: jobs.filter(j => j.status === 'Interview').length,
    offers: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Link to="/applications/new" className="btn btn-primary">Add Job</Link>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card p-4">
          <div className="text-sm text-secondary">Total Applications</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-secondary">Interviews</div>
          <div className="text-2xl font-bold mt-2">{stats.interviews}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-secondary">Offers</div>
          <div className="text-2xl font-bold mt-2">{stats.offers}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-secondary">Rejected</div>
          <div className="text-2xl font-bold mt-2">{stats.rejected}</div>
        </div>
      </div>
      
      <div className="card p-6 mt-4">
        <h3 className="text-xl font-bold mb-4">Recent Applications</h3>
        <div className="flex flex-col gap-2">
          {jobs.slice(0, 5).map(job => (
            <div key={job.id} className="flex justify-between items-center p-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div className="font-medium">{job.jobTitle}</div>
                <div className="text-sm text-secondary">{job.companyName}</div>
              </div>
              <div className={"badge badge-" + job.status.toLowerCase()}>{job.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
