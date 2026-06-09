import React from 'react';
import { Wrench, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  onToggle: (skill: Skill) => void;
}

export function SkillCard({ skill, onToggle }: SkillCardProps) {
  return (
    <div className="bg-surface rounded-xl p-5 border border-surface-light hover:border-primary/30 transition-all animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
          <Wrench size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">{skill.name}</h3>
          <p className="text-sm text-text-secondary mt-1">{skill.description}</p>
        </div>
        <button
          onClick={() => onToggle(skill)}
          className={`p-2 rounded-lg transition-colors ${
            skill.enabled
              ? 'bg-success/10 text-success hover:bg-success/20'
              : 'bg-surface-light text-text-secondary hover:bg-surface-light/80'
          }`}
        >
          {skill.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
        </button>
      </div>
    </div>
  );
}