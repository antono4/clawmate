import React from 'react';
import { Play, Square, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { state, api } = useApp();
  const { gateway, loading } = state;

  return (
    <header className="bg-surface border-b border-surface-light px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <div className="flex items-center gap-2">
            {gateway.running ? (
              <button
                onClick={api.stopGateway}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors disabled:opacity-50"
              >
                <Square size={18} />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={api.startGateway}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors disabled:opacity-50"
              >
                <Play size={18} />
                <span>Start</span>
              </button>
            )}
            <button className="p-2 rounded-lg bg-surface-light text-text-secondary hover:text-text-primary transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}