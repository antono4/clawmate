import React, { useState } from 'react';
import { Plus, Search, Globe, Code, Database, MessageSquare, Zap, Store, Palette } from 'lucide-react';
import { Header } from '../components/Header';
import { SkillCard } from '../components/SkillCard';
import { SkillMarketplace } from '../components/SkillMarketplace';
import { useApp } from '../context/AppContext';
import type { Skill } from '../types';

const defaultSkills: Skill[] = [
  { id: '1', name: 'Web Fetch', description: 'Fetch content from URLs and web pages', enabled: true, config: {} },
  { id: '2', name: 'Code Review', description: 'Analyze code for quality and best practices', enabled: true, config: {} },
  { id: '3', name: 'Git Integration', description: 'Manage repositories and pull requests', enabled: false, config: {} },
  { id: '4', name: 'Database Query', description: 'Query and analyze databases', enabled: false, config: {} },
  { id: '5', name: 'Slack Integration', description: 'Post messages and manage Slack', enabled: true, config: {} },
  { id: '6', name: 'Cron Jobs', description: 'Schedule and run periodic tasks', enabled: true, config: {} },
];

export function Skills() {
  const { state, dispatch } = useApp();
  const { skills } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'installed' | 'marketplace'>('installed');

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  const handleToggleSkill = (skill: Skill) => {
    dispatch({ type: 'UPDATE_SKILL', payload: { ...skill, enabled: !skill.enabled } });
  };

  const filteredSkills = displaySkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Skills"
        subtitle="Extend your assistant with capabilities"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface-light rounded-lg p-1">
              <button
                onClick={() => setViewMode('installed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === 'installed' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Palette size={16} />
                Installed
              </button>
              <button
                onClick={() => setViewMode('marketplace')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === 'marketplace' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Store size={16} />
                Marketplace
              </button>
            </div>
            {viewMode === 'installed' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                <span>Add Skill</span>
              </button>
            )}
          </div>
        }
      />

      <main className="flex-1 p-6 overflow-auto">
        {viewMode === 'marketplace' ? (
          <SkillMarketplace />
        ) : (
          <>
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input
                  type="text"
                  placeholder="Search installed skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary placeholder:text-text-secondary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onToggle={handleToggleSkill}
                />
              ))}
            </div>

            {filteredSkills.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-20 h-20 bg-surface-light rounded-2xl flex items-center justify-center mb-4">
                  <Zap size={40} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No skills found</h3>
                <p className="text-text-secondary mb-6">
                  {searchTerm ? 'Try a different search term' : 'Add skills to extend your assistant'}
                </p>
                <button
                  onClick={() => setViewMode('marketplace')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Store size={18} />
                  Browse Marketplace
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}