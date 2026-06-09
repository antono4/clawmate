import React from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatusCard({ title, value, subtitle, icon, trend }: StatusCardProps) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-surface-light animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
              {trend === 'up' && <span className="text-success">↑</span>}
              {trend === 'down' && <span className="text-error">↓</span>}
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
        )}
      </div>
    </div>
  );
}