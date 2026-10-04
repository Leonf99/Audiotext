import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechNarrationOptions {
  onSlideEnd?: () => void;
  autoAdvance?: boolean;
}

export function useSpeechNarration(text: string, options: UseSpeechNarrationOptions = {}) {
  const { onSlideEnd, autoAdvance = false } = options;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentWordCharIndex, setCurrentWordCharIndex] = useState<number>(-1);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        setVoices(allVoices);
        // Find best pt-BR or pt voice
        const ptBr =
          allVoices.find((v) => v.lang === 'pt-BR' && v.name.includes('Google')) ||
          allVoices.find((v) => v.lang === 'pt-BR') ||
          allVoices.find((v) => v.lang.startsWith('pt')) ||
          allVoices[0];
        setSelectedVoice(ptBr || null);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Stop when text changes if playing
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordCharIndex(-1);
  }, []);

  const play = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (!text || text.trim().length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = selectedVoice?.lang || 'pt-BR';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordCharIndex(-1);
      if (autoAdvance && onSlideEnd) {
        onSlideEnd();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech synthesis notice:', e.error);
      }
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordCharIndex(-1);
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoice, rate, autoAdvance, onSlideEnd]);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
      }
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
      } else {
        play();
      }
    }
  }, [play]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      play();
    }
  }, [isPlaying, isPaused, pause, resume, play]);

  // Clean up on unmount or slide change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    rate,
    setRate,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentWordCharIndex,
    play,
    pause,
    resume,
    stop,
    toggle,
  };
}
