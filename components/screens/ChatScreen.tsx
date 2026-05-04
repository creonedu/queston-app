'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '../ui/Toast';
import type { ChatMessage } from '@/lib/types';

function formatBotMsg(text: string): string {
  // Escape HTML first
  let h = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Convert markdown-like patterns
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/【([^】]+)】/g, '<strong>$1</strong>');
  h = h.replace(/\n\n/g, '<br><br>');
  h = h.replace(/\n/g, '<br>');
  return h;
}

export default function ChatScreen() {
  const profile = useStore((s) => s.profile);
  const chatHistory = useStore((s) => s.chatHistory);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const resetChat = useStore((s) => s.resetChat);
  const completeMission = useStore((s) => s.completeMission);
  const { showToast } = useToast();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistory.length === 0) {
      const greeting = `안녕하세요 ${profile.name}님! 저는 제이크 AI 멘토예요. ${profile.grade} ${profile.school} 학생이시고 ${profile.tracks.join('·')} 계열을 희망하시는군요. 학종·세특·탐구주제·도서·입시전략 무엇이든 물어보세요.`;
      addChatMessage({ role: 'assistant', content: greeting });
    }
  }, [chatHistory.length, profile, addChatMessage]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const sendMessage = async (text: string) => {
    if (loading || !text.trim()) return;
    setLoading(true);

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    addChatMessage(userMsg);
    setInput('');

    const allMessages = [...chatHistory, userMsg];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, profile }),
      });
      const data = await res.json();
      if (data.error) {
        // Use fallback
        const fallback = generateFallbackChat(text, profile);
        addChatMessage({ role: 'assistant', content: fallback });
        if (data.error.includes('API')) {
          showToast('데모 모드: API 키 미설정');
        }
      } else {
        addChatMessage({ role: 'assistant', content: data.content });
      }
      completeMission('m4');
    } catch (err) {
      const fallback = generateFallbackChat(text, profile);
      addChatMessage({ role: 'assistant', content: '⚠️ 네트워크 오류 — 데모 답변으로 대체합니다.\n\n' + fallback });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleResetChat = () => {
    if (!confirm('대화 내역을 모두 삭제할까요?')) return;
    resetChat();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-line-soft">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center font-serif italic text-lg text-accent relative">
            J
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-q rounded-full border-2 border-bg" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">제이크 AI 멘토</h3>
            <p className="text-[10.5px] text-green-q font-mono">● AI 연결됨</p>
          </div>
        </div>
        <button onClick={handleResetChat} className="btn h-8 px-3 text-[11px]">초기화</button>
      </div>

      <div ref={threadRef} className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3.5 scrollbar-hide">
        {chatHistory.map((m, i) => {
          const showMeta = m.role === 'assistant' && (i === 0 || chatHistory[i - 1].role === 'user');
          return (
            <div key={i}>
              {showMeta && (
                <div className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1 flex items-center gap-1.5 pl-1">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  제이크 멘토
                </div>
              )}
              <div
                className={`max-w-[82%] py-3 px-4 rounded-2xl text-[13.5px] leading-relaxed tracking-tight break-words animate-bubble-in
                  ${
                    m.role === 'user'
                      ? 'self-end ml-auto bg-accent text-white rounded-br-md font-medium'
                      : 'self-start bg-surface-2 text-ink rounded-bl-md border border-line'
                  }`}
                dangerouslySetInnerHTML={{ __html: m.role === 'user' ? escapeHtml(m.content) : formatBotMsg(m.content) }}
              />
            </div>
          );
        })}
        {loading && (
          <div>
            <div className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1 flex items-center gap-1.5 pl-1">
              <span className="w-1 h-1 bg-accent rounded-full" />
              제이크 멘토 · 입력 중...
            </div>
            <div className="self-start bg-surface-2 py-3.5 px-[18px] rounded-2xl rounded-bl-md border border-line flex gap-1 items-center w-fit">
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-dot-bounce" />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-dot-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-dot-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-3 flex gap-2 flex-wrap">
        <button onClick={() => sendMessage('내 학년에 맞는 탐구주제 추천해줘')} className="px-3 py-2 bg-surface border border-line rounded-full text-[11.5px] text-ink-soft cursor-pointer font-medium active:bg-accent-soft active:text-accent active:border-accent">
          탐구주제 추천
        </button>
        <button onClick={() => sendMessage('생기부 세특 어떻게 써야 잘 쓴 거야?')} className="px-3 py-2 bg-surface border border-line rounded-full text-[11.5px] text-ink-soft cursor-pointer font-medium active:bg-accent-soft active:text-accent active:border-accent">
          세특 작성법
        </button>
        <button onClick={() => sendMessage('학종에서 가장 중요한 건 뭐야?')} className="px-3 py-2 bg-surface border border-line rounded-full text-[11.5px] text-ink-soft cursor-pointer font-medium active:bg-accent-soft active:text-accent active:border-accent">
          학종 핵심
        </button>
      </div>

      <div
        className="flex-shrink-0 py-2 px-4 bg-bg border-t border-line-soft flex gap-2 items-center"
        style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom))' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="제이크 멘토에게 질문하기…"
          disabled={loading}
          className="flex-1 h-11 bg-surface-2 border border-line rounded-full px-[18px] text-ink text-[13px] placeholder:text-muted disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-11 h-11 rounded-full bg-accent text-white border-none cursor-pointer flex items-center justify-center transition-transform active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
            <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87 1l13.13 1.88L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .68.69 1.15 1.39.91z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateFallbackChat(userText: string, profile: ReturnType<typeof useStore.getState>['profile']): string {
  const t = userText.toLowerCase();
  if (t.includes('탐구주제') || t.includes('탐구')) {
    return `${profile.tracks[0] || '공학'} 계열에 어울리는 탐구주제는 **차별성**과 **교과 연계성** 두 가지를 모두 잡는 게 핵심이에요.\n\n탐구 탭에서 맞춤 추천 5선 확인하실 수 있어요.`;
  }
  if (t.includes('세특') || t.includes('생기부')) {
    return `세특 작성의 핵심은 **'무엇을 했는가'가 아니라 '어떻게 사고했는가'**예요.\n\n좋은 세특 4단계:\n• 학습 동기 (왜 이 주제를?)\n• 탐구 과정 (어떤 방법으로?)\n• 결과/발표 (무엇을 도출?)\n• 후속 의지 (다음은 무엇을?)`;
  }
  if (t.includes('학종') || t.includes('학생부종합')) {
    return `학종의 평가 핵심은 **'학업역량 + 진로역량 + 공동체역량'** 3축이에요.\n\n${profile.grade} 시점에서 가장 중요한 건 안정적 등급 유지와 세특·창체 일관성이에요.`;
  }
  return `좋은 질문이에요! 데모 모드에서는 정해진 답변만 가능해요. 정식 서비스에서는 ${profile.name}님의 프로필에 맞춘 정밀한 답변을 받으실 수 있습니다.`;
}
