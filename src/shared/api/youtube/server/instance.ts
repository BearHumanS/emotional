import { GoogleApis } from 'googleapis';

const initYoutubeApiInstance = () => {
  const auth = process.env.NEXT_PUBLIC_MUSIC_API;

  return new GoogleApis({
    auth,
  }).youtube('v3');
};

export const youtubeServerInstance = initYoutubeApiInstance();

const initYoutubeApiInstance2 = () => {
  const auth = process.env.NEXT_PUBLIC_MUSIC_API2;

  return new GoogleApis({
    auth,
  }).youtube('v3');
};

export const youtubeServerInstance2 = initYoutubeApiInstance2();
