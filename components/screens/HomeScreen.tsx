'use client';

import { useStore } from '@/lib/store';
import type { TabKey } from '../ui/TabBar';

interface HomeScreenProps {
  onNavigate: (tab: TabKey) => void;
  onOpenProfile: () => void;
}

export default function HomeScreen({ onNavigate, onOpenProfile }: HomeScreenProps) {
  const profile = useStore((s) => s.profile);
  const diag = useStore((s) => s.diag);
  const missions = useStore((s) => s.missions);
  const stats = useStore((s) => s.stats);
  const savedSebteuks = useStore((s) => s.savedSebteuks);
  const completeMission = useStore((s) => s.completeMission);

  const initial = profile.name.charAt(0) || '?';
  const undone = missions.filter((m) => !m.done).length;
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const doneCount = missions.filter((m) => m.done).length;

  const grade =
    diag.score >= 90 ? 'A 최우수' :
    diag.score >= 80 ? 'B+ 우수' :
    diag.score >= 70 ? 'B 양호' :
    diag.score >= 60 ? 'C 보완 필요' : 'D 집중 보강';

  const pct = Math.round(100 - (diag.score / 100) * 90);

  const handleMissionClick = (m: typeof missions[0]) => {
    if (m.done) return;
    completeMission(m.id);
    onNavigate(m.target);
  };

  return (
    <div className="animate-view-fade">
      {/* App header */}
      <div className="flex justify-between items-center px-6 pt-5 pb-4">
        <div className="font-serif italic font-normal text-[22px] tracking-tight">
          queston<span className="inline-block w-1.5 h-1.5 bg-accent rounded-full ml-0.5 align-middle" />
        </div>
        <div
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center font-bold text-sm text-bg relative cursor-pointer"
        >
          {initial}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-q rounded-full border-2 border-bg" />
        </div>
      </div>

      {/* Greeting */}
      <div className="px-6 pb-6">
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="chip">
            {profile.grade} · {profile.school}
          </span>
          <span className="chip chip-accent">● {profile.tracks[0] || '학종'} 트랙</span>
        </div>
        <h1 className="font-extrabold text-[26px] leading-[1.25] tracking-tight text-ink mb-2">
          {undone > 0 ? (
            <>
              {profile.name}님,{' '}
              <span className="font-serif italic font-normal text-accent text-[0.95em]">{undone}개</span>의<br />
              미션이 기다리고 있어요.
            </>
          ) : (
            <>
              {profile.name}님,{' '}
              <span className="font-serif italic font-normal text-accent text-[0.95em]">멋져요!</span>
              <br />
              오늘 미션 모두 완료.
            </>
          )}
        </h1>
        <p className="text-[13px] text-muted leading-snug">
          AI가 분석한 학생 프로파일 기반 · {month}월 {date}일 갱신
        </p>
      </div>

      {/* Diagnosis card */}
      <div className="mx-4 mb-6 bg-gradient-to-br from-[#1F242E] to-surface border border-line rounded-3xl p-6 relative overflow-hidden">
        <div
          className="absolute -top-1/2 -right-[30%] w-60 h-60 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,87,34,0.12), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <div className="flex justify-between items-center mb-5 relative z-10">
          <div className="font-bold text-[13px] text-ink-soft">학종 적합도 진단</div>
          <span className="text-eyebrow">live</span>
        </div>
        <div className="flex items-baseline gap-3 mb-5 relative z-10">
          <div className="font-serif font-light text-[64px] leading-[0.95] tracking-tighter">
            {diag.score}
          </div>
          <div>
            <div className="text-[11px] text-muted mb-1">상위 {pct}%</div>
            <div className="font-bold text-sm text-accent px-2.5 py-1 bg-accent-soft rounded-md inline-block">
              {grade}
            </div>
          </div>
        </div>
        <div className="grid gap-2.5 relative z-10">
          {(['교과', '세특', '창체', '독서'] as const).map((label, i) => {
            const colors = ['accent', 'gold', 'green-q', 'blue-q'] as const;
            const value = diag.breakdown[label];
            return (
              <div
                key={label}
                className="grid grid-cols-[60px_1fr_32px] gap-2.5 items-center"
              >
                <div className="text-[11px] text-muted font-medium">{label}</div>
                <div className="h-1.5 bg-white/5 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm animate-bar-grow origin-left"
                    style={{
                      width: `${value}%`,
                      background: `var(--tw-${colors[i]}, #FF5722)`,
                      backgroundColor: i === 0 ? '#FF5722' : i === 1 ? '#E8B547' : i === 2 ? '#6FBF73' : '#6BA4D8',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                </div>
                <div className="font-mono text-[11px] text-right text-ink-soft font-semibold">{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missions */}
      <div className="font-bold text-sm text-ink-soft mx-6 mb-3 flex justify-between items-center">
        오늘의 미션 <span className="text-xs text-muted font-normal">{doneCount} / {missions.length} 완료</span>
      </div>
      <div className="px-4 grid gap-2.5 mb-7">
        {missions.map((m) => {
          const iconBg =
            m.iconClass === 'gold' ? 'bg-gold-soft text-gold' :
            m.iconClass === 'green' ? 'bg-green-soft text-green-q' :
            m.iconClass === 'blue' ? 'bg-blue-soft text-blue-q' :
            'bg-accent-soft text-accent';
          return (
            <div
              key={m.id}
              onClick={() => handleMissionClick(m)}
              className={`bg-surface border border-line rounded-[18px] py-4 px-[18px] grid grid-cols-[40px_1fr_auto] gap-3.5 items-center cursor-pointer transition-all
                ${m.done ? '' : 'active:scale-[0.985] active:bg-surface-2'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif italic text-lg
                ${m.done ? 'bg-green-soft text-green-q' : iconBg}`}>
                {m.done ? '✓' : m.icon}
              </div>
              <div className="flex flex-col gap-[3px] min-w-0">
                <strong className={`text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis tracking-tight
                  ${m.done ? 'text-muted line-through' : 'text-ink'}`}>
                  {m.text}
                </strong>
                <span className="text-[11px] text-muted">
                  {m.done ? '완료됨' : m.sub}
                </span>
              </div>
              <div className={`w-6 h-6 flex items-center justify-center text-muted text-lg font-serif ${m.done ? 'opacity-30' : ''}`}>
                →
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="font-bold text-sm text-ink-soft mx-6 mb-3">학기 누적 활동</div>
      <div className="px-4 grid grid-cols-2 gap-2.5 mb-7">
        <StatCard glyph="τ" label="탐구활동" value={stats.topics} unit="건" trend={stats.topics > 0 ? `+${stats.topics} 누적` : '시작해보세요'} />
        <StatCard glyph="π" label="완독 도서" value={stats.books} unit="권" trend="목표 12권" />
        <StatCard glyph="σ" label="세특 초안" value={savedSebteuks.length} unit="개" trend="검토 대기" />
        <StatCard glyph="μ" label="멘토 대화" value={stats.chats} unit="회" trend={stats.chats > 0 ? '최근 활동' : '새로운 대화'} />
      </div>
    </div>
  );
}

function StatCard({ glyph, label, value, unit, trend }: { glyph: string; label: string; value: number; unit: string; trend: string }) {
  return (
    <div className="bg-surface border border-line rounded-[18px] p-[18px] relative overflow-hidden">
      <div className="absolute top-[14px] right-4 font-serif italic text-line text-sm">{glyph}</div>
      <div className="text-[11px] text-muted mb-2 font-medium">{label}</div>
      <div className="font-serif font-normal text-[32px] leading-none tracking-tight">
        {value}<span className="text-sm text-muted ml-0.5 italic">{unit}</span>
      </div>
      <div className="font-mono text-[10px] text-green-q mt-1.5">{trend}</div>
    </div>
  );
}
