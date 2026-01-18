import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

export const useVoiceCommands = (commands = []) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(Boolean(SpeechRecognition));

  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      commands.forEach(({ phrase, action }) => {
        if (transcript.includes(phrase.toLowerCase())) {
          action(transcript);
        }
      });
    };

    recognitionRef.current = recognition;
    setSupported(true);

    return () => recognition.stop();
  }, [commands]);

  const start = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return useMemo(() => ({
    listening,
    supported,
    start,
    stop,
  }), [listening, supported, start, stop]);
};
