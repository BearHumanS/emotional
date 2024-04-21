import { GetYoutubeListRequestParams } from '@/features/main/api/getYoutubeList';
import { youtubeServerInstance } from '@/shared/api/youtube/server/instance';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const queryParams = parseQueryParams(request.nextUrl.searchParams);

    const { data } = await youtubeServerInstance.search.list({
      part: ['snippet'],
      regionCode: 'KR',
      relevanceLanguage: 'ko',
      videoDefinition: 'high',
      type: ['video'],
      order: 'rating',
      ...queryParams,
    });

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify({ message: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

const parseQueryParams = (
  params: URLSearchParams,
): GetYoutubeListRequestParams => {
  return {
    maxResults: Number(params.get('maxResults') ?? 20),
    q: params.get('q') ?? 'music',
  };
};
