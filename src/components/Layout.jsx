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
