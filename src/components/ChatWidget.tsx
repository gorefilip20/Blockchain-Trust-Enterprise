'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Headphones, CheckCircle2 } from 'lucide-react';

type Message = { id: string; text: string; sender: 'user' | 'support' | 'system'; time: string };

const quickReplies = [
  'How do I make a payment?',
  'I need help with my investment plan',
  'How do I become a mentor?',
  'Talk to support',
];

const autoResponses: Record<string, string> = {
  'How do I make a payment?': 'You can pay using BEP20, TRC20, or ERC20 networks. Visit the Payments page or check your dashboard for our wallet addresses. Copy the address for your preferred network and send your payment. Your account is credited once confirmed on-chain.',
  'I need help with my investment plan': 'We offer three investment tiers: Starter ($2,000), Growth ($5,000), and Premium ($20,000). Visit the Investment Plans page to learn more and subscribe. Our team will review and activate your portfolio within 24 hours.',
  'How do I become a mentor?': 'Visit the Mentorship page and click "Become a Mentor." Fill out the application form and our team will review it. Once approved, complete the $500 registration fee via crypto payment, and your mentor profile goes live on the platform.',
  'Talk to support': 'Our support team has been notified and will respond shortly. In the meantime, feel free to describe your issue and we will get back to you as soon as possible.',
};

function formatTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const loadHistory = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bte-user-token') : null;
    if (!token) return;
    try {
      const res = await fetch('/api/support-chat', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.messages || data.messages.length === 0) return;

      const loaded: Message[] = [];
      for (const m of data.messages as Array<{ id: string; body: string; admin_reply: string | null; admin_reply_at: string | null; created_at: string }>) {
        loaded.push({ id: m.id, text: m.body, sender: 'user', time: formatTime(m.created_at) });
        if (m.admin_reply) {
          loaded.push({ id: m.id + '-reply', text: m.admin_reply, sender: 'support', time: formatTime(m.admin_reply_at || m.created_at) });
        }
      }

      setMessages(prev => {
        if (prev.length <= 1) return [{ id: 'welcome', text: 'Welcome to BTE Live Support. How can we help you today?', sender: 'support' as const, time: formatTime(new Date()) }, ...loaded];
        return prev;
      });
    } catch {}
  }, []);

  const pollForReplies = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bte-user-token') : null;
    if (!token) return;
    try {
      const res = await fetch('/api/support-chat', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.messages) return;

      const adminReplies: Message[] = [];
      for (const m of data.messages as Array<{ id: string; admin_reply: string | null; admin_reply_at: string | null; created_at: string }>) {
        if (m.admin_reply) {
          adminReplies.push({ id: m.id + '-reply', text: m.admin_reply, sender: 'support', time: formatTime(m.admin_reply_at || m.created_at) });
        }
      }

      setMessages(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newReplies = adminReplies.filter(r => !existingIds.has(r.id));
        if (newReplies.length === 0) return prev;
        if (!open) setUnread(u => u + newReplies.length);
        return [...prev, ...newReplies];
      });
    } catch {}
  }, [open]);

  useEffect(() => {
    if (open && !historyLoaded) {
      setHistoryLoaded(true);
      setMessages([{ id: 'welcome', text: 'Welcome to BTE Live Support. How can we help you today?', sender: 'support', time: formatTime(new Date()) }]);
      loadHistory();
    }
  }, [open, historyLoaded, loadHistory]);

  useEffect(() => {
    if (open) {
      pollRef.current = setInterval(pollForReplies, 15000);
      return () => { if (pollRef.current) clearInterval(pollRef.current); };
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [open, pollForReplies]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: 'u-' + Date.now(), text: text.trim(), sender: 'user', time: formatTime(new Date()) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('bte-user-token') : null;
    fetch('/api/support-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ message: text.trim() }),
    }).catch(() => {});

    const autoReply = autoResponses[text.trim()];
    const reply = autoReply || 'Thank you for your message. Our support team has been notified and will get back to you shortly. For urgent matters, please include your transaction hash or account email.';

    setTimeout(() => {
      setMessages(prev => [...prev, { id: 'auto-' + Date.now(), text: reply, sender: 'support', time: formatTime(new Date()) }]);
      setTyping(false);
      if (!open) setUnread(u => u + 1);
    }, 600 + Math.random() * 800);
  }

  function handleOpen() {
    setOpen(true);
    setUnread(0);
  }

  return (
    <>
      <button className="chat-widget-toggle" onClick={() => open ? setOpen(false) : handleOpen()} aria-label="Live Support">
        {open ? <X size={22} /> : <Headphones size={22} />}
        {!open && unread > 0 && <span className="chat-unread-badge">{unread}</span>}
      </button>

      {open && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <div className="chat-widget-header-avatar">
              <Headphones size={16} />
            </div>
            <div>
              <strong>BTE Live Support</strong>
              <small><span className="chat-online-dot" /> Online &mdash; typically replies instantly</small>
            </div>
            <button className="chat-widget-close" onClick={() => setOpen(false)}><X size={17} /></button>
          </div>

          <div className="chat-widget-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-msg chat-msg-${msg.sender}`}>
                <div className="chat-msg-bubble">
                  {msg.sender === 'support' && msg.id.endsWith('-reply') && (
                    <span className="chat-admin-badge"><CheckCircle2 size={10} /> Admin</span>
                  )}
                  {msg.text}
                  <span className="chat-msg-time">{msg.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg chat-msg-support">
                <div className="chat-msg-bubble chat-typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-quick-replies">
            {quickReplies.map(q => (
              <button key={q} onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          <form className="chat-widget-input" onSubmit={e => { e.preventDefault(); sendMessage(input); }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." />
            <button type="submit" disabled={!input.trim()}><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  );
}
