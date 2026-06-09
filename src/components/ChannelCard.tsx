import React from 'react';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { Channel } from '../types';

const channelIcons: Record<string, string> = {
  discord: '💬',
  telegram: '✈️',
  slack: '💼',
  whatsapp: '📱',
  matrix: '🔷',
  webchat: '🌐',
};

const channelColors: Record<string, string> = {
  discord: '#5865F2',
  telegram: '#0088CC',
  slack: '#4A154B',
  whatsapp: '#25D366',
  matrix: '#0DBD8B',
  webchat: '#6366F1',
};

interface ChannelCardProps {
  channel: Channel;
  onEdit: (channel: Channel) => void;
  onDelete: (id: string) => void;
  onToggle: (channel: Channel) => void;
}

export function ChannelCard({ channel, onEdit, onDelete, onToggle }: ChannelCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="bg-surface rounded-xl p-5 border border-surface-light hover:border-primary/30 transition-all animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${channelColors[channel.type]}20` }}
          >
            {channelIcons[channel.type]}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{channel.name}</h3>
            <p className="text-sm text-text-secondary capitalize">{channel.type}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-surface-light text-text-secondary transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 bg-surface-light rounded-lg shadow-xl py-2 min-w-[140px] animate-slide-in">
                <button
                  onClick={() => {
                    onEdit(channel);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-text-primary hover:bg-surface transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Configure</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(channel.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error/10 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-surface-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              channel.status === 'connected'
                ? 'bg-success'
                : channel.status === 'error'
                ? 'bg-error'
                : 'bg-text-secondary'
            }`}
          />
          <span className="text-sm text-text-secondary capitalize">{channel.status}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={channel.enabled}
            onChange={() => onToggle(channel)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-light rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>

      {channel.lastActivity && (
        <p className="text-xs text-text-secondary mt-3">
          Last activity: {new Date(channel.lastActivity).toLocaleString()}
        </p>
      )}
    </div>
  );
}