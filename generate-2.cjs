const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const files = {
  'pages/PipelinePage.jsx': `
import React from 'react';
import { useJobs } from '../context/JobContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const columns = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

export const PipelinePage = () => {
  const { jobs, updateJob } = useJobs();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      updateJob(draggableId, { status: destination.droppableId });
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-2xl font-bold mb-4">Pipeline</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
          {columns.map(col => {
            const colJobs = jobs.filter(j => j.status === col);
            return (
              <Droppable key={col} droppableId={col}>
                {(provided) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className="card p-4" 
                    style={{ minWidth: '280px', backgroundColor: 'var(--bg-tertiary)', border: 'none' }}
                  >
                    <div className="font-bold mb-4 flex justify-between">
                      {col} <span className="badge badge-withdrawn">{colJobs.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {colJobs.map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card p-3 shadow-md"
                            >
                              <div className="font-medium text-sm">{job.jobTitle}</div>
                              <div className="text-xs text-secondary mb-2">{job.companyName}</div>
                              {job.priority === 'High' && <span className="badge badge-screening" style={{fontSize: '0.65rem'}}>High Priority</span>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
`,
  'pages/AnalyticsPage.jsx': `
import React from 'react';
import { useJobs } from '../context/JobContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsPage = () => {
  const { jobs } = useJobs();
  
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});
  
  const data = Object.keys(statusCounts).map(key => ({ name: key, count: statusCounts[key] }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#06b6d4'];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        <div className="card p-6">
          <h3 className="font-bold mb-4 text-lg">Applications by Status</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Bar dataKey="count" fill="var(--info-color)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-4 text-lg">Status Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count">
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
`,
  'pages/SettingsPage.jsx': `
import React from 'react';
import { useJobs } from '../context/JobContext';

export const SettingsPage = () => {
  const { jobs, setJobs } = useJobs();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jobs, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "job-tracker-export.json");
    dlAnchorElem.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            setJobs(imported);
            alert("Data imported successfully!");
          }
        } catch (err) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      setJobs([]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="card p-6">
        <h3 className="font-bold text-lg mb-4">Data Management</h3>
        <p className="text-secondary mb-6 text-sm">Import or export your job tracking data. All data is stored locally in your browser.</p>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center p-4 border rounded-md" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <div className="font-medium">Export Data</div>
              <div className="text-sm text-secondary">Download a JSON file of your data</div>
            </div>
            <button className="btn btn-outline" onClick={handleExport}>Export</button>
          </div>
          
          <div className="flex justify-between items-center p-4 border rounded-md" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <div className="font-medium">Import Data</div>
              <div className="text-sm text-secondary">Upload a previously exported JSON file</div>
            </div>
            <label className="btn btn-outline cursor-pointer">
              Import
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            </label>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-md" style={{ borderColor: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
            <div>
              <div className="font-medium text-danger-color">Clear All Data</div>
              <div className="text-sm text-secondary">Delete everything from local storage</div>
            </div>
            <button className="btn btn-danger" onClick={handleClear}>Clear Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(srcDir, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}
console.log('Additional pages generated successfully.');
