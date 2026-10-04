import { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  FastForward,
  Settings,
  ChevronRight,
  Headphones,
  Download,
} from 'lucide-react';
import { SlideData } from '../types';

interface AudioNarrationBarProps {
  currentSlide: SlideData;
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  onTogglePlay: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  onOpenTranscription: () => void;
  onOpenExportAudio: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  currentCharIndex: number;
}

export default function AudioNarrationBar({
  currentSlide,
  isPlaying,
  isPaused,
  rate,
  onTogglePlay,
  onStop,
  onRateChange,
  autoAdvance,
  onToggleAutoAdvance,
  onOpenTranscription,
  onOpenExportAudio,
  voices,
  selectedVoice,
  onSelectVoice,
  currentCharIndex,
}: AudioNarrationBarProps) {
  const [showSettings, setShowSettings] = useState(false);

  // Filter pt-BR / pt voices first
  const ptVoices = voices.filter((v) => v.lang.startsWith('pt'));
  const availableVoices = ptVoices.length > 0 ? ptVoices : voices.slice(0, 8);

  const rates = [0.8, 1.0, 1.25, 1.5, 1.75];

  // Helper snippet preview of text around current char index
  const scriptText = currentSlide.speakerScript;
  const snippet = scriptText.length > 110 ? scriptText.slice(0, 110) + '...' : scriptText;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      {/* Left side: Playback Controls & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
              : 'bg-sky-600/80 hover:bg-sky-500 text-white'
          }`}
          title={isPlaying ? 'Pausar Áudio' : 'Ouvir Narração do Slide'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <button
          onClick={onStop}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          title="Reiniciar Narração"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-sky-400" />
              <span>Narração de Áudio</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {isPlaying ? 'Reproduzindo voz' : isPaused ? 'Pausado' : 'Pronto para tocar'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 max-w-xs md:max-w-md truncate" title={scriptText}>
            {snippet}
          </div>
        </div>
      </div>

      {/* Right side: Speed, Auto-advance, Transcription & Export button */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        {/* Speed Selector */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          {rates.map((r) => (
            <button
              key={r}
              onClick={() => onRateChange(r)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                rate === r ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>

        {/* Auto advance toggle */}
        <button
          onClick={onToggleAutoAdvance}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
            autoAdvance
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Avançar para o próximo slide ao terminar o áudio"
        >
          <FastForward className="w-3 h-3" />
          <span className="hidden md:inline">Auto-avançar</span>
        </button>

        {/* Transcription drawer button */}
        <button
          onClick={onOpenTranscription}
          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer"
          title="Abrir transcrição de áudio e teleprompter"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Roteiro</span>
        </button>

        {/* Export MP3 Button */}
        <button
          onClick={onOpenExportAudio}
          className="px-3 py-1.5 rounded-lg bg-sky-950/70 border border-sky-500/50 hover:bg-sky-900/60 text-sky-200 flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer shadow-sm shadow-sky-500/10"
          title="Exportar a narração como arquivo de áudio .mp3"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Exportar MP3</span>
        </button>

        {/* Voice settings popover toggle */}
        {availableVoices.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Configurar Voz da Narração"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 border border-slate-800 rounded-lg p-2.5 shadow-2xl z-50">
                <div className="text-[11px] font-bold text-slate-300 mb-2 font-mono uppercase tracking-wider">
                  Voz do Sistema (PT)
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {availableVoices.map((voice) => (
                    <button
                      key={voice.name}
                      onClick={() => {
                        onSelectVoice(voice);
                        setShowSettings(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-[11px] truncate flex items-center justify-between cursor-pointer ${
                        selectedVoice?.name === voice.name
                          ? 'bg-sky-500/20 text-sky-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{voice.name}</span>
                      <span className="text-[9px] font-mono text-slate-500 ml-1 shrink-0">{voice.lang}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

