import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Video } from './MainComponent';

interface SttComponentProps {
  setDiaryEntry: Dispatch<SetStateAction<string>>;
  setListening: Dispatch<SetStateAction<boolean>>;
  listening: boolean;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function SttComponent({
  setDiaryEntry,
  setListening,
  listening,
  setError,
}: SttComponentProps) {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            setDiaryEntry((prev) => prev + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError('음성 인식 중 오류가 발생했습니다. 다시 시도해주세요.');
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      setRecognition(recognition);
    } else {
      console.error('Web Speech API is not supported in this browser.');
      setError('이 브라우저에서는 음성 인식을 지원하지 않습니다.');
    }
  }, [setDiaryEntry, setError, setListening]);

  const startListening = () => {
    if (recognition) {
      setDiaryEntry('');
      recognition.start();
      setListening(true);
      setError(null);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <label
          className="font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
          htmlFor="diary"
        >
          오늘 하루는 어땠나요?
        </label>
        <button
          className={`inline-flex bg-slate-700 text-white font-semibold items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-[50px] rounded-full px-4  ${
            listening ? 'pulse-animation' : ''
          }`}
          onClick={listening ? stopListening : startListening}
        >
          {listening ? '🔊' : '🎙️'}
        </button>
      </div>
    </>
  );
}
