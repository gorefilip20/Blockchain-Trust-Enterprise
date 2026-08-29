'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type Message = { id: number; text: string; sender: 'user' | 'bot'; };

const cannedResponses: Record<string, string> = {
  'What services does BTE offer?': 'BTE provides institutional-grade corporate formation (Wyoming LLCs, DAO LLCs), multi-signature custody setup, copy-trading operations, and comprehensive treasury management. All services include privacy-forward filings and ongoing compliance support.',
  'How do I start copy trading?': 'Getting started with copy trading is simple: 1) Create your BTE account, 2) Navigate to the Copy Trading section in your workspace, 3) Browse published strategies from verified managers, and 4) Allocate funds to your chosen strategy. All trades are paper-simulated in demo mode.',
  'What are the fees?': 'Our Dual-Entity Formation Package starts at $499, which includes both a holding LLC and an operating LLC with Wyoming filings. Copy trading demo access is free. Contact our team for institutional custody and custom enterprise pricing.',
  'Talk to a human': 'Our team is available Monday through Friday, 9 AM to 6 PM ET. You can reach us at support@bte-markets.com or through the guidance request form in your workspace. A team member will respond within 24 hours.',
};

const defaultResponses = [
  'Thank you for your question. Our team specializes in institutional-grade corporate structuring and digital asset management. Could you provide more details about what you are looking for?',
  'That is a great question. BTE combines traditional corporate governance with blockchain-native tools to give you the best of both worlds. Let me know if you would like to learn more about a specific service.',
  'I appreciate your interest. For detailed or account-specific inquiries, I recommend reaching out to our team through the guidance request form in your workspace for a personalized response.',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, text: 'Welcome to BTE. How can I help you today?', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const responseIdx = useRef(0);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text: text.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const reply = cannedResponses[text.trim()] || defaultResponses[responseIdx.current % defaultResponses.length];
    if (!cannedResponses[text.trim()]) responseIdx.current++;

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  }

  return (
    <>
      <button className="chat-widget-toggle" onClick={() => setOpen(!open)} aria-label="Chat">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <div className="chat-widget-header-avatar">BT</div>
            <div>
              <strong>BTE Assistant</strong>
              <small>Typically replies instantly</small>
            </div>
            <button className="chat-widget-close" onClick={() => setOpen(false)}><X size={17} /></button>
          </div>

          <div className="chat-widget-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg chat-msg-${msg.sender}`}>
                <div className="chat-msg-bubble">{msg.text}</div>
              </div>
            ))}
            {typing && <div className="chat-msg chat-msg-bot"><div className="chat-msg-bubble chat-typing"><span /><span /><span /></div></div>}
            <div ref={bottomRef} />
          </div>

          <div className="chat-quick-replies">
            {Object.keys(cannedResponses).map((q) => (
              <button key={q} onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          <form className="chat-widget-input" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button type="submit" disabled={!input.trim()}><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  );
}
