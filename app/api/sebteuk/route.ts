import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Profile, Topic } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SebteukRequest {
  profile: Profile;
  topic: Topic;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'API 키가 서버에 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const { profile, topic }: SebteukRequest = await req.json();
    const client = new Anthropic({ apiKey });

    const userPrompt = `당신은 2022 개정 교육과정과 2024 학생부 기재요령을 준수하는 한국 고등학교 입시 전문가입니다.

학생 정보:
- 이름: ${profile.name}
- 학년/학교: ${profile.grade} ${profile.school}
- 희망 계열: ${profile.tracks.join(', ')}
- 희망 학과: ${profile.major || '미정'}
- 예상 등급: ${profile.gradeRank}

탐구 주제: ${topic.title}
교과: ${topic.sub}
주제 설명: ${topic.desc}

이 학생의 ${topic.sub} 교과 세부능력 및 특기사항(세특) 초안을 작성해주세요. 다음 조건을 반드시 지켜주세요:

1. 분량: 정확히 450~500자 (한국어 기준)
2. 학생부 기재요령 준수: 객관적 사실 기반, 교사가 관찰한 시점으로 서술
3. 학생을 3인칭으로 지칭 (이름 사용 금지)
4. 핵심 개념 4~5개를 【핵심개념】 형식으로 강조 (대괄호 안에 표시)
5. 다음 흐름으로 작성: ① 학습 동기 → ② 탐구 과정 → ③ 결과/발표 → ④ 후속 활동 의지
6. ${topic.fit > 90 ? '학과 적합성을 강하게' : '교과 학습과 진로의 연계를'} 드러낼 것

세특 초안만 출력하세요. 부연 설명 금지.`;

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('\n');

    return Response.json({ draft: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Sebteuk API error:', err);
    return Response.json({ error: message }, { status: 500 });
  }
}
