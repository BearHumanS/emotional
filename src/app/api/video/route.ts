import { GetYoutubeListRequestParams } from '@/features/main/api/getYoutubeList';
import {
  youtubeServerInstance,
  youtubeServerInstance2,
} from '@/shared/api/youtube/server/instance';
import { AxiosError } from 'axios';
import { NextRequest } from 'next/server';

const parseQueryParams = (
  params: URLSearchParams,
): GetYoutubeListRequestParams => {
  return {
    maxResults: Number(params.get('maxResults') ?? 5),
    q: params.get('q') ?? 'music',
  };
};

export const GET = async (req: NextRequest) => {
  const queryParams = parseQueryParams(req.nextUrl.searchParams);

  try {
    const { data } = await youtubeServerInstance.search.list({
      part: ['snippet'],
      regionCode: 'KR',
      relevanceLanguage: 'ko',
      videoDefinition: 'high',
      type: ['video'],
      order: 'viewCount',
      ...queryParams,
    });

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.status === 403) {
      return retryWithSecondaryInstance(error, req);
    }

    return new Response(JSON.stringify({ message: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

const retryWithSecondaryInstance = async (
  error: AxiosError,
  req: NextRequest,
) => {
  const queryParams = parseQueryParams(req.nextUrl.searchParams);

  if (
    error.response &&
    (error.response.status === 500 || error.response.status === 403)
  ) {
    try {
      const { data } = await youtubeServerInstance2.search.list({
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
    } catch (errorRe) {
      console.log('Secondary instance error:', errorRe);

      return new Response(
        JSON.stringify({
          message: errorRe,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  return new Response(JSON.stringify({ message: 'An error occurred' }), {
    status: error.response?.status || 500,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const dynamic = 'force-dynamic';
