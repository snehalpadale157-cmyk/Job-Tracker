import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { Search } from 'lucide-react';

export const ApplicationsPage = () => {
  const { jobs, deleteJob } = useJobs();
  const [search, setSearch] = useState('');

  const filtered = jobs.filter(j => j.companyName.toLowerCase().includes(search.toLowerCase()) || j.jobTitle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Applications</h2>
      <div className="flex items-center gap-4">
        <input type="text" className="input" placeholder="Search applications..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td className="p-4 font-medium">{job.companyName}</td>
                <td className="p-4 text-secondary">{job.jobTitle}</td>
                <td className="p-4"><span className={"badge badge-" + job.status.toLowerCase()}>{job.status}</span></td>
                <td className="p-4 flex gap-2">
                  <button className="text-secondary hover:text-danger-color" onClick={() => deleteJob(job.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-secondary">No applications found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
