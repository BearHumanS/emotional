'use client';

import { useState } from 'react';
import SttComponent from './SttComponent';
import PromptComponent from './PromptComponent';
import SearcResultComponent from './SearcResultComponent';
import WithAuth from '@/lib/util/WithAuth';

export interface Video {
  title: string;
  videoUrl: string;
}

function MainComponent() {
  const [diaryEntry, setDiaryEntry] = useState<string>('');
  const [videoRecommendation, setVideoRecommendation] = useState<Video | null>(
    null,
  );
  const [keyword, setKeyword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState<boolean>(false);

  const text = 'Emotional';

  return (
    <div className="flex flex-col min-h-screen-minus-40 w-[400px] items-center justify-center gap-4 p-4 lg:p-8">
      <div className="grid gap-4 text-center">
        <a href="https://www.emotional.today/">
          <h1 className="text-5xl leading-[3vw] font-extrabold">
            {text.split('').map((char, index) => (
              <span
                key={index}
                className="char"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </h1>
        </a>
        <p className="text-xs text-gray-500 dark:text-gray-400 text">
          자신의 감정을 표현하면 그에 맞는 추천 노래 Playlist를 알려드려요.
        </p>
      </div>

      <div className="grid gap-2 w-full">
        <SttComponent
          setDiaryEntry={setDiaryEntry}
          setListening={setListening}
          listening={listening}
          setError={setError}
        />

        <PromptComponent
          diaryEntry={diaryEntry}
          setDiaryEntry={setDiaryEntry}
          setVideoRecommendation={setVideoRecommendation}
          setKeyword={setKeyword}
          setError={setError}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          listening={listening}
        />

        {error && <p className="text-red-500 w-80">{error}</p>}

        <SearcResultComponent
          videoRecommendation={videoRecommendation}
          keyword={keyword}
        />
      </div>
    </div>
  );
}

export default WithAuth(MainComponent);
