'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Headphones, Paperclip } from 'lucide-react';

type Message = { id: number; text: string; sender: 'user' | 'support' | 'system'; time: string };

const quickReplies = [
  'How do I make a payment?',
  'I need help with my investment plan',
  'How do I become a mentor?',
  'Talk to support',
];

const autoResponses: Record<string, string> = {
  'How do I make a payment?': 'You can pay using Bitcoin, Ethereum, XRP, BNB, or Solana. Visit the Payments page to see our wallet addresses, copy the address for your preferred crypto, and send your payment. Your account is credited once the transaction confirms on-chain.',
  'I need help with my investment plan': 'We offer three investment tiers: Starter ($2,000), Growth ($5,000), and Premium ($20,000). Visit the Investment Plans page to learn more and subscribe. Our team will review and activate your portfolio within 24 hours.',
  'How do I become a mentor?': 'Visit the Mentorship page and click "Become a Mentor." Fill out the application form and our team will review it. Once approved, complete the $150 registration fee via crypto payment, and your mentor profile goes live on the platform.',
  'Talk to support': 'Our support team has been notified and will respond shortly. In the meantime, feel free to describe your issue and we will get back to you as soon as possible. You can also reach us through the guidance request form in your workspace.',
};

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: 'Welcome to BTE Live Support. How can we help you today?', sender: 'support', time: getTime() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text: text.trim(), sender: 'user', time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Persist to backend
    const token = typeof window !== 'undefined' ? localStorage.getItem('bte-user-token') : null;
    fetch('/api/support-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ message: text.trim() }),
    }).catch(() => {});

    const autoReply = autoResponses[text.trim()];
    const reply = autoReply || 'Thank you for your message. Our support team has been notified and will get back to you shortly. For urgent matters, please include your transaction hash or account email so we can assist you faster.';

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'support', time: getTime() }]);
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
