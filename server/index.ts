import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

interface Channel {
  id: string;
  type: 'discord' | 'telegram' | 'slack' | 'whatsapp' | 'matrix' | 'webchat';
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
  lastActivity?: string;
  status: 'connected' | 'disconnected' | 'error';
}

interface Session {
  id: string;
  agentId: string;
  channelId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface GatewayStatus {
  running: boolean;
  port: number;
  uptime: number;
  version: string;
  channels: number;
  sessions: number;
}

const app = express();
app.use(cors());
app.use(express.json());

// In-memory state
let gatewayRunning = false;
let gatewayStartTime = 0;

const channels: Channel[] = [
  {
    id: '1',
    type: 'discord',
    name: 'Main Discord',
    enabled: true,
    config: { token: '***' },
    status: 'connected',
    lastActivity: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'telegram',
    name: 'Support Bot',
    enabled: true,
    config: { token: '***' },
    status: 'connected',
    lastActivity: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'slack',
    name: 'Team Workspace',
    enabled: false,
    config: { token: '***' },
    status: 'disconnected',
  },
];

const sessions: Session[] = [
  {
    id: uuidv4(),
    agentId: 'default',
    channelId: '1',
    messages: [
      { id: uuidv4(), role: 'user', content: 'Hello!', timestamp: new Date().toISOString() },
      { id: uuidv4(), role: 'assistant', content: 'Hi there! How can I help you today?', timestamp: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  const heartbeat = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping();
    }
  }, 30000);

  ws.on('close', () => {
    clearInterval(heartbeat);
    console.log('WebSocket client disconnected');
  });
});

function broadcast(event: string, payload: unknown) {
  const message = JSON.stringify({ type: event, payload });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// API Routes
app.get('/api/status', (_req, res) => {
  const status: GatewayStatus = {
    running: gatewayRunning,
    port: 18789,
    uptime: gatewayRunning ? Math.floor((Date.now() - gatewayStartTime) / 1000) : 0,
    version: '1.0.0',
    channels: channels.filter((c) => c.enabled).length,
    sessions: sessions.length,
  };
  res.json(status);
});

app.post('/api/gateway/start', (_req, res) => {
  gatewayRunning = true;
  gatewayStartTime = Date.now();
  broadcast('gateway:status', { running: true });
  res.json({ success: true, message: 'Gateway started' });
});

app.post('/api/gateway/stop', (_req, res) => {
  gatewayRunning = false;
  broadcast('gateway:status', { running: false });
  res.json({ success: true, message: 'Gateway stopped' });
});

app.get('/api/channels', (_req, res) => {
  res.json(channels);
});

app.post('/api/channels', (req, res) => {
  const newChannel: Channel = {
    id: uuidv4(),
    ...req.body,
    status: 'disconnected',
  };
  channels.push(newChannel);
  broadcast('channel:added', newChannel);
  res.status(201).json(newChannel);
});

app.put('/api/channels/:id', (req, res) => {
  const index = channels.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  channels[index] = { ...channels[index], ...req.body };
  broadcast('channel:updated', channels[index]);
  res.json(channels[index]);
});

app.delete('/api/channels/:id', (req, res) => {
  const index = channels.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  channels.splice(index, 1);
  broadcast('channel:deleted', { id: req.params.id });
  res.status(204).send();
});

app.get('/api/sessions', (_req, res) => {
  res.json(sessions);
});

app.post('/api/sessions', (req, res) => {
  const newSession: Session = {
    id: uuidv4(),
    agentId: req.body.agentId || 'default',
    channelId: req.body.channelId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  res.status(201).json(newSession);
});

app.post('/api/messages/send', (req, res) => {
  const { target, message } = req.body;
  console.log(`Sending message to ${target}: ${message}`);
  
  // Simulate message sending
  broadcast('message:sent', { target, message });
  
  res.json({ success: true, target, message });
});

app.get('/api/config', (_req, res) => {
  res.json({
    gateway: { port: 18789, host: '0.0.0.0' },
    agents: { defaults: { model: 'openai/gpt-4', workspace: '~/.clawmate/workspace' } },
    channels: {},
    security: { dmPolicy: 'pairing', allowFrom: [] },
  });
});

app.put('/api/config', (req, res) => {
  console.log('Updating config:', req.body);
  res.json({ success: true, config: req.body });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 18789;

server.listen(PORT, () => {
  console.log(`ClawMate Gateway running on port ${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
});