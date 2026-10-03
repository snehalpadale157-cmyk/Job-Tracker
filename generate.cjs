const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const files = {
  'utils/data.js': `
export const initialJobs = [
  {
    id: "job_1", companyName: "Acme Corp", jobTitle: "Senior Frontend Engineer", location: "New York, NY",
    jobType: "Full-time", workMode: "Hybrid", salary: "$120k - $140k", jobUrl: "https://acme.com",
    dateApplied: new Date().toISOString(), status: "Screening", priority: "High", contactPerson: "Jane Doe",
    contactEmail: "jane@acme.com", notes: "Applied via referral.", tags: ["React", "CSS"],
    isFavorite: true, resumeVersion: "Resume A",
    interviews: [], followUps: []
  }
];
`,
  'context/JobContext.jsx': `
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
`,
  'context/ThemeContext.jsx': `
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
`,
  'components/Sidebar.jsx': `
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Trello, Calendar, BarChart2, Star, Settings } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/pipeline', label: 'Pipeline', icon: Trello },
    { to: '/interviews', label: 'Interviews', icon: Calendar },
    { to: '/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/favorites', label: 'Favorites', icon: Star },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      <div className="p-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <h1 className="text-xl font-bold">Job Tracker Pro</h1>
      </div>
      <nav className="flex flex-col gap-1 p-2 mt-4">
        {links.map(l => {
          const Icon = l.icon;
          const isActive = location.pathname === l.to;
          return (
            <Link key={l.to} to={l.to} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? '500' : 'normal'
            }}>
              <Icon size={20} /> {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
`,
  'components/Topbar.jsx': `
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Search } from 'lucide-react';

export const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="app-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
        <Search size={18} color="var(--text-tertiary)" />
        <input type="text" placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)' }} />
      </div>
      <div className="flex items-center gap-4">
        <button className="btn" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="btn"><Bell size={20} /></button>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          JS
        </div>
      </div>
    </header>
  );
};
`,
  'components/Layout.jsx': `
import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
};
`,
  'pages/DashboardPage.jsx': `
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
`,
  'pages/ApplicationsPage.jsx': `
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
`,
  'App.jsx': `
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { JobProvider } from './context/JobContext';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';

function App() {
  return (
    <ThemeProvider>
      <JobProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              {/* Other routes placeholder */}
              <Route path="*" element={<div className="p-8 text-center">Under Construction</div>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </JobProvider>
    </ThemeProvider>
  );
}

export default App;
`,
  'main.jsx': `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(srcDir, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}
console.log('Files generated successfully.');
