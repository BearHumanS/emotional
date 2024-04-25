'use client';

import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface Video {
  title: string;
  videoUrl: string;
}

export default function Component() {
  const [diaryEntry, setDiaryEntry] = useState<string>('');
  const [videoRecommendation, setVideoRecommendation] = useState<Video | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiaryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDiaryEntry(event.target.value);
  };

  const analyzeDiary = async (retryCount = 0) => {
    if (!diaryEntry.trim()) {
      setError('일기 내용을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `/api/analyze?prompt=${encodeURIComponent(diaryEntry)}`,
      );

      const keyword = response.data.keyword;
      setKeyword(keyword);

      const youtubeResponse = await axios.get(
        `/api/video?maxResults=5&q=${encodeURIComponent(keyword + ' 노래 playlist')}`,
      );

      const videos = youtubeResponse.data.data.items;

      if (videos.length > 0) {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        setVideoRecommendation({
          title: randomVideo.snippet.title,
          videoUrl: `https://www.youtube.com/watch?v=${randomVideo.id.videoId}`,
        });
      } else if (retryCount < 5) {
        console.log('검색된 비디오가 없습니다. 다시 분석을 시도합니다.');
        analyzeDiary(retryCount + 1);
      } else {
        console.log('최대 재시도 횟수를 초과했습니다.');
        setError('추천 비디오를 찾을 수 없습니다. 다시 입력해주세요.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('페이지의 총 하루 할당량이 초과되었습니다.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center gap-4 p-4 lg:p-8">
      <div className="grid gap-4 text-center">
        <a href="https://www.emotional.today/">
          <h1 className="text-3xl font-bold">
            이모셔널: 감정과 음악을 연결하는 추천 플레이리스트
          </h1>
        </a>
        <p className="text-xs text-gray-500 dark:text-gray-400 text">
          자신의 감정을 표현하면 그에 맞는 추천 노래 Playlist를 알려드려요.
        </p>
      </div>
      <div className="w-full grid gap-2">
        <div className="grid gap-2">
          <label
            className="font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
            htmlFor="diary"
          >
            오늘 하루는 어땠나요?
          </label>
          <textarea
            className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px] shadow-none"
            id="diary"
            placeholder="여기에 당신의 하루를 입력해주세요."
            value={diaryEntry}
            onChange={handleDiaryChange}
          ></textarea>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid gap-2">
          <button
            className={`inline-flex bg-slate-700 text-white font-semibold items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => analyzeDiary(0)}
            disabled={isLoading}
          >
            {isLoading ? '분석 중...' : '분석'}
          </button>
        </div>
        <div className="grid gap-1.5">
          <h2 className="text-base font-semibold mb-2">
            추천 Playlist {keyword && ` | 키워드 : ${keyword}`}
          </h2>
          {videoRecommendation && (
            <div>
              <p className="text-sm font-medium mb-2">
                {videoRecommendation.title}
              </p>

              <div className="w-full text-center">
                <a
                  className="font-semibold text-rose-500 hover:border-b hover:border-blue-500"
                  href={videoRecommendation.videoUrl}
                  target="_blank"
                  rel="anchor text"
                >
                  &gt; 클릭하면 유튜브로 이동합니다. &lt;
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
