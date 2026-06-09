export interface Channel {
  id: string;
  type: 'discord' | 'telegram' | 'slack' | 'whatsapp' | 'matrix' | 'webchat';
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
  lastActivity?: string;
  status: 'connected' | 'disconnected' | 'error';
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  workspace: string;
  enabled: boolean;
  sessionCount: number;
}

export interface Session {
  id: string;
  agentId: string;
  channelId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface GatewayStatus {
  running: boolean;
  port: number;
  uptime: number;
  version: string;
  channels: number;
  sessions: number;
}

export interface Config {
  gateway: {
    port: number;
    host: string;
  };
  agents: {
    defaults: {
      model: string;
      workspace: string;
    };
  };
  channels: Record<string, unknown>;
  security: {
    dmPolicy: 'pairing' | 'open' | 'closed';
    allowFrom: string[];
  };
}