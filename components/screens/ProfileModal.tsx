'use client';

import { useStore } from '@/lib/store';
import { useToast } from '../ui/Toast';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const profile = useStore((s) => s.profile);
  const resetAll = useStore((s) => s.resetAll);
  const { showToast } = useToast();

  if (!open) return null;

  const handleReset = () => {
    if (!confirm('모든 데이터를 초기화하고 처음부터 시작할까요?\n저장된 세특·감상문·대화도 모두 삭제됩니다.')) return;
    resetAll();
    showToast('초기화되었습니다');
    setTimeout(() => location.reload(), 500);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-[300] flex items-end justify-center md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] md:right-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl p-6 border border-line border-b-0 animate-[sheetUp_0.3s_cubic-bezier(0.34,1.2,0.64,1)]">
        <style>{`
          @keyframes sheetUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <h3 className="font-extrabold text-xl mb-4 tracking-tight">내 프로필</h3>
        <Row label="이름" val={profile.name || '-'} />
        <Row label="학년 / 학교" val={`${profile.grade || '-'} · ${profile.school || '-'}`} />
        <Row label="희망 계열" val={profile.tracks.join(', ') || '-'} />
        <Row label="희망 학과" val={profile.major || '미정'} />
        <Row label="예상 등급" val={profile.gradeRank || '-'} />
        <div className="grid gap-2 mt-4">
          <button onClick={handleReset} className="btn w-full text-[#E75050]">
            전체 초기화
          </button>
          <button onClick={onClose} className="btn w-full">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex justify-between items-center py-3.5 border-b border-line-soft text-[13px] last:border-0">
      <span className="text-muted">{label}</span>
      <span className="text-ink font-semibold">{val}</span>
    </div>
  );
}
