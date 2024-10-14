import { fetchData } from '../fetchData';

export const fetchYoutubeVideos = async (keyword: string) => {
  try {
    const res = await fetchData(
      `/youtubeSearch?maxResults=20&q=${encodeURIComponent(keyword + ' 노래 playlist')}`,
      'get',
    );

    const items = res?.data?.items;

    if (!items || items.length === 0) {
      throw new Error('비디오 데이터를 찾을 수 없습니다.');
    }

    const randomVideo = items[Math.floor(Math.random() * items.length)];

    return randomVideo;
  } catch (error) {
    console.error(error);
    throw new Error('플레이리스트 불러오기 실패');
  }
};
