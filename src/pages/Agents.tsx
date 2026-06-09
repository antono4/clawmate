import React from 'react';
import { Bot, ChevronRight, Settings } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export function Agents() {
  const { state } = useApp();
  const { agents } = state;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Agents"
        subtitle="Configure your AI assistants"
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-surface-light">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Default Agent</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Active</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-surface-light rounded-xl mb-4">
              <div className="p-4 bg-primary/10 rounded-xl">
                <Bot size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary">{state.config.agents.defaults.model}</h4>
                <p className="text-sm text-text-secondary">Primary assistant</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-surface transition-colors text-text-secondary">
                <Settings size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-surface-light">
                <span className="text-text-secondary">Model</span>
                <span className="text-text-primary font-medium">{state.config.agents.defaults.model}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-light">
                <span className="text-text-secondary">Workspace</span>
                <span className="text-text-primary font-medium text-sm">{state.config.agents.defaults.workspace}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text-secondary">Status</span>
                <span className="text-success font-medium">Ready</span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-surface-light">
            <h3 className="text-lg font-semibold text-text-primary mb-6">Model Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Primary Model
                </label>
                <select className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary">
                  <option value="openai/gpt-4">OpenAI GPT-4</option>
                  <option value="openai/gpt-4-turbo">OpenAI GPT-4 Turbo</option>
                  <option value="anthropic/claude-3-opus">Anthropic Claude 3 Opus</option>
                  <option value="anthropic/claude-3-sonnet">Anthropic Claude 3 Sonnet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Fallback Model
                </label>
                <select className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary">
                  <option value="openai/gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
                  <option value="anthropic/claude-3-haiku">Anthropic Claude 3 Haiku</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Temperature
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-text-secondary mt-1">
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Save Configuration
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Session History</h3>
          <div className="bg-surface rounded-xl border border-surface-light overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Session</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Messages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-light">
                {state.sessions.slice(0, 10).map((session) => (
                  <tr key={session.id} className="hover:bg-surface-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-text-primary">#{session.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">Default</td>
                    <td className="px-6 py-4 text-text-secondary">{session.messages.length}</td>
                    <td className="px-6 py-4 text-text-secondary">{new Date(session.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-surface-light text-text-secondary transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}