'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '../ui/Toast';
import type { Topic } from '@/lib/types';

interface SebteukPanelProps {
  topic: Topic;
  onClose: () => void;
}

function generateFallback(topic: Topic, profile: { tracks: string[]; major: string }): string {
  return `'${topic.sub.split('·')[1]?.trim() || topic.sub}' 단원 학습 후 일상 속 적용 사례를 탐구하던 중, 【${topic.title.split(' ').slice(0, 3).join(' ')}】에 강한 흥미를 느낌. 관련 자료와 최신 연구 동향을 자기주도적으로 조사하여 핵심 원리를 정리하고, 이를 시각 자료(표·그래프)로 재구성하여 학우들에게 발표함. 발표 과정에서 【핵심 개념의 응용】을 일상 사례와 연결하여 설명한 점이 인상적이었으며, 단순 암기가 아닌 【비판적 사고와 융합적 접근】으로 주제를 확장하는 모습이 돋보임. 발표 후 동료 학생들의 질문에 근거를 들어 답변하고, 후속 탐구로 ${profile.tracks[0] || '관련 분야'}의 심화 주제를 자발적으로 계획하는 등 【자기주도성과 학문적 호기심】이 두드러짐. ${profile.major || profile.tracks[0] || '진로'} 분야로의 진로 의지가 학습 활동을 통해 구체화되고 있는 점이 우수함.`;
}

export default function SebteukPanel({ topic, onClose }: SebteukPanelProps) {
  const profile = useStore((s) => s.profile);
  const savedSebteuks = useStore((s) => s.savedSebteuks);
  const saveSebteuk = useStore((s) => s.saveSebteuk);
  const { showToast } = useToast();

  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sebteuk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, topic }),
      });
      const data = await res.json();
      if (data.error) {
        // Fall back if server has no API key
        setDraft(generateFallback(topic, profile));
        showToast('데모 모드: ' + (data.error.includes('API') ? 'API 키 미설정' : '오류'));
      } else {
        setDraft(data.draft);
      }
    } catch (err) {
      setDraft(generateFallback(topic, profile));
      showToast('네트워크 오류 — 데모 답변');
    } finally {
      setLoading(false);
    }
  }, [profile, topic, showToast]);

  useEffect(() => {
    const cached = savedSebteuks.find((s) => s.title === topic.title);
    if (cached) setDraft(cached.draft);
    else generate();
  }, [topic.title, savedSebteuks, generate]);

  const handleSave = () => {
    saveSebteuk({
      title: topic.title,
      subj: topic.subj,
      sub: topic.sub,
      draft,
      savedAt: new Date().toISOString(),
    });
    showToast('저장되었습니다');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft.replace(/【|】/g, ''));
      showToast('복사되었습니다');
    } catch {
      showToast('복사 실패');
    }
  };

  // highlight terms
  const renderDraft = () => {
    if (!draft) return null;
    const parts = draft.split(/(【[^】]+】)/);
    return parts.map((p, i) => {
      if (p.startsWith('【') && p.endsWith('】')) {
        return (
          <mark key={i} className="bg-gold-soft text-gold px-1 rounded-sm font-semibold">
            {p.slice(1, -1)}
          </mark>
        );
      }
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-bg z-[80] flex flex-col md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] md:border-l md:border-r md:border-line"
      style={{ paddingTop: 'env(safe-area-inset-top)', animation: 'panelSlide 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)' }}
    >
      <style>{`
        @keyframes panelSlide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (min-width: 768px) {
          @keyframes panelSlide {
            from { transform: translate(-50%, 0) translateX(100%); }
            to { transform: translateX(-50%); }
          }
        }
      `}</style>

      <div className="flex-shrink-0 flex items-center px-5 pt-5 pb-4 gap-3 border-b border-line">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-surface-2 border-none text-ink text-lg flex items-center justify-center cursor-pointer font-serif"
        >
          ‹
        </button>
        <div>
          <div className="text-eyebrow mb-0.5">세특 초안</div>
          <div className="font-bold text-[15px]">
            {topic.title.length > 24 ? topic.title.slice(0, 24) + '...' : topic.title}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 pb-10 scrollbar-hide">
        <div className="flex gap-2 items-center mb-4 font-mono text-[10px] text-muted tracking-widest uppercase flex-wrap">
          <span className="px-2 py-0.5 bg-accent-soft text-accent rounded font-semibold">★ 차별성 {topic.uniq}</span>
          <span className="px-2 py-0.5 bg-surface-3 text-ink-soft rounded font-semibold">적합 {topic.fit}</span>
          <span>{topic.sub} · 추천 분량 500자</span>
        </div>

        {loading && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-accent py-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-dot-pulse" />
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-dot-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-dot-pulse" style={{ animationDelay: '0.4s' }} />
            <span className="text-[10px] tracking-wide">AI가 세특 초안을 작성 중...</span>
          </div>
        )}

        <div
          className={`bg-surface border border-line rounded-2xl p-[18px] mb-5 transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`}
        >
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3 flex justify-between items-center">
            <span>AI 초안</span>
            <span className="font-korean text-ink-soft normal-case tracking-normal font-medium">
              {draft.replace(/【|】/g, '').length}자
            </span>
          </div>
          <div className="text-[13.5px] leading-[1.75] text-ink whitespace-pre-wrap">
            {renderDraft()}
          </div>
        </div>

        <div className="grid gap-2 mb-5">
          <button onClick={generate} className="btn btn-primary w-full" disabled={loading}>
            ✨ 다시 생성
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleCopy} className="btn">복사</button>
            <button onClick={handleSave} className="btn btn-accent">저장</button>
          </div>
        </div>

        <div className="font-bold text-sm text-ink-soft mb-3">근거 자료</div>
        <SourceItem title="2022 개정 교육과정 성취기준" meta="교과별 성취기준 RAG" tag="RAG" />
        <SourceItem title="2024 학생부 기재요령" meta="교육부 공식 가이드라인" tag="RAG" />
      </div>
    </div>
  );
}

function SourceItem({ title, meta, tag }: { title: string; meta: string; tag: string }) {
  return (
    <div className="bg-surface-2 border border-line rounded-2xl py-[18px] px-5 grid grid-cols-[1fr_auto] gap-3 items-center mb-2">
      <div className="min-w-0">
        <div className="font-bold text-[13px] text-ink mb-1">{title}</div>
        <div className="text-[11px] text-muted">{meta}</div>
      </div>
      <div className="text-[11px] text-green-q font-semibold">{tag}</div>
    </div>
  );
}
