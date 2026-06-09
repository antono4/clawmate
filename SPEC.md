# Personal AI Assistant - ClawMate

## Concept & Vision

**ClawMate** is a personal AI assistant gateway that connects to your favorite messaging platforms. It feels like having a smart, always-on companion that lives in the cloud and talks to you through the channels you already use. The experience should feel seamless, fast, and personal—like texting a knowledgeable friend who happens to have access to the entire internet and your digital life.

The personality is warm but professional, helpful without being pushy. It should feel like a premium tool that's powerful enough for developers but accessible to anyone.

## Design Language

### Aesthetic Direction
Inspired by modern productivity tools like Linear and Notion—clean, functional, with subtle personality. Dark mode primary with light accents. The UI should feel like a control center, not a social media app.

### Color Palette
- **Primary**: `#6366F1` (Indigo) - main actions and highlights
- **Secondary**: `#8B5CF6` (Purple) - accents and secondary elements
- **Background Dark**: `#0F0F0F` - main background
- **Surface**: `#1A1A1A` - cards and elevated surfaces
- **Surface Light**: `#2A2A2A` - hover states and borders
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A1A1AA`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

### Typography
- **Headings**: Inter (700) - clean, modern
- **Body**: Inter (400, 500) - readable at all sizes
- **Mono**: JetBrains Mono - for code blocks and technical info

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)

### Motion Philosophy
- Subtle, purposeful animations (150-300ms)
- Fade transitions for content changes
- Slide-in for panels and modals
- No jarring movements—everything feels smooth

## Layout & Structure

### Main Dashboard
1. **Sidebar Navigation** (240px fixed)
   - Logo and app name
   - Navigation links: Dashboard, Channels, Agents, Skills, Settings
   - Connection status indicator
   - User profile section at bottom

2. **Main Content Area**
   - Header with page title and actions
   - Content grid with responsive cards
   - Status bar at bottom

3. **Quick Actions Panel**
   - Floating action button for common tasks
   - Recent conversations list

### Channel Management Page
- Grid of connected channels with status
- Add new channel modal
- Channel configuration cards

### Agent Workspace
- Session list with search
- Chat interface for each session
- Tool palette sidebar

## Features & Interactions

### 1. Gateway Control
- Start/stop gateway service
- View real-time status and logs
- Port configuration
- Health check endpoints

### 2. Multi-Channel Support
- **Supported Channels**: Discord, Telegram, Slack, WhatsApp, Matrix, WebChat
- Channel connection wizard
- Enable/disable individual channels
- DM policy configuration (pairing mode, allow list)

### 3. Agent System
- Default agent configuration
- Model selection (OpenAI, Anthropic, local models)
- Session management
- Workspace configuration

### 4. Skills Registry
- Browse available skills
- Enable/disable skills
- Custom skill creation
- Skill configuration

### 5. Real-time Communication
- Send test messages to channels
- Receive and view incoming messages
- Conversation history
- Export conversations

### 6. Security Features
- DM pairing system (approval-based access)
- Allowlist management
- Rate limiting configuration
- Security audit logs

## Component Inventory

### Navigation Components
- **Sidebar**: Fixed 240px, dark surface, active state with indigo accent
- **NavItem**: Icon + label, hover with surface-light bg, active with left border accent

### Cards
- **ChannelCard**: Status indicator, channel icon, name, last activity, actions menu
- **AgentCard**: Model info, session count, status badge, quick actions
- **SkillCard**: Name, description, enabled toggle, configure button

### Forms
- **Input**: Dark bg, light border, focus with indigo glow
- **Select**: Custom dropdown with channel icons
- **Toggle**: Indigo when active, smooth transition
- **Button**: Primary (indigo), Secondary (surface), sizes sm/md/lg

### Status Indicators
- **Online**: Green dot + "Connected"
- **Offline**: Gray dot + "Disconnected"
- **Error**: Red dot + "Error" with tooltip

### Modals
- Centered overlay with backdrop blur
- Slide-in animation from top
- Close button top-right
- Action buttons bottom-right

## Technical Approach

### Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State**: React Context + useReducer
- **Backend**: Express.js + WebSocket
- **Runtime**: Node.js 22+

### Architecture
```
┌─────────────────────────────────────────┐
│           Gateway Service               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Channel │  │ Channel │  │ Channel │  │
│  │ Handler │  │ Handler │  │ Handler │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  │
│       └───────────┼───────────┘        │
│              ┌────▼────┐              │
│              │  Agent  │              │
│              │  Core   │              │
│              └────┬────┘              │
│       ┌───────────┼───────────┐       │
│  ┌────▼────┐ ┌────▼────┐ ┌────▼────┐  │
│  │ Session │ │  Tools  │ │ Skills  │  │
│  │ Manager │ │         │ │         │  │
│  └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────┘
```

### API Endpoints
- `GET /api/status` - Gateway status
- `POST /api/gateway/start` - Start gateway
- `POST /api/gateway/stop` - Stop gateway
- `GET /api/channels` - List channels
- `POST /api/channels` - Add channel
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Remove channel
- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `GET /api/sessions` - List sessions
- `POST /api/messages/send` - Send message

### WebSocket Events
- `gateway:status` - Status updates
- `channel:message` - Incoming messages
- `session:update` - Session changes

### Data Model
- **Channel**: id, type, name, config, enabled, lastActivity
- **Agent**: id, name, model, workspace, config
- **Session**: id, agentId, channelId, messages, createdAt
- **Skill**: id, name, description, enabled, config

### Configuration File (config.json)
```json
{
  "gateway": {
    "port": 18789,
    "host": "0.0.0.0"
  },
  "agents": {
    "defaults": {
      "model": "openai/gpt-4",
      "workspace": "~/. clawmate/workspace"
    }
  },
  "channels": {},
  "security": {
    "dmPolicy": "pairing"
  }
}
```