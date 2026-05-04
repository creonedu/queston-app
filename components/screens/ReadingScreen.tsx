'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { BOOK_DB } from '@/lib/content';
import { useToast } from '../ui/Toast';

const QUIZ_DB: Record<string, { q: string; options: { text: string; correct: boolean }[] }> = {
  자연과학: {
    q: '다이아몬드가 주장한 유라시아 대륙의 지리적 우위는 무엇 때문인가?',
    options: [
      { text: 'A. 인구 밀도가 높았기 때문에', correct: false },
      { text: 'B. 동서로 길어 작물·가축의 전파가 쉬웠기 때문에', correct: true },
      { text: 'C. 강력한 중앙집권 국가가 일찍 형성됐기 때문에', correct: false },
      { text: 'D. 종교적 단일성이 컸기 때문에', correct: false },
    ],
  },
  경상: {
    q: '카너먼이 정의한 시스템1과 시스템2의 차이는?',
    options: [
      { text: 'A. 시스템1은 빠르고 직관적, 시스템2는 느리고 분석적', correct: true },
      { text: 'B. 시스템1은 좌뇌, 시스템2는 우뇌', correct: false },
      { text: 'C. 시스템1은 의식, 시스템2는 무의식', correct: false },
      { text: 'D. 둘은 동일한 사고 과정', correct: false },
    ],
  },
};

export default function ReadingScreen() {
  const profile = useStore((s) => s.profile);
  const userEssay = useStore((s) => s.userEssay);
  const setUserEssay = useStore((s) => s.setUserEssay);
  const completeMission = useStore((s) => s.completeMission);
  const incrementStat = useStore((s) => s.incrementStat);
  const stats = useStore((s) => s.stats);
  const { showToast } = useToast();

  const track = profile.tracks[0] || '자연과학';
  const book = BOOK_DB[track] || BOOK_DB['자연과학'];
  const quiz = QUIZ_DB[track] || QUIZ_DB['자연과학'];

  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const defaultEssay = useMemo(
    () =>
      userEssay ||
      `${book.name}을 읽으며 가장 인상깊었던 부분은 ${
        track === '경상' ? '인간이 항상 합리적으로 사고하지 않는다는' : '익숙한 현상의 이면을 새롭게 보게 되었다는'
      } 점이었다. 이전에는 ${
        track === '경상' ? '경제 주체들이 효용을 극대화한다고만 배웠는데' : '단순한 사실로만 알았던 내용이었는데'
      }, 이 책을 통해 새로운 분석 틀을 얻을 수 있었다.`,
    [book.name, track, userEssay]
  );

  const handleQuizSelect = (idx: number) => {
    setSelectedQuiz(idx);
    const correct = quiz.options[idx].correct;
    setTimeout(() => {
      setQuizResult(correct ? 'correct' : 'wrong');
      if (correct) {
        showToast('정답이에요! +1점');
        if (stats.books === 0) incrementStat('books');
        completeMission('m2');
      } else {
        showToast('아쉬워요. 정답을 확인하세요.');
      }
    }, 300);
  };

  const handleGetFeedback = async () => {
    const essay = defaultEssay;
    if (essay.length < 50) {
      showToast('50자 이상 입력해주세요');
      return;
    }
    setFeedbackLoading(true);
    setAiFeedback(null);

    try {
      const res = await fetch('/api/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, bookName: book.name, essay }),
      });
      const data = await res.json();
      if (data.error) {
        // Fallback
        setAiFeedback(generateFallbackFeedback(book.name, profile.tracks[0] || '자연과학'));
        showToast('데모 모드로 답변');
      } else {
        setAiFeedback(data.feedback);
      }
    } catch {
      setAiFeedback(generateFallbackFeedback(book.name, profile.tracks[0] || '자연과학'));
      showToast('네트워크 오류 — 데모 답변');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const renderHighlight = (text: string) => {
    const parts = text.split(/(【[^】]+】)/);
    return parts.map((p, i) =>
      p.startsWith('【') && p.endsWith('】') ? (
        <mark key={i} className="bg-gold-soft text-gold px-1 rounded-sm font-semibold">
          {p.slice(1, -1)}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  return (
    <div className="animate-view-fade">
      <div className="flex justify-between items-center px-6 pt-5 pb-4">
        <div>
          <div className="text-eyebrow mb-1">03 · 독서 큐레이션</div>
          <div className="font-bold text-xl tracking-tight">
            이번 주, <span className="font-serif italic font-normal text-gold">한 권의 책</span>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-6 p-6 bg-gradient-to-br from-[#1A1F26] to-bg border border-line rounded-3xl grid grid-cols-[auto_1fr] gap-[18px] items-center relative overflow-hidden">
        <div
          className="absolute -top-10 -right-10 w-44 h-44 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232,181,71,0.15), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <div className="w-[88px] h-[124px] bg-gradient-to-br from-[#4A3220] to-[#2A1810] rounded-l flex flex-col justify-center items-center p-3 text-center font-serif text-gold relative z-10 shadow-2xl">
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-black/40" />
          <div className="text-[9px] tracking-wider opacity-70 mb-2 uppercase">{book.topword}</div>
          <div className="text-[13px] not-italic font-medium leading-[1.2]" style={{ color: '#F0D9A8' }} dangerouslySetInnerHTML={{ __html: book.title }} />
          <div className="mt-1.5 text-[9px] opacity-70">{book.author}</div>
        </div>
        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-2">★ 학과 매칭 도서</div>
          <div className="font-bold text-base text-ink mb-1 tracking-tight">{book.name}</div>
          <div className="text-[11px] text-muted mb-2.5">{book.meta}</div>
          <div className="text-[12px] text-ink-soft leading-snug">{book.desc}</div>
        </div>
      </div>

      <div className="font-bold text-sm text-ink-soft mx-6 mb-3 flex justify-between items-center">
        1장 이해도 퀴즈 <span className="text-xs text-muted font-normal">2 / 5 문항</span>
      </div>

      <div className="mx-4 mb-4 bg-surface border border-line rounded-[18px] p-5">
        <div className="text-sm font-semibold text-ink leading-snug mb-4">
          <span className="font-mono text-[11px] text-accent mr-2 font-bold">Q3.</span>
          {quiz.q}
        </div>
        <div className="grid gap-2">
          {quiz.options.map((opt, i) => {
            const isSelected = selectedQuiz === i;
            const showResult = quizResult !== null;
            const isCorrect = opt.correct;
            return (
              <button
                key={i}
                onClick={() => quizResult === null && handleQuizSelect(i)}
                disabled={quizResult !== null}
                className={`py-3.5 px-4 border rounded-xl text-[13px] cursor-pointer transition-all flex items-center gap-3 text-left w-full
                  ${
                    showResult && isCorrect
                      ? 'bg-green-soft border-green-q text-ink'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-[rgba(231,80,80,0.1)] border-[#E75050] text-ink'
                      : isSelected
                      ? 'bg-accent-soft border-accent text-ink'
                      : 'bg-surface-2 border-line text-ink-soft'
                  }`}
              >
                <span
                  className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 transition-all
                    ${
                      showResult && isCorrect
                        ? 'border-green-q bg-green-q shadow-[inset_0_0_0_3px_#0E1116]'
                        : isSelected
                        ? 'border-accent bg-accent shadow-[inset_0_0_0_3px_#0E1116]'
                        : 'border-muted'
                    }`}
                />
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="font-bold text-sm text-ink-soft mx-6 mb-3">감상문 첨삭 (AI)</div>
      <div className="mx-4 mb-4">
        <div className="bg-surface border border-line rounded-2xl p-[18px] mb-5">
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3 flex justify-between items-center">
            <span>내가 쓴 감상문</span>
            <span className="font-korean text-ink-soft normal-case tracking-normal font-medium">
              {defaultEssay.length}자
            </span>
          </div>
          <textarea
            className="w-full min-h-[160px] bg-transparent border-none resize-y text-ink text-[13.5px] leading-[1.75] font-korean"
            value={defaultEssay}
            onChange={(e) => setUserEssay(e.target.value)}
            placeholder="감상문을 입력하세요..."
          />
        </div>

        {(feedbackLoading || aiFeedback) && (
          <div
            className="bg-gradient-to-br from-[rgba(232,181,71,0.06)] to-[rgba(255,87,34,0.04)] border rounded-2xl p-[18px] mb-5"
            style={{ borderColor: 'rgba(232,181,71,0.3)' }}
          >
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-3 flex justify-between items-center">
              <span>★ AI 첨삭 제안</span>
              <span className="font-korean text-gold normal-case tracking-normal font-medium">
                {aiFeedback ? `+${Math.max(0, aiFeedback.replace(/【|】/g, '').length - defaultEssay.length)}자 강화` : '생성 중...'}
              </span>
            </div>
            {feedbackLoading ? (
              <div className="flex items-center gap-2 font-mono text-[11px] text-accent py-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-dot-pulse" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-dot-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-dot-pulse" style={{ animationDelay: '0.4s' }} />
                <span className="text-[10px] tracking-wide">AI 첨삭 중...</span>
              </div>
            ) : (
              <div className="text-[13.5px] leading-[1.75] text-ink">{renderHighlight(aiFeedback || '')}</div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setUserEssay('')} className="btn">초기화</button>
          <button onClick={handleGetFeedback} disabled={feedbackLoading} className="btn btn-primary">
            AI 첨삭 받기
          </button>
        </div>
      </div>
    </div>
  );
}

function generateFallbackFeedback(bookName: string, track: string): string {
  return `${bookName}을 읽으며 가장 인상 깊었던 것은 【핵심 개념의 새로운 해석】을 통해 일상의 현상을 다시 보게 된 경험이었다. 그동안 ${
    track === '경상' ? '인간 행동을 합리성 가정 아래에서만' : '주어진 사실을 단편적으로만'
  } 이해해 온 사고방식에 대해 【새로운 분석 틀】을 제공받은 셈이다. 다만 저자의 논의가 ${
    track === '경상' ? '실제 정책 적용에서 한계는 없는지' : '단일 관점으로 환원될 위험은 없는지'
  } 비판적으로 검토할 필요도 느꼈다. 이 책은 ${track} 연구에서 【학제간 융합적 사고】의 중요성을 다시금 일깨워주었다.`;
}
