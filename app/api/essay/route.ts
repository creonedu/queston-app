import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Profile } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface EssayRequest {
  profile: Profile;
  bookName: string;
  essay: string;
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

    const { profile, bookName, essay }: EssayRequest = await req.json();

    if (essay.length < 50) {
      return Response.json({ error: '50자 이상 입력해주세요.' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    const prompt = `당신은 한국 고등학교 입시 전문가이자 글쓰기 코치입니다.

학생 프로파일: ${profile.grade} ${profile.school}, 희망 계열 ${profile.tracks.join(', ')}, 희망 학과 ${profile.major || '미정'}

학생이 "${bookName}"을 읽고 작성한 감상문:
"""
${essay}
"""

이 감상문을 다음 기준으로 첨삭하여 더 우수한 버전을 작성해주세요:
1. 분량: 원본 ±20자 내외
2. 핵심 키워드 3~4개를 【키워드】 형식으로 강조
3. ${profile.tracks[0]} 계열 진로와 연결되는 통찰 추가
4. 비판적·분석적 사고가 드러나도록 보강
5. 자연스러운 한국어 문장으로 작성

첨삭본만 출력하세요. 설명이나 부연 설명 금지.`;

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('\n');

    return Response.json({ feedback: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Essay API error:', err);
    return Response.json({ error: message }, { status: 500 });
  }
}
