import React, { useState } from 'react';
import { Check, ChevronRight, HelpCircle, Phone, X } from 'lucide-react';
import { MspLogo } from './MspLogo';

export const FAQ_ITEMS = [
  {
    question: 'What is Mutual Success Partners?',
    answer:
      'Mutual Success Partners is a revenue growth consultancy specializing in helping service businesses uncover lost opportunities, streamline lead follow-up, and build reliable conversion systems.',
  },
  {
    question: 'How does the Revenue Recovery Assessment work?',
    answer:
      'The assessment takes 2–3 minutes and evaluates your lead response speed, follow-up cadence, quote tracking, and operations. You receive a personalized report detailing where revenue is leaking and the exact steps to capture it.',
  },
  {
    question: 'What types of businesses do you work with?',
    answer:
      'We work with service-based companies including custom home builders, residential contractors, HVAC, plumbing, roofing, electrical, painting, and landscaping providers.',
  },
  {
    question: 'Are you an AI-only company?',
    answer:
      'No. Automation and AI are tools we use to improve speed and consistency, but our focus is on building complete revenue systems—combining response playbooks, sales follow-up, CRM optimization, and human operations.',
  },
  {
    question: 'What happens during a Discovery Call?',
    answer:
      'During a 30-minute discovery call, we review your current opportunity flow, pinpoint your largest revenue leaks, and provide practical next steps with no obligation.',
  },
];

export function FaqModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HelpCircle size={20} />
            </div>
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                Frequently Asked Questions
              </span>
              <h3 className="text-lg font-bold text-white">Mutual Success Partners FAQ</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-3 overflow-y-auto pr-1">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-medium text-slate-200 hover:text-white hover:bg-slate-900/50 transition-colors"
                >
                  <span className="text-sm font-semibold">{item.question}</span>
                  <ChevronRight
                    size={16}
                    className={`text-blue-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">Need more information?</span>
          <a
            href="mailto:andrew@mutualsuccesspartners.com"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            andrew@mutualsuccesspartners.com →
          </a>
        </div>
      </div>
    </div>
  );
}
