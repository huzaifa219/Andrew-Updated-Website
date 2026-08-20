import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ChevronDown, Check, Sparkles, Phone, Mail } from 'lucide-react';
import { MspLogoMark } from './MspLogo';
import { BOOKING_URL } from '../calculatorConfig';

interface ChatMessage {
  id: string;
  sender: 'msp' | 'user';
  text: string;
  timestamp: string;
  cta?: {
    label: string;
    action: () => void;
  };
}

export function ChatWidget({
  onOpenAssessment,
  onOpenCalculator,
}: {
  onOpenAssessment: () => void;
  onOpenCalculator: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'msp',
      text: 'Have a question? Send us a message and we’ll get back to you.',
      timestamp: 'Just now',
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      let reply =
        'Thanks for reaching out! You can also book a 30-minute discovery call directly with Andrew to discuss your revenue opportunity.';
      let cta: ChatMessage['cta'] = {
        label: 'Book Discovery Call →',
        action: () => {
          window.location.href = BOOKING_URL;
        },
      };

      const lower = text.toLowerCase();
      if (lower.includes('calc') || lower.includes('worth') || lower.includes('estimate')) {
        reply =
          'You can use our live Revenue Opportunity Calculator directly on the site to estimate your annual recoverable revenue.';
        cta = {
          label: 'Go to Calculator',
          action: () => {
            setIsOpen(false);
            onOpenCalculator();
          },
        };
      } else if (lower.includes('assess') || lower.includes('leak') || lower.includes('report')) {
        reply =
          'Take our 2–3 minute Revenue Recovery Assessment to get a personalized breakdown of where deals are leaking.';
        cta = {
          label: 'Start 2-Min Assessment',
          action: () => {
            setIsOpen(false);
            onOpenAssessment();
          },
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'msp',
          text: reply,
          timestamp: 'Just now',
          cta,
        },
      ]);
    }, 600);
  };

  const quickPrompts = [
    'How does MSP help?',
    'See revenue calculator',
    'Book a discovery call',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-slate-950 border border-slate-700/70 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header with MSP Branding */}
          <div className="bg-slate-900 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center p-1.5 shadow-sm">
                <MspLogoMark className="w-full h-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Have a question?</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-slate-400">Mutual Success Partners</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Close chat"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080d16]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.cta && (
                  <button
                    onClick={msg.cta.action}
                    className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors inline-flex items-center gap-1"
                  >
                    {msg.cta.label}
                  </button>
                )}
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            {isSubmitting && (
              <div className="flex items-center gap-1.5 p-2 bg-slate-900/60 rounded-xl w-fit border border-slate-800">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                <span
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply chips */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-900 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:border-blue-500/50 hover:text-blue-300 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button (MSP Branding) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-slate-900 hover:bg-slate-850 text-white px-4 py-2.5 rounded-full border border-blue-500/40 shadow-xl shadow-blue-950/40 hover:border-blue-400 hover:scale-105 transition-all duration-200"
          aria-label="Open chat"
        >
          <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center p-1">
            <MspLogoMark className="w-full h-full" />
          </div>
          <span className="text-xs font-semibold tracking-wide">Have a question?</span>
        </button>
      )}
    </div>
  );
}
