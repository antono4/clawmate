import React, { useState, useEffect, useRef } from 'react';
import { Activity, Clock, Filter, Download, Trash2, ChevronDown } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'gateway' | 'channel' | 'agent' | 'session' | 'system';
  message: string;
  details?: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: new Date().toISOString(), level: 'success', category: 'gateway', message: 'Gateway started successfully', details: 'Listening on port 18789' },
  { id: '2', timestamp: new Date(Date.now() - 60000).toISOString(), level: 'info', category: 'channel', message: 'Discord channel connected', details: 'Server: Main Server' },
  { id: '3', timestamp: new Date(Date.now() - 120000).toISOString(), level: 'info', category: 'channel', message: 'Telegram bot status changed', details: 'Online' },
  { id: '4', timestamp: new Date(Date.now() - 180000).toISOString(), level: 'info', category: 'session', message: 'New session created', details: 'Session #abc123' },
  { id: '5', timestamp: new Date(Date.now() - 240000).toISOString(), level: 'success', category: 'agent', message: 'Model response received', details: 'Latency: 1.2s' },
  { id: '6', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'warning', category: 'system', message: 'High memory usage detected', details: '75% of limit' },
  { id: '7', timestamp: new Date(Date.now() - 360000).toISOString(), level: 'info', category: 'gateway', message: 'Health check passed', details: 'All systems operational' },
  { id: '8', timestamp: new Date(Date.now() - 420000).toISOString(), level: 'info', category: 'channel', message: 'Slack workspace connected', details: 'Team: Engineering' },
];

export function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filter, setFilter] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Simulate new log entries
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)] as LogEntry['level'],
        category: ['gateway', 'channel', 'agent', 'session'][Math.floor(Math.random() * 4)] as LogEntry['category'],
        message: [
          'Processing request...',
          'Message sent successfully',
          'Channel sync completed',
          'Session updated',
          'Health check passed',
          'New connection established',
        ][Math.floor(Math.random() * 6)],
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 100));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter && log.category !== filter) return false;
    if (levelFilter && log.level !== levelFilter) return false;
    return true;
  });

  const levelColors = {
    info: 'text-blue-400',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  const categoryIcons: Record<string, string> = {
    gateway: '⚡',
    channel: '💬',
    agent: '🤖',
    session: '💭',
    system: '🔧',
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const data = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clawmate-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="bg-surface rounded-xl border border-surface-light overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-light bg-surface-light/30">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-primary" />
          <h3 className="font-semibold text-text-primary">Activity Log</h3>
          <span className="px-2 py-0.5 bg-surface-light rounded-full text-xs text-text-secondary">
            {filteredLogs.length} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportLogs}
            className="p-2 rounded-lg hover:bg-surface-light text-text-secondary transition-colors"
            title="Export logs"
          >
            <Download size={18} />
          </button>
          <button
            onClick={clearLogs}
            className="p-2 rounded-lg hover:bg-surface-light text-text-secondary transition-colors"
            title="Clear logs"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-primary/10 text-primary' : 'hover:bg-surface-light text-text-secondary'
            }`}
          >
            <Filter size={18} />
          </button>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-light rounded-full peer peer-checked:bg-primary relative transition-colors">
              <div className="absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
            </div>
            <span>Auto-scroll</span>
          </label>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-3 border-b border-surface-light bg-surface-light/50 animate-slide-in">
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">Category:</span>
            <div className="flex items-center gap-2">
              {['all', 'gateway', 'channel', 'agent', 'session', 'system'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat === 'all' ? null : cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    (cat === 'all' && !filter) || filter === cat
                      ? 'bg-primary text-white'
                      : 'bg-surface-light text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <span className="text-sm text-text-secondary ml-4">Level:</span>
            <div className="flex items-center gap-2">
              {['all', 'info', 'success', 'warning', 'error'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl === 'all' ? null : lvl)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    (lvl === 'all' && !levelFilter) || levelFilter === lvl
                      ? lvl === 'error' ? 'bg-error text-white'
                        : lvl === 'warning' ? 'bg-warning text-black'
                        : lvl === 'success' ? 'bg-success text-white'
                        : 'bg-blue-400 text-white'
                      : 'bg-surface-light text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Log Entries */}
      <div className="max-h-96 overflow-y-auto">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-4 px-6 py-3 hover:bg-surface-light/50 transition-colors border-b border-surface-light/50 last:border-0"
          >
            <span className="text-lg">{categoryIcons[log.category]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${levelColors[log.level]}`}>
                  {log.level.toUpperCase()}
                </span>
                <span className="text-xs text-text-secondary capitalize">{log.category}</span>
              </div>
              <p className="text-sm text-text-primary mt-1">{log.message}</p>
              {log.details && (
                <p className="text-xs text-text-secondary mt-1 truncate">{log.details}</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-text-secondary flex-shrink-0">
              <Clock size={12} />
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-text-secondary">No log entries match your filters</p>
          </div>
        )}
      </div>

      <div ref={logsEndRef} />
    </div>
  );
}