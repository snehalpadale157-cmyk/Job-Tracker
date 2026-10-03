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
