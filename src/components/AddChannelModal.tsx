import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Channel } from '../types';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (channel: Omit<Channel, 'id'>) => void;
}

const channelTypes = [
  { type: 'discord', label: 'Discord', icon: '💬', description: 'Connect to Discord servers and channels' },
  { type: 'telegram', label: 'Telegram', icon: '✈️', description: 'Connect to Telegram bots and groups' },
  { type: 'slack', label: 'Slack', icon: '💼', description: 'Connect to Slack workspaces' },
  { type: 'whatsapp', label: 'WhatsApp', icon: '📱', description: 'Connect via WhatsApp Business API' },
  { type: 'matrix', label: 'Matrix', icon: '🔷', description: 'Connect to Matrix homeservers' },
  { type: 'webchat', label: 'WebChat', icon: '🌐', description: 'Embed a chat widget on your website' },
];

export function AddChannelModal({ isOpen, onClose, onAdd }: AddChannelModalProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedType || !name) return;
    onAdd({
      type: selectedType as Channel['type'],
      name,
      enabled: false,
      config: {},
      status: 'disconnected',
    });
    setStep(1);
    setSelectedType(null);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface rounded-2xl w-full max-w-lg mx-4 shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-surface-light">
          <h3 className="text-xl font-semibold text-text-primary">
            {step === 1 ? 'Add Channel' : 'Configure Channel'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-light text-text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {channelTypes.map((channel) => (
                <button
                  key={channel.type}
                  onClick={() => {
                    setSelectedType(channel.type);
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedType === channel.type
                      ? 'border-primary bg-primary/10'
                      : 'border-surface-light hover:border-primary/50 bg-surface-light/50'
                  }`}
                >
                  <span className="text-2xl">{channel.icon}</span>
                  <h4 className="font-semibold text-text-primary mt-2">{channel.label}</h4>
                  <p className="text-xs text-text-secondary mt-1">{channel.description}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Discord Bot"
                  className="w-full px-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
              <div className="bg-surface-light/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-text-primary mb-3">Configuration Required</h4>
                <p className="text-sm text-text-secondary">
                  After adding the channel, you'll need to configure the connection settings 
                  including API tokens, webhooks, and other platform-specific settings.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-light">
          <button
            onClick={() => {
              if (step === 2) {
                setStep(1);
                setSelectedType(null);
              } else {
                onClose();
              }
            }}
            className="px-5 py-2.5 rounded-lg text-text-secondary hover:bg-surface-light transition-colors"
          >
            {step === 2 ? 'Back' : 'Cancel'}
          </button>
          {step === 2 && (
            <button
              onClick={handleSubmit}
              disabled={!name}
              className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Channel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}