import { GetYoutubeListRequestParams } from '@/features/main/api/getYoutubeList';
import { youtubeServerInstance } from '@/shared/api/youtube/server/instance';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const queryParams = parseQueryParams(request.nextUrl.searchParams);

    const { data } = await youtubeServerInstance.search.list({
      part: ['snippet'],
      regionCode: 'KR',
      ...queryParams,
    });

    return Response.json({
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

const parseQueryParams = (
  params: URLSearchParams,
): GetYoutubeListRequestParams => {
  return {
    maxResults: Number(params.get('maxResults') ?? 5),
    q: params.get('q') ?? 'music',
  };
};
