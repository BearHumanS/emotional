type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
