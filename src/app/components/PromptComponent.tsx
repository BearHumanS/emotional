import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { analyzeDiary } from '../api/analyze/analyze';
import { fetchYoutubeVideos } from '../api/video/video';

interface Video {
  title: string;
  videoUrl: string;
}

interface PromptComponentProps {
  diaryEntry: string;
  setDiaryEntry: Dispatch<SetStateAction<string>>;
  setVideoRecommendation: Dispatch<SetStateAction<Video | null>>;
  setKeyword: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  listening: boolean;
}

export default function PromptComponent({
  diaryEntry,
  setDiaryEntry,
  setVideoRecommendation,
  setKeyword,
  setError,
  setIsLoading,
  isLoading,
  listening,
}: PromptComponentProps) {
  const analyzeDiaryAndFetchVideos = async (retryCount = 0) => {
    if (!diaryEntry.trim()) {
      setError('일기 내용을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const keyword = await analyzeDiary(diaryEntry);
      setKeyword(keyword);

      const videos = await fetchYoutubeVideos(keyword);
      if (videos.length > 0) {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        setVideoRecommendation({
          title: randomVideo.snippet.title,
          videoUrl: `https://www.youtube.com/watch?v=${randomVideo.id.videoId}`,
        });
      } else if (retryCount < 5) {
        setError('추천 PLAYLIST를 찾을 수 없습니다. 다시 분석을 시도합니다.');
        analyzeDiaryAndFetchVideos(retryCount + 1);
      } else {
        setError('추천 PLAYLIST를 찾을 수 없습니다. 다시 입력해주세요.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('페이지의 총 하루 할당량이 초과되었습니다.');
    }
    setIsLoading(false);
  };

  const handleDiaryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDiaryEntry(event.target.value);
  };

  return (
    <div className="grid gap-2">
      <textarea
        className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px] shadow-none"
        id="diary"
        placeholder="여기에 당신의 하루를 입력해주세요."
        value={diaryEntry}
        onChange={handleDiaryChange}
        disabled={isLoading || listening}
      ></textarea>
      <div className="grid gap-2">
        <button
          className={`inline-flex bg-slate-700 text-white font-semibold items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => analyzeDiaryAndFetchVideos(0)}
          disabled={isLoading || listening}
        >
          {isLoading ? '분석 중...' : '분석'}
        </button>
      </div>
    </div>
  );
}
