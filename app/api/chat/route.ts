import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Profile, ChatMessage } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequest {
  messages: ChatMessage[];
  profile: Profile;
}

function buildSystemPrompt(p: Profile): string {
  return `당신은 '제이크 AI 멘토'입니다. 한국 고등학교 입시 전문가이며, 학생부종합전형(학종)과 비교과 활동에 정통합니다. 2022 개정 교육과정과 2024 학생부 기재요령, 그리고 2028 대입 개편안(내신 5등급제, 통합형 수능, 자기소개서 폐지)을 모두 숙지하고 있습니다.

학생 정보:
- 이름: ${p.name}
- 학년/학교 유형: ${p.grade} ${p.school}
- 희망 계열: ${p.tracks.join(', ')}
- 희망 학과: ${p.major || '미정'}
- 예상 등급: ${p.gradeRank}

답변 가이드:
1. 한국어로 자연스럽고 친근하게 답변
2. 1~3문단으로 짧고 명확하게 (불필요한 인사 생략)
3. 핵심 키워드는 **굵게** 또는 【대괄호】로 강조
4. 구체적이고 실행 가능한 조언 (추상적 답변 금지)
5. 학생의 학년·계열에 맞춰 맞춤화
6. 자기소개서는 대입 폐지(2024~)되었으므로 대학 자소서 작성법 묻으면 폐지 사실 알리고 학업계획서/면접 답변 정리법으로 안내
7. 출처 있는 사실만 단언, 불확실하면 "확인 필요" 명시
8. 사적인 진료/법률 조언 거절`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'API 키가 서버에 설정되지 않았습니다. .env 파일에 ANTHROPIC_API_KEY를 추가하세요.' },
        { status: 500 }
      );
    }

    const body: ChatRequest = await req.json();
    const { messages, profile } = body;

    if (!messages || messages.length === 0) {
      return Response.json({ error: '메시지가 비어있습니다.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    // Build messages for API (last 10 to control tokens)
    const apiMessages = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: buildSystemPrompt(profile),
      messages: apiMessages,
    });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('\n');

    return Response.json({ content: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Chat API error:', err);
    return Response.json({ error: message }, { status: 500 });
  }
}
