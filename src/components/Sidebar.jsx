import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Kanban, Calendar, BarChart2, Star, Settings } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/pipeline', label: 'Pipeline', icon: Kanban },
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
