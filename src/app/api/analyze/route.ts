import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const prompt = searchParams.get('prompt');

    if (!prompt) {
      return new Response(
        JSON.stringify({ message: '프롬프트를 입력해주세요.' }),
        {
          status: 500,
        },
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `일기: ${prompt}` },

        {
          role: 'system',
          content:
            /* '일기를 분석하여 유튜브에 음악을 검색할건데 가장 주요한 단어 하나만 추출해주세요. ', */
            'prompt에 적힌 글을 분석하여 유튜브에서 playlist를 검색을 하려고하니깐 prompt를 상세하게 분석해서 검색이 될만한 하나의 키워드를 알려줘, 다만 아무 의미 없는 글이면 사족을 붙이지말고 아무 단어로 알려줘',
        },
      ],
      max_tokens: 180,
      temperature: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    });

    const keyword = completion.choices[0].message.content;

    return new Response(JSON.stringify({ keyword }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
