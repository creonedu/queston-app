'use client';

import { useStore } from '@/lib/store';
import { MATCH_DB, UNIVERSITY_DB } from '@/lib/content';
import { useToast } from '../ui/Toast';

export default function MatchScreen() {
  const profile = useStore((s) => s.profile);
  const completeMission = useStore((s) => s.completeMission);
  const { showToast } = useToast();

  const track = profile.tracks[0] || '공학';
  const matches = MATCH_DB[track] || MATCH_DB['공학'];
  const universities = [...(UNIVERSITY_DB[track] || UNIVERSITY_DB['공학'])].sort(
    (a, b) => Number(b.target) - Number(a.target) || b.prob - a.prob
  );
  const topScore = matches[0]?.score || 80;

  const handleMatchClick = () => {
    completeMission('m3');
    showToast('상세 사례는 정식 버전에서 제공');
  };

  return (
    <div className="animate-view-fade">
      <div className="flex justify-between items-center px-6 pt-5 pb-4">
        <div>
          <div className="text-eyebrow mb-1">04 · 합격사례 매칭</div>
          <div className="font-bold text-xl tracking-tight">
            나와 <span className="font-serif italic font-normal text-gold">닮은</span> 합격생
          </div>
        </div>
      </div>

      <div className="mx-4 mb-5 p-6 border border-line rounded-3xl text-center relative overflow-hidden bg-surface" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(232,181,71,0.15), transparent 60%), #16191F' }}>
        <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-3">Top Similarity</div>
        <div className="font-serif font-light text-[72px] leading-[0.95] tracking-tighter mb-2">
          {topScore}<span className="text-[28px] text-gold italic align-top ml-1">%</span>
        </div>
        <div className="text-[13px] text-ink-soft leading-snug max-w-[280px] mx-auto">
          <strong className="text-gold">{matches.length}명의 합격생</strong>이 {profile.name}님과 비슷한 프로파일로 합격했어요. 가장 유사한 사례부터 확인해보세요.
        </div>
      </div>

      <div className="font-bold text-sm text-ink-soft mx-6 mb-3">유사도 순</div>
      {matches.map((m) => (
        <div
          key={m.name}
          onClick={handleMatchClick}
          className="mx-4 mb-2.5 py-[18px] px-5 bg-surface border border-line rounded-2xl grid grid-cols-[1fr_auto] gap-3 items-center cursor-pointer"
        >
          <div className="min-w-0">
            <div className="font-bold text-[15px] text-ink mb-1">{m.name}</div>
            <div className="text-[11px] text-muted">{m.meta}</div>
          </div>
          <div className="font-serif italic text-[22px] text-gold font-normal">{m.score}%</div>
        </div>
      ))}
      <div className="h-6" />

      <div className="font-bold text-sm text-ink-soft mx-6 mb-3 flex justify-between items-center">
        내 합격 가능권 <span className="text-xs text-muted font-normal">학종 기준</span>
      </div>
      {universities.map((u) => (
        <div
          key={u.name}
          className={`mx-4 mb-3 p-[22px] border rounded-3xl
            ${u.target ? 'border-[rgba(232,181,71,0.3)] bg-gradient-to-br from-[rgba(232,181,71,0.06)] to-[rgba(232,181,71,0.02)]' : 'bg-surface border-line'}`}
        >
          <div className="flex justify-between items-start mb-3.5">
            <div>
              <div className="font-bold text-base text-ink mb-0.5 tracking-tight">{u.name}</div>
              <div className="text-[11px] text-muted">{u.major}</div>
            </div>
            <div className="text-right">
              <div className="font-serif text-[22px] leading-none text-accent">
                {u.prob}<span className="text-sm">%</span>
              </div>
              <div className="text-[10px] text-muted font-mono uppercase tracking-widest">합격</div>
            </div>
          </div>
          <div className="h-1 bg-white/5 rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm bg-gradient-to-r from-accent to-gold"
              style={{ width: `${u.prob}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
