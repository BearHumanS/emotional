import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react';
import UseAnimations from 'react-useanimations';
import activity from 'react-useanimations/lib/activity';
import { toast } from 'react-toastify';
import { usePlaylistQuery } from '@/hooks/queries/usePlaylistQuery';
import { useAnalyzeDiary } from '@/hooks/queries/useAnalyzeDiary';

interface Video {
  title: string;
  videoUrl: string;
}

interface PromptComponentProps {
  diaryEntry: string;
  setDiaryEntry: Dispatch<SetStateAction<string>>;
  setVideoRecommendation: Dispatch<SetStateAction<Video | null>>;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  listening: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

export default function PromptComponent({
  diaryEntry,
  setDiaryEntry,
  setVideoRecommendation,
  keyword,
  setKeyword,
  listening,
  setIsPlaying,
}: PromptComponentProps) {
  const { mutate: analyzeDiaryMutate, isPending: isAnalyzing } =
    useAnalyzeDiary();

  const {
    data,
    error,
    isError,
    isLoading: isQueryLoading,
  } = usePlaylistQuery(keyword);

  useEffect(() => {
    if (data) {
      const randomVideo = data;
      setVideoRecommendation({
        title: randomVideo.snippet.title,
        videoUrl: `https://www.youtube.com/watch?v=${randomVideo.id.videoId}`,
      });

      toast.success('playlist 추천이 완료되었습니다!');
    } else if (isError) {
      console.error('Error fetching data:', error);
      toast.error('추천 PLAYLIST를 찾을 수 없습니다. 다시 시도해주세요.');
    }
  }, [data, isError, error, setVideoRecommendation]);

  const handleDiaryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDiaryEntry(event.target.value);
  };

  const handleAnalyzeClick = () => {
    if (!diaryEntry.trim()) {
      toast.error('일기 내용을 입력해주세요.');
      return;
    }

    // 분석 버튼을 누르면 재생 상태를 false로 설정 (기존 재생 중단)
    setIsPlaying(false);

    analyzeDiaryMutate(diaryEntry, {
      onSuccess: (result) => {
        setKeyword(result);
      },
    });
  };

  return (
    <div className="grid gap-2">
      <textarea
        className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px] shadow-none"
        id="diary"
        placeholder="여기에 당신의 하루를 입력해주세요."
        value={diaryEntry}
        onChange={handleDiaryChange}
        disabled={isAnalyzing || listening || isQueryLoading}
      ></textarea>
      <div className="grid gap-2">
        <button
          className={`inline-flex bg-slate-700 text-white font-semibold items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full ${
            isAnalyzing || isQueryLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing || listening || isQueryLoading}
        >
          {isAnalyzing || isQueryLoading ? (
            <div className="flex items-center justify-center opacity-100">
              <UseAnimations animation={activity} size={28} strokeColor="red" />
            </div>
          ) : (
            '분석'
          )}
        </button>
      </div>
    </div>
  );
}
