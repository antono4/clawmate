import React, { useState } from 'react';
import { Save, Shield, Globe, Bell, Database, Key, AlertTriangle, CheckCircle, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

const models = [
  { id: 'openai/gpt-4', name: 'GPT-4', provider: 'OpenAI', status: 'available' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', status: 'available' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', status: 'available' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', status: 'available' },
];

export function Settings() {
  const { state } = useApp();
  const { config, gateway } = state;
  const [activeTab, setActiveTab] = useState('gateway');
  const [modelConfig, setModelConfig] = useState({
    primary: 'openai/gpt-4',
    fallback: 'anthropic/claude-3-sonnet',
    temperature: 0.7,
  });
  const [securityConfig, setSecurityConfig] = useState({
    dmPolicy: config.security.dmPolicy,
    rateLimit: 100,
    requireAuth: true,
    allowedOrigins: ['*'],
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    slack: true,
  });

  const tabs = [
    { id: 'gateway', label: 'Gateway', icon: <Globe size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'models', label: 'Models', icon: <Key size={18} /> },
    { id: 'data', label: 'Data & Privacy', icon: <Database size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Settings"
        subtitle="Configure your gateway and preferences"
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 max-w-3xl">
            {activeTab === 'gateway' && (
              <div className="bg-surface rounded-xl p-6 border border-surface-light">
                <h3 className="text-lg font-semibold text-text-primary mb-6">Gateway Configuration</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Port</label>
                      <input
                        type="number"
                        defaultValue={config.gateway.port}
                        className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Host</label>
                      <input
                        type="text"
                        defaultValue={config.gateway.host}
                        className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Workspace Path</label>
                    <input
                      type="text"
                      defaultValue={config.agents.defaults.workspace}
                      className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 bg-surface-light rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${gateway.running ? 'bg-success' : 'bg-text-secondary'}`} />
                      <div>
                        <p className="font-medium text-text-primary">Gateway Status</p>
                        <p className="text-sm text-text-secondary">
                          {gateway.running ? `Running on port ${gateway.port}` : 'Not running'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-surface rounded-xl p-6 border border-surface-light">
                  <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-3">
                    <Shield size={20} />
                    DM Policy
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: 'pairing', label: 'Pairing (Recommended)', desc: 'New users must be approved with a pairing code' },
                      { value: 'open', label: 'Open', desc: 'Allow all incoming messages' },
                      { value: 'closed', label: 'Closed', desc: 'Block all incoming messages' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                          securityConfig.dmPolicy === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-surface-light hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="dmPolicy"
                          value={option.value}
                          checked={securityConfig.dmPolicy === option.value}
                          onChange={(e) => setSecurityConfig({ ...securityConfig, dmPolicy: e.target.value as any })}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          securityConfig.dmPolicy === option.value ? 'border-primary' : 'border-surface-light'
                        }`}>
                          {securityConfig.dmPolicy === option.value && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{option.label}</p>
                          <p className="text-sm text-text-secondary">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-6 border border-surface-light">
                  <h3 className="text-lg font-semibold text-text-primary mb-6">Rate Limiting</h3>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Messages per minute
                    </label>
                    <input
                      type="number"
                      value={securityConfig.rateLimit}
                      onChange={(e) => setSecurityConfig({ ...securityConfig, rateLimit: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary"
                    />
                  </div>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary">Security Recommendation</p>
                    <p className="text-sm text-text-secondary mt-1">
                      Keep DM policy at "Pairing" for production deployments. This prevents unauthorized access while allowing legitimate users to request pairing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="space-y-6">
                <div className="bg-surface rounded-xl p-6 border border-surface-light">
                  <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-3">
                    <Key size={20} />
                    Model Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Primary Model</label>
                      <select
                        value={modelConfig.primary}
                        onChange={(e) => setModelConfig({ ...modelConfig, primary: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary"
                      >
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Fallback Model</label>
                      <select
                        value={modelConfig.fallback}
                        onChange={(e) => setModelConfig({ ...modelConfig, fallback: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary"
                      >
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
                        ))}
                      </select>
                      <p className="text-xs text-text-secondary mt-2">
                        Automatically switches to fallback if primary is unavailable
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Temperature: {modelConfig.temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={modelConfig.temperature}
                        onChange={(e) => setModelConfig({ ...modelConfig, temperature: parseFloat(e.target.value) })}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-xs text-text-secondary mt-1">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-6 border border-surface-light">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Available Models</h3>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={model.id} className="flex items-center justify-between p-4 bg-surface-light rounded-xl">
                        <div>
                          <p className="font-medium text-text-primary">{model.name}</p>
                          <p className="text-sm text-text-secondary">{model.provider}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${model.status === 'available' ? 'bg-success' : 'bg-warning'}`} />
                          <span className="text-sm text-text-secondary capitalize">{model.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="bg-surface rounded-xl p-6 border border-surface-light">
                <h3 className="text-lg font-semibold text-text-primary mb-6">Data & Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-surface-light">
                    <div>
                      <p className="font-medium text-text-primary">Session History</p>
                      <p className="text-sm text-text-secondary">Store conversation history locally</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-light rounded-full peer peer-checked:bg-primary transition-colors">
                        <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-surface-light">
                    <div>
                      <p className="font-medium text-text-primary">Analytics</p>
                      <p className="text-sm text-text-secondary">Help improve ClawMate</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-light rounded-full peer peer-checked:bg-primary transition-colors">
                        <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
                      </div>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button className="px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors text-sm flex items-center gap-2">
                      <Trash2 size={16} />
                      Clear all data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-surface rounded-xl p-6 border border-surface-light">
                <h3 className="text-lg font-semibold text-text-primary mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                    { key: 'slack', label: 'Slack Integration', desc: 'Post notifications to Slack' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-surface-light">
                      <div>
                        <p className="font-medium text-text-primary">{item.label}</p>
                        <p className="text-sm text-text-secondary">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-light rounded-full peer peer-checked:bg-primary transition-colors">
                          <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}