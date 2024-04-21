import { youtube_v3 } from 'googleapis';

export type GetYoutubeListRequestParams = Pick<
  youtube_v3.Params$Resource$Search$List,
  'maxResults' | 'q'
>;

export type GetYoutubeListResponse = {};
