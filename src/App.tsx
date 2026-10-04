/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { SLIDES } from './data/slidesData';
import { useSpeechNarration } from './hooks/useSpeechNarration';
import Header from './components/Header';
import SlideViewer from './components/SlideViewer';
import AudioNarrationBar from './components/AudioNarrationBar';
import TranscriptionModal from './components/TranscriptionModal';
import PresenterNotesModal from './components/PresenterNotesModal';
import SlideOverviewModal from './components/SlideOverviewModal';
import ExportAudioModal from './components/ExportAudioModal';

export default function App() {
  const [currentSlideId, setCurrentSlideId] = useState<number>(1);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [isTranscriptionOpen, setIsTranscriptionOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isExportAudioOpen, setIsExportAudioOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const currentSlide = SLIDES.find((s) => s.id === currentSlideId) || SLIDES[0];

  const handleNext = useCallback(() => {
    setCurrentSlideId((prev) => Math.min(prev + 1, SLIDES.length));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlideId((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleJumpToSlide = useCallback((id: number) => {
    if (id >= 1 && id <= SLIDES.length) {
      setCurrentSlideId(id);
    }
  }, []);

  // Hook for speech narration
  const {
    isPlaying,
    isPaused,
    rate,
    setRate,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentWordCharIndex,
    play,
    stop,
    toggle: toggleSpeech,
  } = useSpeechNarration(currentSlide.speakerScript, {
    autoAdvance,
    onSlideEnd: () => {
      if (currentSlideId < SLIDES.length) {
        handleNext();
      }
    },
  });

  // When slide changes, if autoAdvance is on and was playing, speak the new slide
  useEffect(() => {
    if (autoAdvance && isPlaying) {
      play();
    }
  }, [currentSlideId, autoAdvance]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' && !e.repeat) {
        e.preventDefault();
        toggleSpeech();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsTranscriptionOpen((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsExportAudioOpen((prev) => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsNotesOpen((prev) => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setIsOverviewOpen((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setIsTranscriptionOpen(false);
        setIsNotesOpen(false);
        setIsOverviewOpen(false);
        setIsExportAudioOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, toggleSpeech]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Strict Top Bar Contract */}
      <Header
        onJumpToSlide={handleJumpToSlide}
        onOpenTranscription={() => setIsTranscriptionOpen(true)}
        onOpenOverview={() => setIsOverviewOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Slide Presentation Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        <SlideViewer
          currentSlide={currentSlide}
          onPrev={handlePrev}
          onNext={handleNext}
          onJumpToSlide={handleJumpToSlide}
          onOpenNotes={() => setIsNotesOpen(true)}
          onOpenTranscription={() => setIsTranscriptionOpen(true)}
          onOpenOverview={() => setIsOverviewOpen(true)}
        />
      </main>

      {/* Sticky Bottom Audio Player Bar */}
      <footer className="sticky bottom-0 z-30 px-3 sm:px-6 pb-3 pt-1 pointer-events-auto">
        <div className="max-w-7xl mx-auto">
          <AudioNarrationBar
            currentSlide={currentSlide}
            isPlaying={isPlaying}
            isPaused={isPaused}
            rate={rate}
            onTogglePlay={toggleSpeech}
            onStop={stop}
            onRateChange={setRate}
            autoAdvance={autoAdvance}
            onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
            onOpenTranscription={() => setIsTranscriptionOpen(true)}
            onOpenExportAudio={() => setIsExportAudioOpen(true)}
            voices={voices}
            selectedVoice={selectedVoice}
            onSelectVoice={setSelectedVoice}
            currentCharIndex={currentWordCharIndex}
          />
        </div>
      </footer>

      {/* Complete Audio Transcription & Teleprompter Modal */}
      <TranscriptionModal
        isOpen={isTranscriptionOpen}
        onClose={() => setIsTranscriptionOpen(false)}
        currentSlide={currentSlide}
        onSelectSlide={(id) => {
          handleJumpToSlide(id);
          setIsTranscriptionOpen(false);
        }}
        isPlaying={isPlaying}
        onTogglePlay={toggleSpeech}
        currentCharIndex={currentWordCharIndex}
        onOpenExportAudio={() => setIsExportAudioOpen(true)}
      />

      {/* Export Audio MP3 Modal */}
      <ExportAudioModal
        isOpen={isExportAudioOpen}
        onClose={() => setIsExportAudioOpen(false)}
        currentSlide={currentSlide}
      />

      {/* Presenter Notes / Speaker Rehearsal View */}
      <PresenterNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        currentSlide={currentSlide}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentSlideId > 1}
        hasNext={currentSlideId < SLIDES.length}
      />

      {/* 30-Slide Grid Overview Modal */}
      <SlideOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        activeSlideId={currentSlideId}
        onSelectSlide={handleJumpToSlide}
      />
    </div>
  );
}
