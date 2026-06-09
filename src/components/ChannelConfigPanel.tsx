import React, { useState } from 'react';
import { X, Key, Globe, Shield, Bell, Save, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import type { Channel } from '../types';

interface ChannelConfigPanelProps {
  channel: Channel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (channel: Channel) => void;
}

const channelTemplates: Record<string, { fields: string[], description: string }> = {
  discord: {
    description: 'Connect to Discord servers and receive messages',
    fields: ['botToken', 'serverId', 'channelId', 'dmPolicy'],
  },
  telegram: {
    description: 'Connect a Telegram bot for messaging',
    fields: ['botToken', 'dmPolicy', 'allowedUsers'],
  },
  slack: {
    description: 'Connect to a Slack workspace',
    fields: ['botToken', 'teamId', 'channelId', 'dmPolicy'],
  },
  whatsapp: {
    description: 'Connect via WhatsApp Business API',
    fields: ['apiKey', 'phoneNumber', 'webhookUrl'],
  },
  matrix: {
    description: 'Connect to a Matrix homeserver',
    fields: ['homeserver', 'accessToken', 'roomId'],
  },
  webchat: {
    description: 'Embed a chat widget on your website',
    fields: ['widgetId', 'apiEndpoint', 'allowedOrigins'],
  },
};

export function ChannelConfigPanel({ channel, isOpen, onClose, onSave }: ChannelConfigPanelProps) {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [dmPolicy, setDmPolicy] = useState<'pairing' | 'open' | 'closed'>('pairing');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  React.useEffect(() => {
    if (channel) {
      setConfig(channel.config as Record<string, string> || {});
      setDmPolicy((channel.config as any)?.dmPolicy || 'pairing');
    }
  }, [channel]);

  if (!isOpen || !channel) return null;

  const template = channelTemplates[channel.type] || { description: '', fields: [] };

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult(Math.random() > 0.3 ? 'success' : 'error');
    }, 2000);
  };

  const handleSave = () => {
    onSave({
      ...channel,
      config: { ...config, dmPolicy },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-50">
      <div className="w-full max-w-lg h-full bg-surface border-l border-surface-light overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-surface border-b border-surface-light p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">Configure Channel</h3>
            <p className="text-sm text-text-secondary mt-1 capitalize">{channel.type} - {channel.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-light text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="p-4 bg-surface-light rounded-xl">
            <p className="text-sm text-text-secondary">{template.description}</p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-4 p-4 bg-surface-light rounded-xl">
            <div className={`w-3 h-3 rounded-full ${channel.status === 'connected' ? 'bg-success' : 'bg-text-secondary'}`} />
            <div className="flex-1">
              <p className="font-medium text-text-primary capitalize">{channel.status}</p>
              <p className="text-xs text-text-secondary">
                {channel.lastActivity ? `Last activity: ${new Date(channel.lastActivity).toLocaleString()}` : 'No activity yet'}
              </p>
            </div>
          </div>

          {/* Configuration Fields */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Key size={16} />
              Connection Settings
            </h4>
            <div className="space-y-4">
              {template.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-text-secondary mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {field === 'dmPolicy' ? (
                    <select
                      value={dmPolicy}
                      onChange={(e) => setDmPolicy(e.target.value as any)}
                      className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary"
                    >
                      <option value="pairing">Pairing (Approval Required)</option>
                      <option value="open">Open (Allow All)</option>
                      <option value="closed">Closed (Block All)</option>
                    </select>
                  ) : (
                    <input
                      type={field.includes('token') || field.includes('key') ? 'password' : 'text'}
                      value={config[field] || ''}
                      onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                      placeholder={`Enter ${field}`}
                      className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary placeholder:text-text-secondary/50"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Shield size={16} />
              Security
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-surface-light rounded-xl cursor-pointer">
                <div>
                  <p className="font-medium text-text-primary">Require Pairing</p>
                  <p className="text-xs text-text-secondary">New users must be approved</p>
                </div>
                <input
                  type="checkbox"
                  checked={dmPolicy === 'pairing'}
                  onChange={(e) => setDmPolicy(e.target.checked ? 'pairing' : 'open')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface rounded-full peer peer-checked:bg-primary relative transition-colors">
                  <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
                </div>
              </label>
              <label className="flex items-center justify-between p-4 bg-surface-light rounded-xl cursor-pointer">
                <div>
                  <p className="font-medium text-text-primary">Enable Webhooks</p>
                  <p className="text-xs text-text-secondary">Receive real-time events</p>
                </div>
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-surface rounded-full peer peer-checked:bg-primary relative transition-colors">
                  <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
                </div>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Bell size={16} />
              Notifications
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-surface-light rounded-xl cursor-pointer">
                <div>
                  <p className="font-medium text-text-primary">Connection Alerts</p>
                  <p className="text-xs text-text-secondary">Notify when channel goes offline</p>
                </div>
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-surface rounded-full peer peer-checked:bg-primary relative transition-colors">
                  <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
                </div>
              </label>
              <label className="flex items-center justify-between p-4 bg-surface-light rounded-xl cursor-pointer">
                <div>
                  <p className="font-medium text-text-primary">Message Alerts</p>
                  <p className="text-xs text-text-secondary">Notify on new messages</p>
                </div>
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-surface rounded-full peer peer-checked:bg-primary relative transition-colors">
                  <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
                </div>
              </label>
            </div>
          </div>

          {/* Test Connection */}
          <div className="p-4 bg-surface-light rounded-xl">
            <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <TestTube size={16} />
              Test Connection
            </h4>
            <button
              onClick={handleTest}
              disabled={testing}
              className="w-full py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube size={18} />
                  Test Connection
                </>
              )}
            </button>
            {testResult && (
              <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                testResult === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}>
                {testResult === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm">
                  {testResult === 'success' ? 'Connection successful!' : 'Connection failed. Check your credentials.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-surface border-t border-surface-light p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-text-secondary hover:bg-surface-light transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save size={18} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}