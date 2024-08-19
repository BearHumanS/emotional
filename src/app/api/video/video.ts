import axios from 'axios';

export const fetchYoutubeVideos = async (keyword: string) => {
  try {
    const res = await axios.get(
      `/api/video?maxResults=5&q=${encodeURIComponent(keyword + ' 노래 playlist')}`,
    );
    return res.data.data.items;
  } catch (error) {
    console.error(error);
    throw new Error('플레이리스트 불러오기 실패');
  }
};
