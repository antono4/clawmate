# ClawMate - Personal AI Assistant Gateway

> **Created by Antono**


<div align="center">
  <img src="public/clawmate.svg" alt="ClawMate Logo" width="100" />
</div>

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.19-orange)
![TypeScript](https://img.shields.io/badge/typescript-5.4-blue)

</div>

---

**ClawMate** is a personal AI assistant gateway that connects to your favorite messaging platforms. It answers you on the channels you already use - WhatsApp, Telegram, Slack, Discord, and more.

## ✨ Features

- **🌐 Multi-Channel Support** - Connect to Discord, Telegram, Slack, WhatsApp, Matrix, WebChat
- **🤖 AI Chat Interface** - Interactive chat with command palette (/status, /new, /reset)
- **🛠️ Skills Marketplace** - Extend functionality with community skills
- **📊 Real-time Dashboard** - Monitor gateway status, channels, and system health
- **🔒 Security** - DM pairing, rate limiting, allowlists
- **⚡ Model Configuration** - Primary + fallback model with temperature control

## 🚀 Quick Start

### Prerequisites
- Node.js 22.19+ or 24+
- npm, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd clawmate

# Install dependencies
npm install

# Build the project
npm run build

# Start the application
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:18789`.

## 📁 Project Structure

```
clawmate/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── context/        # App context and state
│   └── types/          # TypeScript types
├── server/             # Express backend
├── public/             # Static assets
└── dist/               # Production build
```

## 🎨 Design System

- **Primary Color**: `#6366F1` (Indigo)
- **Secondary Color**: `#8B5CF6` (Purple)
- **Background**: `#0F0F0F` (Dark)
- **Surface**: `#1A1A1A`

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run dev:backend` | Start Express backend |
| `npm run build` | Build for production |
| `npm start` | Run production server |

## 📝 API Endpoints

- `GET /api/status` - Gateway status
- `POST /api/gateway/start` - Start gateway
- `POST /api/gateway/stop` - Stop gateway
- `GET /api/channels` - List channels
- `POST /api/channels` - Add channel
- `GET /api/sessions` - List sessions
- `WS /ws` - WebSocket for real-time updates

## 🔧 Configuration

Configure the gateway in `Settings` page:
- Port and host settings
- DM policy (pairing/open/closed)
- Model selection with failover
- Notification preferences

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ using React, TypeScript, and Express