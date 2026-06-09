import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Copy, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export function ChatInterface() {
  const { state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m ClawMate, your personal AI assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickCommands = [
    { cmd: '/status', desc: 'Check gateway status' },
    { cmd: '/new', desc: 'Start a new session' },
    { cmd: '/reset', desc: 'Reset conversation' },
    { cmd: '/compact', desc: 'Compact memory' },
    { cmd: '/think high', desc: 'Set thinking level' },
    { cmd: '/verbose on', desc: 'Toggle verbose mode' },
    { cmd: '/usage', desc: 'Show token usage' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I've processed your request. Let me help you with that.",
        "Based on my analysis, here's what I found.",
        "I've completed the task. Is there anything else you need?",
        "That's an interesting question! Let me explain...",
        "I've analyzed the data and prepared a response for you.",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleCommand = (cmd: string) => {
    setInput(cmd);
    setShowCommands(false);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Conversation cleared. How can I help you?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-surface-light overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-light bg-surface-light/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">AI Assistant</h3>
            <p className="text-xs text-text-secondary">
              Model: {state.config.agents.defaults.model}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:bg-surface-light text-text-secondary transition-colors"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setShowCommands(!showCommands)}
            className="px-3 py-1.5 rounded-lg bg-surface-light text-text-secondary hover:text-text-primary transition-colors text-sm flex items-center gap-2"
          >
            Commands
            <ChevronDown size={14} className={showCommands ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      {/* Commands Dropdown */}
      {showCommands && (
        <div className="px-6 py-3 bg-surface-light/50 border-b border-surface-light animate-slide-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickCommands.map((cmd) => (
              <button
                key={cmd.cmd}
                onClick={() => handleCommand(cmd.cmd)}
                className="px-3 py-2 rounded-lg bg-surface hover:bg-surface-light text-left transition-colors"
              >
                <p className="font-mono text-sm text-primary">{cmd.cmd}</p>
                <p className="text-xs text-text-secondary">{cmd.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-primary/10 text-primary'
                  : msg.role === 'system'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-secondary/10 text-secondary'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`flex-1 max-w-2xl ${
                msg.role === 'user' ? 'text-right' : ''
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : msg.role === 'system'
                    ? 'bg-warning/10 text-warning rounded-tl-sm'
                    : 'bg-surface-light text-text-primary rounded-tl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                <button
                  onClick={() => copyMessage(msg.content)}
                  className="p-1 hover:bg-surface-light rounded transition-colors"
                  title="Copy"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <Bot size={16} className="text-secondary" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface-light">
              <Loader2 size={16} className="animate-spin text-secondary" />
              <span className="text-sm text-text-secondary">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-surface-light">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (or / for commands)"
              className="w-full px-4 py-3 bg-surface-light rounded-xl border border-surface-light focus:border-primary focus:outline-none text-text-primary placeholder:text-text-secondary/50 pr-12"
              onKeyDown={(e) => {
                if (e.key === '/' && !input) {
                  e.preventDefault();
                  setShowCommands(true);
                }
              }}
            />
            {input.startsWith('/') && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Sparkles size={16} className="text-primary" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
          <span>Press Enter to send</span>
          <span>|</span>
          <span>/ for commands</span>
          <span>|</span>
          <span>Tab for autocomplete</span>
        </div>
      </form>
    </div>
  );
}