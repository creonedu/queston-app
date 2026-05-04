'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { TOPIC_DB } from '@/lib/content';
import type { Topic } from '@/lib/types';
import SebteukPanel from './SebteukPanel';

const SUBJECTS = ['전체', '국어', '수학', '영어', '과학', '사회'];

export default function TopicScreen() {
  const profile = useStore((s) => s.profile);
  const [filter, setFilter] = useState('전체');
  const [openTopic, setOpenTopic] = useState<Topic | null>(null);

  const allTopics = useMemo(() => {
    const tracks = profile.tracks.length > 0 ? profile.tracks : (['공학'] as const);
    let topics: Topic[] = [];
    tracks.forEach((t) => {
      if (TOPIC_DB[t]) topics = topics.concat(TOPIC_DB[t]);
    });
    // dedupe by title
    const seen = new Set<string>();
    topics = topics.filter((t) => {
      if (seen.has(t.title)) return false;
      seen.add(t.title);
      return true;
    });
    topics.sort((a, b) => {
      if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
      return b.fit - a.fit;
    });
    return topics;
  }, [profile.tracks]);

  const filtered = filter === '전체' ? allTopics : allTopics.filter((t) => t.subj === filter);

  return (
    <>
      <div className="animate-view-fade">
        <div className="flex justify-between items-center px-6 pt-5 pb-4">
          <div>
            <div className="text-eyebrow mb-1">02 · 탐구주제</div>
            <div className="font-bold text-xl tracking-tight">
              {profile.tracks[0] || '공학'} 계열
              <br />
              탐구주제{' '}
              <span className="font-serif italic font-normal text-accent">{filtered.length}선</span>
            </div>
          </div>
        </div>

        <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUBJECTS.map((s) => (
            <div
              key={s}
              onClick={() => setFilter(s)}
              className={`pill ${filter === s ? 'pill-active' : ''}`}
            >
              {s}
            </div>
          ))}
        </div>

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 px-6 text-muted text-[13px] leading-7">
              <div className="font-serif italic text-5xl text-line mb-4">∅</div>
              해당 과목 주제가 없어요.
              <br />
              다른 필터를 선택해보세요.
            </div>
          ) : (
            filtered.map((t, i) => (
              <div
                key={t.title}
                onClick={() => setOpenTopic(t)}
                className={`mx-4 mb-3 p-5 border rounded-[20px] cursor-pointer transition-all active:scale-[0.99]
                  ${t.featured ? 'border-[rgba(255,87,34,0.3)] bg-gradient-to-br from-[rgba(255,87,34,0.08)] to-[rgba(255,87,34,0.02)]' : 'bg-surface border-line'}`}
              >
                <div className="flex gap-2 items-center mb-3 font-mono text-[10px] text-muted tracking-widest uppercase flex-wrap">
                  {t.featured ? (
                    <span className="px-2 py-0.5 bg-accent-soft text-accent rounded font-semibold">★ AI 추천</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-surface-3 text-ink-soft rounded font-semibold">{i + 1}위</span>
                  )}
                  <span>{t.sub}</span>
                </div>
                <div className="font-bold text-[15px] leading-snug text-ink mb-2.5 tracking-tight">{t.title}</div>
                <div className="text-[12.5px] text-ink-soft leading-relaxed mb-3.5">{t.desc}</div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-line">
                  <div className="flex gap-4 font-mono text-[10px] text-muted flex-wrap">
                    <span>난이도 <b className="text-ink ml-1 font-bold">{t.diff}</b></span>
                    <span>차별성 <b className="text-ink ml-1 font-bold">{t.uniq}</b></span>
                    <span>적합 <b className="text-ink ml-1 font-bold">{t.fit}</b></span>
                  </div>
                  <div className="text-[11px] font-semibold text-accent flex items-center gap-1">세특 초안 →</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {openTopic && (
        <SebteukPanel
          topic={openTopic}
          onClose={() => setOpenTopic(null)}
        />
      )}
    </>
  );
}
