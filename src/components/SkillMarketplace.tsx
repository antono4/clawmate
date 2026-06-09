import React, { useState } from 'react';
import { Search, Download, Star, TrendingUp, Clock, ExternalLink, X, Check, Zap, Code, Database, Globe, MessageSquare, Terminal, Shield } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  author: string;
  rating: number;
  downloads: number;
  category: string;
  icon: React.ReactNode;
  installed: boolean;
  featured: boolean;
}

const marketplaceSkills: Skill[] = [
  { id: '1', name: 'GitHub Integration', description: 'Manage PRs, issues, and repository operations', author: 'ClawMate Team', rating: 4.8, downloads: 12500, category: 'development', icon: <Code size={24} />, installed: false, featured: true },
  { id: '2', name: 'Slack Actions', description: 'Post messages and manage Slack workspace', author: 'ClawMate Team', rating: 4.7, downloads: 9800, category: 'communication', icon: <MessageSquare size={24} />, installed: true, featured: true },
  { id: '3', name: 'Database Query', description: 'Query and analyze SQL databases', author: 'Community', rating: 4.5, downloads: 5600, category: 'data', icon: <Database size={24} />, installed: false, featured: false },
  { id: '4', name: 'Web Research', description: 'Search the web and extract information', author: 'ClawMate Team', rating: 4.9, downloads: 15000, category: 'research', icon: <Globe size={24} />, installed: true, featured: true },
  { id: '5', name: 'Cron Scheduler', description: 'Schedule and run periodic tasks', author: 'ClawMate Team', rating: 4.6, downloads: 7800, category: 'automation', icon: <Clock size={24} />, installed: true, featured: false },
  { id: '6', name: 'Code Review', description: 'Analyze code quality and best practices', author: 'Community', rating: 4.4, downloads: 4200, category: 'development', icon: <Terminal size={24} />, installed: false, featured: false },
  { id: '7', name: 'Security Scanner', description: 'Scan for vulnerabilities and security issues', author: 'Security Team', rating: 4.8, downloads: 8900, category: 'security', icon: <Shield size={24} />, installed: false, featured: true },
  { id: '8', name: 'Data Analysis', description: 'Analyze datasets and generate insights', author: 'Community', rating: 4.3, downloads: 3400, category: 'data', icon: <TrendingUp size={24} />, installed: false, featured: false },
  { id: '9', name: 'API Builder', description: 'Create and manage API endpoints', author: 'Community', rating: 4.5, downloads: 6100, category: 'development', icon: <Zap size={24} />, installed: false, featured: false },
];

export function SkillMarketplace() {
  const [skills, setSkills] = useState(marketplaceSkills);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState<Skill | null>(null);

  const categories = ['all', 'development', 'communication', 'data', 'research', 'automation', 'security'];

  const filteredSkills = skills.filter((skill) => {
    if (selectedCategory && selectedCategory !== 'all' && skill.category !== selectedCategory) return false;
    if (searchTerm && !skill.name.toLowerCase().includes(searchTerm.toLowerCase()) && !skill.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const featuredSkills = skills.filter((s) => s.featured);

  const toggleInstall = (skill: Skill) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skill.id ? { ...s, installed: !s.installed } : s))
    );
  };

  return (
    <div className="bg-surface rounded-xl border border-surface-light overflow-hidden">
      <div className="p-6 border-b border-surface-light">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">Skill Marketplace</h3>
            <p className="text-sm text-text-secondary mt-1">Extend your assistant with community skills</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>{skills.filter((s) => s.installed).length} installed</span>
            <span>|</span>
            <span>{skills.length} available</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-light rounded-lg border border-surface-light focus:border-primary focus:outline-none text-text-primary placeholder:text-text-secondary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  (cat === 'all' && !selectedCategory) || selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface-light text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Skills */}
      {!searchTerm && !selectedCategory && (
        <div className="p-6 border-b border-surface-light bg-surface-light/30">
          <h4 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
            <Star size={16} className="text-warning" />
            Featured Skills
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 bg-surface rounded-xl border border-primary/30 hover:border-primary transition-colors cursor-pointer"
                onClick={() => setShowInstallModal(skill)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-text-primary">{skill.name}</h5>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{skill.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-warning" />
                        {skill.rating}
                      </span>
                      <span>{skill.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Skills */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-text-secondary mb-4">All Skills</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 bg-surface-light/50 rounded-xl hover:bg-surface-light transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${skill.installed ? 'bg-success/10 text-success' : 'bg-surface-light text-text-secondary'}`}>
                  {skill.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-text-primary truncate">{skill.name}</h5>
                    {skill.featured && <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">Featured</span>}
                  </div>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-warning" />
                      {skill.rating}
                    </span>
                    <span>by {skill.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-light">
                <span className="text-xs text-text-secondary capitalize px-2 py-1 bg-surface rounded-full">
                  {skill.category}
                </span>
                <button
                  onClick={() => toggleInstall(skill)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    skill.installed
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {skill.installed ? (
                    <>
                      <Check size={14} />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Install
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl w-full max-w-md mx-4 shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-surface-light">
              <h3 className="text-xl font-semibold text-text-primary">Install Skill</h3>
              <button
                onClick={() => setShowInstallModal(null)}
                className="p-2 rounded-lg hover:bg-surface-light text-text-secondary"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-xl text-primary">
                  {showInstallModal.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">{showInstallModal.name}</h4>
                  <p className="text-sm text-text-secondary">by {showInstallModal.author}</p>
                </div>
              </div>
              <p className="text-text-secondary">{showInstallModal.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-warning" />
                  {showInstallModal.rating}
                </span>
                <span>{showInstallModal.downloads.toLocaleString()} downloads</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-light">
              <button
                onClick={() => setShowInstallModal(null)}
                className="px-5 py-2.5 rounded-lg text-text-secondary hover:bg-surface-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleInstall(showInstallModal);
                  setShowInstallModal(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download size={18} />
                Install Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}