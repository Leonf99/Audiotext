import { useState } from 'react';
import { SLIDES } from '../data/slidesData';
import { SlidePart } from '../types';
import { X, Grid, Search, Printer } from 'lucide-react';

interface SlideOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlideId: number;
  onSelectSlide: (id: number) => void;
}

export default function SlideOverviewModal({
  isOpen,
  onClose,
  activeSlideId,
  onSelectSlide,
}: SlideOverviewModalProps) {
  const [filterPart, setFilterPart] = useState<'all' | SlidePart>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = SLIDES.filter((s) => {
    if (filterPart !== 'all' && s.part !== filterPart) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.subtitle?.toLowerCase().includes(q) ||
        s.speakerScript.toLowerCase().includes(q) ||
        `slide ${s.id}`.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Visão Geral dos 30 Slides</h3>
              <p className="text-xs text-slate-400">Vértice Autopeças: Visão 2036 — Projeto Integrado PRG100</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterPart('all')}
              className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-colors ${
                filterPart === 'all'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos (30)
            </button>
            <button
              onClick={() => setFilterPart('parte_0')}
              className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-colors ${
                filterPart === 'parte_0'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Parte 0: Ponto de Partida
            </button>
            <button
              onClick={() => setFilterPart('parte_1')}
              className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-colors ${
                filterPart === 'parte_1'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Parte 1: Visão 2036
            </button>
            <button
              onClick={() => setFilterPart('parte_2')}
              className={`px-3 py-1 rounded-md whitespace-nowrap font-medium transition-colors ${
                filterPart === 'parte_2'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Parte 2: Transição 2026–2036
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar slide..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
            />
          </div>
        </div>

        {/* Slides Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((slide) => {
            const isActive = slide.id === activeSlideId;
            return (
              <div
                key={slide.id}
                onClick={() => {
                  onSelectSlide(slide.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                  isActive
                    ? 'bg-sky-950/40 border-sky-400 shadow-md shadow-sky-500/10 ring-1 ring-sky-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                      {slide.id.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                      {slide.partLabel}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1">
                    {slide.title}
                  </h5>
                  {slide.subtitle && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-800/80 pt-2 mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{slide.interactiveType ? 'Interativo' : 'Conteúdo'}</span>
                  <span className="text-sky-400 group-hover:underline">Abrir slide →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
