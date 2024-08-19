interface Video {
  title: string;
  videoUrl: string;
}

interface SearcResultComponentProps {
  videoRecommendation: Video | null;
  keyword: string | null;
}

export default function SearcResultComponent({
  videoRecommendation,
  keyword,
}: SearcResultComponentProps) {
  return (
    <div className="grid gap-1.5 text-center">
      <h2 className="text-base font-semibold mb-2">
        추천 Playlist {keyword && ` | 키워드 : ${keyword}`}
      </h2>
      {videoRecommendation && (
        <div>
          <span className="text-sm font-medium mb-2">
            {videoRecommendation.title}
          </span>

          <div className="w-full text-center">
            <a
              className="font-semibold text-rose-500 hover:border-b hover:border-blue-500"
              href={videoRecommendation.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              &gt; 클릭하면 유튜브로 이동합니다. &lt;
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
