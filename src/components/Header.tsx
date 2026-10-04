import { FileText, Grid, Maximize, Minimize } from 'lucide-react';

interface HeaderProps {
  onJumpToSlide: (slideId: number) => void;
  onOpenTranscription: () => void;
  onOpenOverview: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function Header({
  onJumpToSlide,
  onOpenTranscription,
  onOpenOverview,
  isFullscreen,
  onToggleFullscreen,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onJumpToSlide(1);
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-100 hover:text-sky-400 transition-colors whitespace-nowrap"
        >
          Vértice Autopeças 2036
        </a>
      </div>

      {/* Zone 2: 4 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onJumpToSlide(3)}
          className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
        >
          Diagnóstico
        </button>
        <button
          onClick={() => onJumpToSlide(5)}
          className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
        >
          Visão 2036
        </button>
        <button
          onClick={() => onJumpToSlide(23)}
          className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
        >
          Roadmap
        </button>
        <button
          onClick={() => onJumpToSlide(29)}
          className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
        >
          Metas
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTranscription}
          className="px-3 py-1.5 text-xs font-medium text-sky-300 bg-sky-950/60 border border-sky-800/60 rounded-lg hover:bg-sky-900/40 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          title="Ver transcrição completa do áudio"
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span>Transcrição</span>
        </button>

        <button
          onClick={onOpenOverview}
          className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          title="Ver índice de todos os 30 slides"
        >
          <Grid className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Índice</span>
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
