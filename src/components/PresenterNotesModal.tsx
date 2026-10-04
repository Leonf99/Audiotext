import { useState, useEffect } from 'react';
import { SlideData } from '../types';
import { SLIDES } from '../data/slidesData';
import { X, Play, Pause, RotateCcw, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

interface PresenterNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: SlideData;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function PresenterNotesModal({
  isOpen,
  onClose,
  currentSlide,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: PresenterNotesModalProps) {
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!isOpen) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSlide = SLIDES.find((s) => s.id === currentSlide.id + 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                MODO APRESENTADOR
              </span>
              <span className="text-sm font-bold text-slate-100">
                Slide {currentSlide.id} de {SLIDES.length}
              </span>
            </div>

            {/* Stopwatch / Presentation Timer */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-sm font-semibold text-slate-100">{formatTimer(seconds)}</span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-1 hover:text-sky-400 transition-colors"
                title={timerRunning ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
              >
                {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  setSeconds(0);
                  setTimerRunning(false);
                }}
                className="p-1 hover:text-rose-400 transition-colors"
                title="Zerar Cronômetro"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'}`}
              >
                A+
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Speaker Script */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                Roteiro Falado Oficial (Script)
              </div>
              <p
                className={`text-slate-100 leading-relaxed font-sans ${
                  fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                }`}
              >
                "{currentSlide.speakerScript}"
              </p>
            </div>

            {/* Key talking points */}
            {currentSlide.keyPoints && (
              <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 mb-2 font-bold">
                  Pontos-Chave para Enfatizar na Fala:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentSlide.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-400 font-mono">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right sidebar: Current Slide Info & Next Slide Preview */}
          <div className="space-y-4">
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Slide Atual:</span>
              <h4 className="text-sm font-bold text-slate-100 mt-1">{currentSlide.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{currentSlide.subtitle}</p>
            </div>

            {nextSlide ? (
              <div className="bg-slate-950/50 rounded-xl border border-slate-800/80 p-4 opacity-80">
                <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                  <span>Próximo Slide ({nextSlide.id}):</span>
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                </span>
                <h5 className="text-xs font-semibold text-slate-200 mt-1">{nextSlide.title}</h5>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">"{nextSlide.speakerScript}"</p>
              </div>
            ) : (
              <div className="bg-slate-950/40 rounded-xl border border-slate-800/40 p-4 text-xs text-slate-500 font-mono">
                Último slide da apresentação.
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Slide Anterior</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Use as setas do teclado (← / →) para avançar
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Próximo Slide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
