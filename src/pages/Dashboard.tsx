import React, { useState, useEffect } from 'react';
import { Activity, MessageSquare, Bot, Clock, Zap, Shield, Terminal, ChevronRight, Cpu, HardDrive, Wifi } from 'lucide-react';
import { Header } from '../components/Header';
import { StatusCard } from '../components/StatusCard';
import { ChatInterface } from '../components/ChatInterface';
import { ActivityLog } from '../components/ActivityLog';
import { useApp } from '../context/AppContext';

export function Dashboard() {
  const { state } = useApp();
  const { gateway, channels, sessions } = state;
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stats = [
    { label: 'Messages Today', value: Math.floor(Math.random() * 100) + 50, icon: <MessageSquare size={20} />, color: 'text-primary' },
    { label: 'Avg Response', value: '1.2s', icon: <Zap size={20} />, color: 'text-warning' },
    { label: 'Active Skills', value: state.skills.filter(s => s.enabled).length, icon: <Terminal size={20} />, color: 'text-secondary' },
    { label: 'CPU Usage', value: '23%', icon: <Cpu size={20} />, color: 'text-success' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Dashboard"
        subtitle="Monitor and control your AI assistant"
        actions={
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-light rounded-lg text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="text-sm">Search commands...</span>
            <kbd className="px-2 py-0.5 bg-surface rounded text-xs">Ctrl+K</kbd>
          </button>
        }
      />

      <main className="flex-1 p-6 overflow-auto">
        {/* Gateway Status Bar */}
        <div className="bg-surface rounded-xl p-4 border border-surface-light mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${gateway.running ? 'bg-success animate-pulse' : 'bg-text-secondary'}`} />
              <span className="font-medium text-text-primary">
                {gateway.running ? 'Gateway Online' : 'Gateway Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Wifi size={16} />
              <span>Port {gateway.port}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <HardDrive size={16} />
              <span>Uptime: {formatUptime(gateway.uptime)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-secondary">Channels:</span>
              <span className="font-medium text-primary">{channels.filter(c => c.enabled).length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-secondary">Sessions:</span>
              <span className="font-medium text-secondary">{sessions.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-secondary">Version:</span>
              <span className="font-mono text-text-primary">{gateway.version}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-surface-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-surface-light ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Chat Interface */}
          <div className="lg:col-span-2 h-[600px]">
            <ChatInterface />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-surface rounded-xl p-5 border border-surface-light">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-surface-light rounded-lg hover:bg-surface-light/80 transition-colors text-left">
                  <MessageSquare size={18} className="text-primary" />
                  <span className="text-text-primary">Send Test Message</span>
                  <ChevronRight size={16} className="ml-auto text-text-secondary" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-surface-light rounded-lg hover:bg-surface-light/80 transition-colors text-left">
                  <Bot size={18} className="text-secondary" />
                  <span className="text-text-primary">New Session</span>
                  <ChevronRight size={16} className="ml-auto text-text-secondary" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-surface-light rounded-lg hover:bg-surface-light/80 transition-colors text-left">
                  <Shield size={18} className="text-success" />
                  <span className="text-text-primary">Security Audit</span>
                  <ChevronRight size={16} className="ml-auto text-text-secondary" />
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-surface-light rounded-lg hover:bg-surface-light/80 transition-colors text-left">
                  <Clock size={18} className="text-warning" />
                  <span className="text-text-primary">View Logs</span>
                  <ChevronRight size={16} className="ml-auto text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Active Channels */}
            <div className="bg-surface rounded-xl p-5 border border-surface-light">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Active Channels</h3>
                <span className="text-sm text-text-secondary">{channels.filter(c => c.enabled).length} online</span>
              </div>
              <div className="space-y-3">
                {channels.filter(c => c.enabled).slice(0, 4).map((channel) => (
                  <div key={channel.id} className="flex items-center gap-3 p-3 bg-surface-light rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary text-sm">{channel.name}</p>
                      <p className="text-xs text-text-secondary capitalize">{channel.type}</p>
                    </div>
                  </div>
                ))}
                {channels.filter(c => c.enabled).length === 0 && (
                  <p className="text-text-secondary text-center py-4">No active channels</p>
                )}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-surface rounded-xl p-5 border border-surface-light">
              <h3 className="text-lg font-semibold text-text-primary mb-4">System Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Memory</span>
                    <span className="text-text-primary">2.4 GB / 8 GB</span>
                  </div>
                  <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">CPU</span>
                    <span className="text-text-primary">23%</span>
                  </div>
                  <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Disk</span>
                    <span className="text-text-primary">45%</span>
                  </div>
                  <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log Section */}
        <div className="mt-8">
          <ActivityLog />
        </div>
      </main>

      {/* Command Palette */}
      {/* <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      /> */}
    </div>
  );
}