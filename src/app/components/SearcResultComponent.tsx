import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FaPlayCircle } from '@react-icons/all-files/fa/FaPlayCircle';
import { FaPauseCircle } from '@react-icons/all-files/fa/FaPauseCircle';
import { IoIosVolumeOff } from '@react-icons/all-files/io/IoIosVolumeOff';
import { IoIosVolumeHigh } from '@react-icons/all-files/io/IoIosVolumeHigh';
import { IoIosVolumeLow } from '@react-icons/all-files/io/IoIosVolumeLow';
import { MdReplay } from '@react-icons/all-files/md/MdReplay';

interface Video {
  title: string;
  videoUrl: string;
}

interface SearcResultComponentProps {
  videoRecommendation: Video | null;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

// YouTube 비디오 URL에서 비디오 ID 추출 함수
const getYouTubeVideoId = (url: string) => {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('v');
};

export default function SearcResultComponent({
  videoRecommendation,
  isPlaying,
  setIsPlaying,
}: SearcResultComponentProps) {
  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [volumeIndicator, setVolumeIndicator] = useState(
    <IoIosVolumeHigh size={24} color="black" />,
  ); // 볼륨 아이콘 상태
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false); // 비디오가 끝났는지 상태 관리
  const playerRef = useRef<YT.Player | null>(null); // YouTube Player 객체를 참조할 ref
  const videoId = videoRecommendation
    ? getYouTubeVideoId(videoRecommendation.videoUrl)
    : null;

  useEffect(() => {
    if (videoId) {
      if (playerRef.current) {
        playerRef.current.destroy(); // 기존 플레이어 제거
      }

      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      } else if (window.YT && window.YT.Player && videoId) {
        createPlayer(videoId);
      }

      (window as any).onYouTubeIframeAPIReady = () => {
        if (videoId) {
          createPlayer(videoId);
        }
      };
    }

    function createPlayer(videoId: string) {
      playerRef.current = new YT.Player('player', {
        videoId: videoId,
        events: {
          onReady: (event: YT.PlayerEvent) => {
            playerRef.current = event.target; // YouTube Player 객체 참조
            playerRef.current?.setVolume(volume); // 초기 볼륨 설정
            setIsPlayerReady(true);
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === YT.PlayerState.ENDED) {
              setIsVideoEnded(true); // 비디오가 끝났을 때 상태 업데이트
              setIsPlaying(false); // 재생 상태 해제
            }
          },
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handlePlayPause = () => {
    if (isPlayerReady && playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        if (isVideoEnded) {
          playerRef.current.seekTo(0, true); // 비디오를 처음으로 돌림, allowSeekAhead를 true로 설정
          setIsVideoEnded(false); // 다시 시작하기 상태 해제
        }
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setPreviousVolume(volume);
    setVolume(newVolume);

    if (
      isPlayerReady &&
      playerRef.current &&
      typeof playerRef.current.setVolume === 'function'
    ) {
      playerRef.current.setVolume(newVolume);
    }

    if (newVolume === 0) {
      setVolumeIndicator(<IoIosVolumeOff size={24} color="black" />);
    } else if (newVolume > previousVolume) {
      setVolumeIndicator(<IoIosVolumeHigh size={24} color="green" />);
    } else if (newVolume < previousVolume) {
      setVolumeIndicator(<IoIosVolumeLow size={24} color="red" />);
    }

    setTimeout(() => {
      if (newVolume === 0) {
        setVolumeIndicator(<IoIosVolumeOff size={24} color="grey" />);
      } else {
        setVolumeIndicator(<IoIosVolumeHigh size={24} color="grey" />);
      }
    }, 1000);
  };

  return (
    <div className="grid gap-1.5 text-center min-h-[210px]">
      <h2 className="text-base font-semibold mb-2">추천 Playlist</h2>
      {videoRecommendation && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium mb-2">
            {videoRecommendation.title}
          </span>

          <div id="player" className="invisible w-0 h-0"></div>

          <button
            className="duration-300 transition-all transform hover:scale-110"
            onClick={handlePlayPause}
          >
            {isVideoEnded ? (
              <MdReplay
                size={56}
                color="black"
                className="transition-colors duration-300"
              />
            ) : isPlaying ? (
              <FaPauseCircle
                size={56}
                color="red"
                className="transition-colors duration-300"
              />
            ) : (
              <FaPlayCircle
                size={56}
                color="black"
                className="transition-colors duration-300"
              />
            )}
          </button>

          <div className="mt-4 flex justify-center items-center gap-1">
            <label htmlFor="volume">{volumeIndicator}</label>
            <input
              id="volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="ml-2"
            />
            <span className="text-sm text-gray-500 w-8">{volume}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
