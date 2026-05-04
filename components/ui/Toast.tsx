'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

interface ToastContextValue {
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((m: string) => {
    setMsg(m);
    setShow(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 1800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`fixed left-1/2 z-[200] px-5 py-3 bg-ink text-bg rounded-full text-[13px] font-semibold whitespace-nowrap pointer-events-none transition-all duration-300 max-w-[90vw] shadow-2xl
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
        style={{
          top: 'calc(60px + env(safe-area-inset-top))',
          transform: `translateX(-50%) ${show ? 'translateY(0)' : 'translateY(-20px)'}`,
        }}
      >
        {msg}
      </div>
    </ToastContext.Provider>
  );
}
