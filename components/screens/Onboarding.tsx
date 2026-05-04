'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { generateInitialMissions } from '@/lib/content';
import { useToast } from '../ui/Toast';
import type { Track, Grade, SchoolType, GradeRank } from '@/lib/types';

const GRADES: Grade[] = ['중3', '고1', '고2', '고3'];
const SCHOOLS: SchoolType[] = ['일반고', '자공고', '자사고', '외고/국제고', '과학고', '중학교'];
const TRACKS: Track[] = ['공학', '자연과학', '의약', '경상', '사회과학', '인문', '교육', '예체능'];
const GRADE_RANKS: GradeRank[] = ['1.0~1.5', '1.5~2.0', '2.0~2.5', '2.5~3.0', '3.0~', '모름'];

interface FormData {
  name: string;
  grade: Grade | '';
  school: SchoolType | '';
  tracks: Track[];
  major: string;
  gradeRank: GradeRank | '';
}

export default function Onboarding() {
  const setProfile = useStore((s) => s.setProfile);
  const setOnboarded = useStore((s) => s.setOnboarded);
  const setMissions = useStore((s) => s.setMissions);
  const recalcDiagnosis = useStore((s) => s.recalcDiagnosis);
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    name: '',
    grade: '',
    school: '',
    tracks: [],
    major: '',
    gradeRank: '',
  });
  const [closing, setClosing] = useState(false);

  const handleNext = (from: number) => {
    if (from === 2) {
      if (!data.name.trim() || !data.grade || !data.school) {
        showToast('모든 항목을 채워주세요');
        return;
      }
    } else if (from === 3) {
      if (data.tracks.length === 0 || !data.gradeRank) {
        showToast('계열과 등급을 선택해주세요');
        return;
      }
    }
    setStep(from + 1);
  };

  const handleFinish = () => {
    // Save profile
    setProfile({
      name: data.name.trim(),
      grade: data.grade,
      school: data.school,
      tracks: data.tracks,
      major: data.major.trim(),
      gradeRank: data.gradeRank,
    });
    recalcDiagnosis();
    setMissions(generateInitialMissions(data.tracks));
    setOnboarded(true);

    setClosing(true);
    setTimeout(() => {
      // The parent (page.tsx) will detect onboarded=true and switch view
    }, 400);
  };

  const toggleTrack = (t: Track) => {
    setData({
      ...data,
      tracks: data.tracks.includes(t)
        ? data.tracks.filter((x) => x !== t)
        : [...data.tracks, t],
    });
  };

  const dotClass = (n: number) => `flex-1 h-[3px] rounded-sm transition-colors ${n <= step ? 'bg-accent' : 'bg-surface-2'}`;
  const chipBase = 'px-[18px] py-[11px] border rounded-full text-[13px] font-medium cursor-pointer transition-all active:scale-[0.96]';
  const chipActive = 'bg-accent text-white border-accent font-semibold';
  const chipInactive = 'bg-surface text-ink-soft border-line';

  return (
    <div
      className={`fixed inset-0 bg-bg z-[1000] flex flex-col px-7 overflow-y-auto transition-all duration-400
        md:max-w-[480px] md:mx-auto md:border-l md:border-r md:border-line
        ${closing ? '-translate-y-8 opacity-0 pointer-events-none' : ''}`}
      style={{
        paddingTop: 'calc(40px + env(safe-area-inset-top))',
        paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
      }}
    >
      {step === 1 && (
        <div className="flex-1 flex flex-col animate-view-fade">
          <div className="flex gap-1.5 mb-10">
            <div className={dotClass(1)} />
            <div className={dotClass(2)} />
            <div className={dotClass(3)} />
            <div className={dotClass(4)} />
          </div>
          <div className="text-eyebrow mb-3.5">Welcome to Queston</div>
          <h1 className="font-extrabold text-3xl leading-tight tracking-tight text-ink mb-3">
            교과를 넘어,
            <br />
            <span className="font-serif italic font-normal text-accent text-[0.96em]">
              생기부의 새로운 표준
            </span>
            으로.
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed mb-8">
            퀘스트온은 영어·수학 학습 데이터를 분석해 학생 한 명 한 명에게 맞는 탐구주제·도서·세특 초안을 추천하는 AI 비교과 도우미입니다. 시작하려면 먼저 본인 정보를 알려주세요.
          </p>
          <div className="mt-auto pt-6">
            <button onClick={() => handleNext(1)} className="btn-block">
              시작하기
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col animate-view-fade">
          <div className="flex gap-1.5 mb-10">
            <div className={dotClass(1)} />
            <div className={dotClass(2)} />
            <div className={dotClass(3)} />
            <div className={dotClass(4)} />
          </div>
          <div className="text-eyebrow mb-3.5">Step 1 / 3 · 기본 정보</div>
          <h1 className="font-extrabold text-3xl leading-tight tracking-tight text-ink mb-3">
            먼저, 이름과
            <br />
            학년부터요.
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed mb-8">
            개인화 추천에 필요한 최소 정보입니다. 모든 데이터는 이 기기에만 저장돼요.
          </p>

          <div className="mb-[18px]">
            <label className="block text-xs font-semibold text-ink-soft mb-2 tracking-tight">이름</label>
            <input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="홍길동"
              maxLength={20}
              className="w-full h-[52px] bg-surface border border-line rounded-2xl px-[18px] text-ink text-[15px] font-medium focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>

          <div className="mb-[18px]">
            <label className="block text-xs font-semibold text-ink-soft mb-2 tracking-tight">학년</label>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => (
                <div
                  key={g}
                  onClick={() => setData({ ...data, grade: g })}
                  className={`${chipBase} ${data.grade === g ? chipActive : chipInactive}`}
                >
                  {g}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-[18px]">
            <label className="block text-xs font-semibold text-ink-soft mb-2 tracking-tight">학교 유형</label>
            <div className="flex flex-wrap gap-2">
              {SCHOOLS.map((s) => (
                <div
                  key={s}
                  onClick={() => setData({ ...data, school: s })}
                  className={`${chipBase} ${data.school === s ? chipActive : chipInactive}`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => handleNext(2)}
              disabled={!data.name.trim() || !data.grade || !data.school}
              className="btn-block"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col animate-view-fade">
          <div className="flex gap-1.5 mb-10">
            <div className={dotClass(1)} />
            <div className={dotClass(2)} />
            <div className={dotClass(3)} />
            <div className={dotClass(4)} />
          </div>
          <div className="text-eyebrow mb-3.5">Step 2 / 3 · 진로</div>
          <h1 className="font-extrabold text-3xl leading-tight tracking-tight text-ink mb-3">
            관심 있는 <span className="font-serif italic font-normal text-accent">계열</span>은?
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed mb-8">
            탐구주제·도서·합격사례 매칭에 활용됩니다. 나중에 변경할 수 있어요.
          </p>

          <div className="mb-[18px]">
            <label className="block text-xs font-semibold text-ink-soft mb-2 tracking-tight">희망 계열 (1개 이상)</label>
            <div className="flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <div
                  key={t}
                  onClick={() => toggleTrack(t)}
                  className={`${chipBase} ${data.tracks.includes(t) ? chipActive : chipInactive}`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-[18px]">
            <label className="block text-xs font-semibold text-ink-soft mb-2 tracking-tight">희망 학과 (선택)</label>
            <input
              value={data.major}
              onChange={(e) => setData({ ...data, major: e.target.value })}
              placeholder="예: 화학공학, 경영학, 미정"
              maxLength={40}
              className="w-full h-[52px] bg-surface border border-line rounded-2xl px-[18px] text-ink text-[15px] font-medium focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>

          <div className="mb-[18px]">
            <label className="block text-xs font-semibold text-ink-soft mb-2 tracking-tight">예상 내신 등급</label>
            <div className="flex flex-wrap gap-2">
              {GRADE_RANKS.map((r) => (
                <div
                  key={r}
                  onClick={() => setData({ ...data, gradeRank: r })}
                  className={`${chipBase} ${data.gradeRank === r ? chipActive : chipInactive}`}
                >
                  {r === '모름' ? '아직 모름' : r === '3.0~' ? '3.0 이하' : r}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => handleNext(3)}
              disabled={data.tracks.length === 0 || !data.gradeRank}
              className="btn-block"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col animate-view-fade">
          <div className="flex gap-1.5 mb-10">
            <div className={dotClass(1)} />
            <div className={dotClass(2)} />
            <div className={dotClass(3)} />
            <div className={dotClass(4)} />
          </div>
          <div className="text-eyebrow mb-3.5">Step 3 / 3 · 마무리</div>
          <h1 className="font-extrabold text-3xl leading-tight tracking-tight text-ink mb-3">
            준비 완료!
            <br />
            <span className="font-serif italic font-normal text-accent">{data.name}님</span>의 학생부 여정을 시작합니다.
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed mb-6">
            입력하신 프로필을 기반으로 맞춤 콘텐츠를 준비했어요:
          </p>

          <div className="bg-surface border border-line rounded-2xl p-5 mb-4">
            <div className="text-[11px] font-semibold text-ink-soft mb-3 tracking-tight">📋 프로필 요약</div>
            <div className="grid gap-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted">이름</span>
                <span className="font-semibold">{data.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">학년 / 학교</span>
                <span className="font-semibold">{data.grade} · {data.school}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">희망 계열</span>
                <span className="font-semibold">{data.tracks.join(', ')}</span>
              </div>
              {data.major && (
                <div className="flex justify-between">
                  <span className="text-muted">희망 학과</span>
                  <span className="font-semibold">{data.major}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">예상 등급</span>
                <span className="font-semibold">{data.gradeRank}</span>
              </div>
            </div>
          </div>

          <div className="bg-accent-soft border border-[rgba(255,87,34,0.25)] rounded-2xl p-4 mb-4 text-[12px] text-accent leading-relaxed">
            <div className="flex gap-2.5 items-start">
              <span className="font-serif italic text-lg">★</span>
              <div>
                AI 멘토 채팅과 세특 초안 자동 생성은 백엔드 서버를 통해 작동합니다. 키 입력 없이 바로 사용 가능해요.
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button onClick={handleFinish} className="btn-block">
              퀘스트온 시작하기 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
