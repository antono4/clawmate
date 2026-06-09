import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bot, 
  Puzzle, 
  Settings,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/channels', icon: MessageSquare, label: 'Channels' },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/skills', icon: Puzzle, label: 'Skills' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { state } = useApp();
  const { gateway } = state;

  return (
    <aside className="w-60 h-screen bg-surface border-r border-surface-light flex flex-col">
      <div className="p-6 border-b border-surface-light">
        <div className="flex items-center gap-3">
          <img src="/clawmate.svg" alt="ClawMate" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-text-primary">ClawMate</h1>
            <p className="text-xs text-text-secondary">Personal AI Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-light">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-light">
          <Activity size={20} className={gateway.running ? 'text-success' : 'text-text-secondary'} />
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              Gateway {gateway.running ? 'Online' : 'Offline'}
            </p>
            <p className="text-xs text-text-secondary">
              {gateway.running ? `Port ${gateway.port}` : 'Not running'}
            </p>
          </div>
          <div
            className={`w-2 h-2 rounded-full ${
              gateway.running ? 'bg-success' : 'bg-text-secondary'
            }`}
          />
        </div>
      </div>
    </aside>
  );
}