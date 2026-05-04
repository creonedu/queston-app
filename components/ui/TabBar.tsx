'use client';

import type { ReactNode } from 'react';

export type TabKey = 'home' | 'topic' | 'reading' | 'match' | 'chat';

interface TabBarProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  {
    key: 'home',
    label: '홈',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-current fill-none" strokeWidth={1.5}>
        <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-6h-4v6a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    key: 'topic',
    label: '탐구',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-current fill-none" strokeWidth={1.5}>
        <path d="M12 2l2.6 6.5L21 9.3l-5 4.5L17.5 21 12 17l-5.5 4 1.5-7.2-5-4.5 6.4-.8z" />
      </svg>
    ),
  },
  {
    key: 'reading',
    label: '독서',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-current fill-none" strokeWidth={1.5}>
        <path d="M4 4h7a3 3 0 0 1 3 3v14M20 4h-7a3 3 0 0 0-3 3v14M4 4v17h16V4" />
      </svg>
    ),
  },
  {
    key: 'match',
    label: '매칭',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-current fill-none" strokeWidth={1.5}>
        <circle cx="12" cy="9" r="4" />
        <path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6" />
      </svg>
    ),
  },
  {
    key: 'chat',
    label: '멘토',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-current fill-none" strokeWidth={1.5}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-white/[0.06] backdrop-blur-2xl backdrop-saturate-150 bg-bg/[0.92] md:left-1/2 md:-translate-x-1/2 md:max-w-[480px]"
      style={{
        height: 'calc(76px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: '4px',
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 bg-transparent border-none font-medium text-[10px] cursor-pointer relative transition-colors py-2 px-1
            ${active === tab.key ? 'text-accent' : 'text-muted'}`}
        >
          {active === tab.key && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-accent rounded-b" />
          )}
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
