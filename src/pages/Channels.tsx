import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Header } from '../components/Header';
import { ChannelCard } from '../components/ChannelCard';
import { AddChannelModal } from '../components/AddChannelModal';
import { ChannelConfigPanel } from '../components/ChannelConfigPanel';
import { useApp } from '../context/AppContext';
import type { Channel } from '../types';

export function Channels() {
  const { state, api } = useApp();
  const { channels } = state;
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const channelTypes = ['discord', 'telegram', 'slack', 'whatsapp', 'matrix', 'webchat'];

  const filteredChannels = channels.filter((channel) => {
    if (filterType && channel.type !== filterType) return false;
    if (searchTerm && !channel.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleAddChannel = async (channel: Omit<Channel, 'id'>) => {
    await api.addChannel(channel);
  };

  const handleEditChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setShowConfigPanel(true);
  };

  const handleDeleteChannel = async (id: string) => {
    await api.deleteChannel(id);
  };

  const handleToggleChannel = async (channel: Channel) => {
    await api.updateChannel({ ...channel, enabled: !channel.enabled });
  };

  const handleSaveChannel = async (channel: Channel) => {
    await api.updateChannel(channel);
    setShowConfigPanel(false);
    setSelectedChannel(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Channels"
        subtitle="Manage your messaging integrations"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            <span>Add Channel</span>
          </button>
        }
      />

      <main className="flex-1 p-6 overflow-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary placeholder:text-text-secondary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-secondary" />
            {channelTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(filterType === type ? null : type)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                  filterType === type
                    ? 'bg-primary text-white'
                    : 'bg-surface-light text-text-secondary hover:text-text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-xl p-4 border border-surface-light">
            <p className="text-sm text-text-secondary">Total Channels</p>
            <p className="text-2xl font-bold text-text-primary">{channels.length}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-surface-light">
            <p className="text-sm text-text-secondary">Active</p>
            <p className="text-2xl font-bold text-success">{channels.filter((c) => c.enabled && c.status === 'connected').length}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-surface-light">
            <p className="text-sm text-text-secondary">Disconnected</p>
            <p className="text-2xl font-bold text-text-secondary">{channels.filter((c) => !c.enabled || c.status === 'disconnected').length}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-surface-light">
            <p className="text-sm text-text-secondary">Errors</p>
            <p className="text-2xl font-bold text-error">{channels.filter((c) => c.status === 'error').length}</p>
          </div>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onEdit={handleEditChannel}
              onDelete={handleDeleteChannel}
              onToggle={handleToggleChannel}
            />
          ))}
        </div>

        {filteredChannels.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-20 h-20 bg-surface-light rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No channels found</h3>
            <p className="text-text-secondary mb-6 max-w-md">
              {searchTerm || filterType
                ? 'Try adjusting your filters'
                : 'Connect your favorite messaging platforms to start chatting with your AI assistant.'}
            </p>
            {!searchTerm && !filterType && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                <span>Add your first channel</span>
              </button>
            )}
          </div>
        )}
      </main>

      <AddChannelModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddChannel}
      />

      <ChannelConfigPanel
        channel={selectedChannel}
        isOpen={showConfigPanel}
        onClose={() => {
          setShowConfigPanel(false);
          setSelectedChannel(null);
        }}
        onSave={handleSaveChannel}
      />
    </div>
  );
}