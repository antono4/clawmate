import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  Activity, 
  MessageSquare, 
  Bot, 
  Settings,
  Play, 
  Square,
  RefreshCw,
  Terminal,
  Globe,
  Shield,
  Database,
  Keyboard
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: 'gateway' | 'channels' | 'agents' | 'settings' | 'system';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { state, api } = useApp();

  const commands: CommandItem[] = [
    // Gateway
    { id: 'start-gateway', label: 'Start Gateway', description: 'Start the AI gateway service', icon: <Play size={18} />, shortcut: 'Ctrl+S', category: 'gateway', action: () => { api.startGateway(); onClose(); } },
    { id: 'stop-gateway', label: 'Stop Gateway', description: 'Stop the AI gateway service', icon: <Square size={18} />, shortcut: 'Ctrl+Q', category: 'gateway', action: () => { api.stopGateway(); onClose(); } },
    { id: 'restart-gateway', label: 'Restart Gateway', description: 'Restart the gateway with new config', icon: <RefreshCw size={18} />, category: 'gateway', action: () => { api.stopGateway().then(() => api.startGateway()); onClose(); } },
    { id: 'gateway-status', label: 'Check Status', description: 'View gateway health and metrics', icon: <Activity size={18} />, shortcut: 'Ctrl+H', category: 'gateway', action: () => onClose() },
    
    // Channels
    { id: 'add-channel', label: 'Add Channel', description: 'Connect a new messaging channel', icon: <MessageSquare size={18} />, shortcut: 'Ctrl+N', category: 'channels', action: () => onClose() },
    { id: 'view-channels', label: 'View Channels', description: 'See all connected channels', icon: <Globe size={18} />, category: 'channels', action: () => onClose() },
    
    // Agents
    { id: 'new-session', label: 'New Session', description: 'Start a fresh conversation', icon: <Bot size={18} />, shortcut: 'Ctrl+Shift+N', category: 'agents', action: () => onClose() },
    { id: 'view-sessions', label: 'View Sessions', description: 'Browse conversation history', icon: <Terminal size={18} />, category: 'agents', action: () => onClose() },
    
    // Settings
    { id: 'open-settings', label: 'Settings', description: 'Configure gateway and preferences', icon: <Settings size={18} />, shortcut: 'Ctrl+,', category: 'settings', action: () => onClose() },
    { id: 'security-settings', label: 'Security', description: 'Manage security and DM policies', icon: <Shield size={18} />, category: 'settings', action: () => onClose() },
    { id: 'data-settings', label: 'Data & Privacy', description: 'Manage storage and analytics', icon: <Database size={18} />, category: 'settings', action: () => onClose() },
    
    // System
    { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', description: 'View all available shortcuts', icon: <Keyboard size={18} />, shortcut: '?', category: 'system', action: () => onClose() },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'gateway', label: 'Gateway', icon: <Activity size={16} /> },
    { id: 'channels', label: 'Channels', icon: <MessageSquare size={16} /> },
    { id: 'agents', label: 'Agents', icon: <Bot size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { id: 'system', label: 'System', icon: <Command size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-surface-light overflow-hidden animate-slide-in">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-light">
          <Search size={20} className="text-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/50 focus:outline-none text-lg"
          />
          <div className="flex items-center gap-1 text-xs text-text-secondary bg-surface-light px-2 py-1 rounded">
            <span>ESC</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-surface-light overflow-x-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              !activeCategory ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary hover:text-text-primary'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeCategory === cat.id ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto">
          {filteredCommands
            .filter((cmd) => !activeCategory || cmd.category === activeCategory)
            .map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className={`w-full flex items-center gap-4 px-6 py-3 transition-colors ${
                  index === selectedIndex ? 'bg-primary/10' : 'hover:bg-surface-light'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  index === selectedIndex ? 'bg-primary/20 text-primary' : 'bg-surface-light text-text-secondary'
                }`}>
                  {cmd.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-text-primary">{cmd.label}</p>
                  <p className="text-sm text-text-secondary">{cmd.description}</p>
                </div>
                {cmd.shortcut && (
                  <div className="flex items-center gap-1">
                    {cmd.shortcut.split('+').map((key, i) => (
                      <React.Fragment key={key}>
                        <kbd className="px-2 py-1 bg-surface-light rounded text-xs text-text-secondary">
                          {key}
                        </kbd>
                        {i < cmd.shortcut.split('+').length - 1 && (
                          <span className="text-text-secondary">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </button>
            ))}
          
          {filteredCommands.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-text-secondary">No commands found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-surface-light bg-surface-light/30">
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface rounded">Enter</kbd>
              Select
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            {state.gateway.running ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" />
                Gateway Online
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-text-secondary" />
                Gateway Offline
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// We need to import useApp for the commands
import { useApp } from '../context/AppContext';