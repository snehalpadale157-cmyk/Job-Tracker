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
