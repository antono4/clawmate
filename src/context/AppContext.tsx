import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { Channel, Agent, Session, GatewayStatus, Config, Skill } from '../types';

interface AppState {
  gateway: GatewayStatus;
  channels: Channel[];
  agents: Agent[];
  sessions: Session[];
  skills: Skill[];
  config: Config;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GATEWAY_STATUS'; payload: GatewayStatus }
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'ADD_CHANNEL'; payload: Channel }
  | { type: 'UPDATE_CHANNEL'; payload: Channel }
  | { type: 'DELETE_CHANNEL'; payload: string }
  | { type: 'SET_AGENTS'; payload: Agent[] }
  | { type: 'SET_SESSIONS'; payload: Session[] }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'UPDATE_SKILL'; payload: Skill }
  | { type: 'SET_CONFIG'; payload: Config };

const initialState: AppState = {
  gateway: { running: false, port: 18789, uptime: 0, version: '1.0.0', channels: 0, sessions: 0 },
  channels: [],
  agents: [],
  sessions: [],
  skills: [],
  config: {
    gateway: { port: 18789, host: '0.0.0.0' },
    agents: { defaults: { model: 'openai/gpt-4', workspace: '~/.clawmate/workspace' } },
    channels: {},
    security: { dmPolicy: 'pairing', allowFrom: [] },
  },
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_GATEWAY_STATUS':
      return { ...state, gateway: action.payload };
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };
    case 'ADD_CHANNEL':
      return { ...state, channels: [...state.channels, action.payload] };
    case 'UPDATE_CHANNEL':
      return {
        ...state,
        channels: state.channels.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_CHANNEL':
      return { ...state, channels: state.channels.filter((c) => c.id !== action.payload) };
    case 'SET_AGENTS':
      return { ...state, agents: action.payload };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  api: {
    getStatus: () => Promise<GatewayStatus>;
    startGateway: () => Promise<void>;
    stopGateway: () => Promise<void>;
    getChannels: () => Promise<Channel[]>;
    addChannel: (channel: Omit<Channel, 'id'>) => Promise<Channel>;
    updateChannel: (channel: Channel) => Promise<Channel>;
    deleteChannel: (id: string) => Promise<void>;
    getSessions: () => Promise<Session[]>;
    sendMessage: (target: string, message: string) => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const api = {
    getStatus: async () => {
      const res = await fetch('/api/status');
      return res.json();
    },
    startGateway: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await fetch('/api/gateway/start', { method: 'POST' });
        const status = await api.getStatus();
        dispatch({ type: 'SET_GATEWAY_STATUS', payload: status });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    stopGateway: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await fetch('/api/gateway/stop', { method: 'POST' });
        const status = await api.getStatus();
        dispatch({ type: 'SET_GATEWAY_STATUS', payload: status });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    getChannels: async () => {
      const res = await fetch('/api/channels');
      const channels = await res.json();
      dispatch({ type: 'SET_CHANNELS', payload: channels });
      return channels;
    },
    addChannel: async (channel: Omit<Channel, 'id'>) => {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channel),
      });
      const newChannel = await res.json();
      dispatch({ type: 'ADD_CHANNEL', payload: newChannel });
      return newChannel;
    },
    updateChannel: async (channel: Channel) => {
      const res = await fetch(`/api/channels/${channel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channel),
      });
      const updated = await res.json();
      dispatch({ type: 'UPDATE_CHANNEL', payload: updated });
      return updated;
    },
    deleteChannel: async (id: string) => {
      await fetch(`/api/channels/${id}`, { method: 'DELETE' });
      dispatch({ type: 'DELETE_CHANNEL', payload: id });
    },
    getSessions: async () => {
      const res = await fetch('/api/sessions');
      const sessions = await res.json();
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
      return sessions;
    },
    sendMessage: async (target: string, message: string) => {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, message }),
      });
    },
  };

  useEffect(() => {
    api.getStatus().then((status) => {
      dispatch({ type: 'SET_GATEWAY_STATUS', payload: status });
    });
    api.getChannels().catch(() => {});
    api.getSessions().catch(() => {});

    const ws = new WebSocket(`ws://${window.location.host}/ws`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'gateway:status') {
        dispatch({ type: 'SET_GATEWAY_STATUS', payload: data.payload });
      } else if (data.type === 'channel:message') {
        dispatch({ type: 'ADD_SESSION', payload: data.payload });
      }
    };

    return () => ws.close();
  }, []);

  return <AppContext.Provider value={{ state, dispatch, api }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}