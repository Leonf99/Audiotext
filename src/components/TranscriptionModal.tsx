import { useState, useMemo } from 'react';
import { SLIDES } from '../data/slidesData';
import { SlideData } from '../types';
import {
  X,
  Copy,
  Check,
  Download,
  Search,
  Headphones,
  Play,
  Pause,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: SlideData;
  onSelectSlide: (slideId: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentCharIndex: number;
  onOpenExportAudio?: () => void;
}

export default function TranscriptionModal({
  isOpen,
  onClose,
  currentSlide,
  onSelectSlide,
  isPlaying,
  onTogglePlay,
  currentCharIndex,
  onOpenExportAudio,
}: TranscriptionModalProps) {
  const [tab, setTab] = useState<'current' | 'all'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Calculate word count and estimated speech duration
  const totalWords = useMemo(() => {
    return SLIDES.reduce((acc, s) => acc + s.speakerScript.split(/\s+/).length, 0);
  }, []);

  const estimatedMinutes = Math.round(totalWords / 135); // standard ~135 wpm speech in Portuguese

  // Filter slides if searching
  const filteredSlides = useMemo(() => {
    if (!searchQuery.trim()) return SLIDES;
    const q = searchQuery.toLowerCase();
    return SLIDES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.speakerScript.toLowerCase().includes(q) ||
        s.subtitle?.toLowerCase().includes(q) ||
        `slide ${s.id}`.includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    const text = SLIDES.map(
      (s) => `[SLIDE ${s.id}: ${s.title}]\n${s.speakerScript}\n`
    ).join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = `# TRANSCRIÇÃO DE ÁUDIO & ROTEIRO COMPLETO DE APRESENTAÇÃO
VÉRTICE AUTOPEÇAS — VISÃO 2036
Projeto Integrado PRG100 (Entregas 1 e 2)
Integrantes: Alberto Jesus Leon Fernandez, Daniel Prado Ancora da Luz, Enrico Terra, Mateus Ota, Vitor Lobba Pegoretti
Docente: Prof. Dr. José Agostinho Baitello (Outubro de 2026)

Tempo estimado de narração: ~${estimatedMinutes} minutos (${totalWords} palavras)
Total de slides: 30 slides

${'='.repeat(70)}

` +
      SLIDES.map(
        (s) =>
          `SLIDE ${s.id} — ${s.title.toUpperCase()}\nSeção: ${s.partLabel}\n\nTRANSCRIÇÃO DE ÁUDIO:\n"${s.speakerScript}"\n\n`
      ).join('-'.repeat(50) + '\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcricao_audio_vertice_2036.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format highlighted text for current slide
  const renderCurrentTranscriptWithHighlight = () => {
    const text = currentSlide.speakerScript;
    if (currentCharIndex < 0 || currentCharIndex >= text.length || !isPlaying) {
      return <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{text}</p>;
    }

    const before = text.slice(0, currentCharIndex);
    // Find next word end
    const nextSpace = text.indexOf(' ', currentCharIndex);
    const wordEnd = nextSpace === -1 ? text.length : nextSpace;
    const currentWord = text.slice(currentCharIndex, wordEnd);
    const after = text.slice(wordEnd);

    return (
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
        <span className="text-sky-300/80">{before}</span>
        <span className="bg-sky-500 text-slate-950 font-bold px-1 rounded shadow-xs">
          {currentWord}
        </span>
        <span className="text-slate-400">{after}</span>
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Transcrição de Áudio & Roteiro Falado
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                  30 Slides
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  ~{estimatedMinutes} min de fala estimada
                </span>
                <span>·</span>
                <span>{totalWords} palavras totais</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar transcrição completa dos 30 slides"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar Tudo'}</span>
            </button>

            {onOpenExportAudio && (
              <button
                onClick={onOpenExportAudio}
                className="px-3 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-500/50 text-sky-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Exportar narração de áudio como arquivo .mp3"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Exportar MP3</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Baixar arquivo TXT com a transcrição completa"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar TXT</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher & Search */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setTab('current')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                tab === 'current'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Slide Atual ({currentSlide.id}/30)
            </button>
            <button
              onClick={() => setTab('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                tab === 'all'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Roteiro Completo (Todos os Slides)
            </button>
          </div>

          {tab === 'all' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar no roteiro falado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {tab === 'current' ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* Active Slide Context */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                      Slide {currentSlide.id}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{currentSlide.partLabel}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-100">{currentSlide.title}</h4>
                </div>

                <button
                  onClick={onTogglePlay}
                  className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pausar Áudio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Reproduzir Este Slide</span>
                    </>
                  )}
                </button>
              </div>

              {/* Spoken Text Teleprompter Box */}
              <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-5 sm:p-6 relative">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <FileText className="w-3 h-3 text-sky-400" />
                  <span>Texto Falado (Áudio Transcrito):</span>
                </div>
                {renderCurrentTranscriptWithHighlight()}
              </div>

              {/* Navigation within transcript */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentSlide.id === 1}
                  onClick={() => onSelectSlide(currentSlide.id - 1)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs text-slate-200 transition-colors"
                >
                  ← Slide Anterior
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {currentSlide.id} de {SLIDES.length}
                </span>
                <button
                  disabled={currentSlide.id === SLIDES.length}
                  onClick={() => onSelectSlide(currentSlide.id + 1)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs text-slate-200 transition-colors"
                >
                  Próximo Slide →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {filteredSlides.map((slide) => {
                const isCurrent = slide.id === currentSlide.id;
                return (
                  <div
                    key={slide.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-slate-950 border-sky-500/60 ring-1 ring-sky-500/30'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-850">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                          Slide {slide.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{slide.title}</span>
                        <span className="text-[11px] text-slate-500 hidden md:inline">· {slide.partLabel}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectSlide(slide.id);
                            setTab('current');
                          }}
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-mono underline"
                        >
                          Ir ao slide
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                      "{slide.speakerScript}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
