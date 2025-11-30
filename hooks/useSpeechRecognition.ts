import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSpeechRecognition } from '../types';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ja-JP';

      recognition.onresult = (event) => {
        let final = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        if (final) {
          setTranscript((prev) => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        setError('音声認識エラーが発生しました。');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } else {
      setError('このブラウザは音声認識をサポートしていません。');
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Clear interim but keep transcript? Or clear both? 
      // Usually users want to continue adding to the note, but let's handle clearing outside if needed.
      setError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Allow manual update of transcript (e.g. typing)
  const setManualTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    toggleListening,
    resetTranscript,
    setManualTranscript,
  };
};