import { useState } from 'react';
import { SlideData } from '../types';
import { SLIDES, AUTHORS, PROFESSOR, COURSE_INFO, DATE_INFO } from '../data/slidesData';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  User,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle,
} from 'lucide-react';

import ProductLifecycleChart from './slides/ProductLifecycleChart';
import CircularLifecycleDiagram from './slides/CircularLifecycleDiagram';
import SystemArchitectureDiagram from './slides/SystemArchitectureDiagram';
import TraceabilityFlow from './slides/TraceabilityFlow';
import SimulationMatrix from './slides/SimulationMatrix';
import ValueChainDiagram from './slides/ValueChainDiagram';
import BusinessModelCanvasView from './slides/BusinessModelCanvasView';
import ImplementationPhasesView from './slides/ImplementationPhasesView';
import RoadmapMatrixView from './slides/RoadmapMatrixView';
import RevenueEvolutionChart from './slides/RevenueEvolutionChart';
import StrategicTargetsGauges from './slides/StrategicTargetsGauges';

interface SlideViewerProps {
  currentSlide: SlideData;
  onPrev: () => void;
  onNext: () => void;
  onJumpToSlide: (id: number) => void;
  onOpenNotes: () => void;
  onOpenTranscription: () => void;
  onOpenOverview: () => void;
}

export default function SlideViewer({
  currentSlide,
  onPrev,
  onNext,
  onJumpToSlide,
  onOpenNotes,
  onOpenTranscription,
  onOpenOverview,
}: SlideViewerProps) {
  const hasPrev = currentSlide.id > 1;
  const hasNext = currentSlide.id < SLIDES.length;

  const progressPercent = (currentSlide.id / SLIDES.length) * 100;

  // Render interactive diagram based on interactiveType
  const renderInteractiveDiagram = () => {
    switch (currentSlide.interactiveType) {
      case 'product_lifecycle':
        return <ProductLifecycleChart />;
      case 'circular_lifecycle':
        return <CircularLifecycleDiagram />;
      case 'system_architecture':
        return <SystemArchitectureDiagram />;
      case 'traceability_flow':
        return <TraceabilityFlow />;
      case 'simulation_matrix':
        return <SimulationMatrix />;
      case 'value_chain':
        return <ValueChainDiagram />;
      case 'canvas_2036':
        return <BusinessModelCanvasView />;
      case 'implementation_phases':
        return <ImplementationPhasesView />;
      case 'roadmap_matrix':
        return <RoadmapMatrixView />;
      case 'revenue_evolution':
        return <RevenueEvolutionChart />;
      case 'strategic_targets':
        return <StrategicTargetsGauges />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full px-3 sm:px-6 py-4">
      {/* Top Slide Meta Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sky-400">SLIDE {currentSlide.id.toString().padStart(2, '0')}</span>
          <span className="text-slate-600">/</span>
          <span>{SLIDES.length}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">{currentSlide.partLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNotes}
            className="hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            title="Abrir notas do orador (Tecla P)"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Notas (P)</span>
          </button>
          <button
            onClick={onOpenTranscription}
            className="hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer text-sky-400/90"
            title="Abrir transcrição de áudio (Tecla T)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Roteiro / Áudio (T)</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 sm:p-8 min-h-[560px] flex flex-col justify-between shadow-2xl relative overflow-hidden slide-container backdrop-blur-xs">
        {/* Render Cover Slide (Slide 1) */}
        {currentSlide.type === 'cover' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 mb-3 tracking-wider uppercase">
                    <span>{COURSE_INFO}</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
                    Vértice Autopeças: <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                      Visão 2036
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed max-w-xl">
                    Plano estratégico decenal de transição tecnológica e manufatura autônoma: da embreagem mecânica à frenagem inteligente.
                  </p>
                </div>

                {/* Team & Professor Credits */}
                <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Integrantes do Projeto
                    </div>
                    <ul className="text-xs space-y-1 text-slate-200">
                      {AUTHORS.map((auth, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-sky-400/80 font-mono text-[10px]">›</span>
                          <span>{auth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Orientador
                      </div>
                      <div className="text-xs font-semibold text-slate-200">{PROFESSOR}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Data de Apresentação
                      </div>
                      <div className="text-xs text-slate-300 font-mono">{DATE_INFO}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Hero Visual */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                  <img
                    src={currentSlide.image}
                    alt="Vértice Autopeças Visão 2036"
                    className="w-full h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-slate-300">
                    <span className="text-sky-400 font-bold">Vértice Autopeças</span> · Indústria 4.0 & Eletromobilidade
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Agenda Slide (Slide 2) */}
        {currentSlide.type === 'agenda' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1">{currentSlide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 items-stretch">
              {/* Part 0 */}
              <div
                onClick={() => onJumpToSlide(3)}
                className="bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between group hover:shadow-lg hover:shadow-sky-500/5"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-rose-400 mb-2 block">
                    PARTE 0
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    Ponto de Partida (2026)
                  </h3>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Quem é a Vértice hoje, limites do modelo tradicional de discos de embreagem e o imperativo existencial da transição para os veículos elétricos.
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-3 mt-4 text-xs font-mono text-sky-400 flex items-center justify-between">
                  <span>Slide 3</span>
                  <span className="group-hover:translate-x-1 transition-transform">Ver Parte 0 →</span>
                </div>
              </div>

              {/* Part 1 */}
              <div
                onClick={() => onJumpToSlide(4)}
                className="bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between group hover:shadow-lg hover:shadow-sky-500/5"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-sky-400 mb-2 block">
                    PARTE 1
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    A Visão 2036
                  </h3>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Como a empresa operará em dez anos: novos módulos regenerativos, fábrica autônoma 24/7, sistemas em 5 camadas, cibersegurança e alianças.
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-3 mt-4 text-xs font-mono text-sky-400 flex items-center justify-between">
                  <span>Slides 4 a 20</span>
                  <span className="group-hover:translate-x-1 transition-transform">Ver Parte 1 →</span>
                </div>
              </div>

              {/* Part 2 */}
              <div
                onClick={() => onJumpToSlide(21)}
                className="bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between group hover:shadow-lg hover:shadow-sky-500/5"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-teal-400 mb-2 block">
                    PARTE 2
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    Transição 2026–2036
                  </h3>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Metodologia em 5 fases, roadmap detalhado das 11 tecnologias, desdobramento dos 3 horizontes, metas quantitativas e pessoas.
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-3 mt-4 text-xs font-mono text-sky-400 flex items-center justify-between">
                  <span>Slides 21 a 30</span>
                  <span className="group-hover:translate-x-1 transition-transform">Ver Parte 2 →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Divider Slides (Slide 4 and 21) */}
        {currentSlide.type === 'divider' && (
          <div className="flex-1 flex flex-col justify-center relative rounded-xl overflow-hidden p-8 sm:p-12">
            {currentSlide.image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center brightness-30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70"></div>
              </div>
            )}
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-mono font-bold text-sky-400 tracking-widest uppercase">
                {currentSlide.partLabel}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-lg sm:text-xl text-slate-300">{currentSlide.subtitle}</p>

              {currentSlide.keyPoints && (
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {currentSlide.keyPoints.map((pt, i) => (
                    <div key={i} className="text-sm text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Interactive Slides */}
        {currentSlide.type === 'interactive' && (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{currentSlide.subtitle}</p>
              )}
            </div>

            {/* Interactive Module Mounted */}
            <div className="flex-1">{renderInteractiveDiagram()}</div>
          </div>
        )}

        {/* Render Content Slides */}
        {currentSlide.type === 'content' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{currentSlide.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
              {/* Left Column: Bullet Points & Content */}
              <div className={`${currentSlide.image ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
                {currentSlide.keyPoints && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentSlide.keyPoints.map((pt, idx) => {
                      const parts = pt.split(': ');
                      const title = parts.length > 1 ? parts[0] : null;
                      const body = parts.length > 1 ? parts[1] : pt;

                      return (
                        <div
                          key={idx}
                          className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 text-xs sm:text-sm hover:border-slate-700 transition-colors flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 font-mono text-[10px] flex items-center justify-center shrink-0 border border-sky-800/50 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="leading-relaxed">
                            {title && <strong className="text-slate-100 font-semibold">{title}: </strong>}
                            <span className="text-slate-300">{body}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Slide Image if present */}
              {currentSlide.image && (
                <div className="lg:col-span-5 relative self-center">
                  <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl group">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span>Vértice Autopeças 2036</span> · Visual de Engenharia
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Closing Slide (Slide 30) */}
        {currentSlide.type === 'closing' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="mb-4">
              <span className="text-xs font-mono font-bold text-sky-400 tracking-wider uppercase block mb-1">
                Síntese Executiva
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-sm text-slate-300 mt-1">{currentSlide.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Triad 1: O Produto */}
              <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-400 mb-2 block">01. O PRODUTO</span>
                  <h3 className="text-base font-bold text-slate-100 mb-2">Transição da Matriz de Valor</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Substituição programada da embreagem mecânica em declínio por módulos inteligentes de frenagem regenerativa, com software brake-by-wire e novas receitas por assinatura.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-sky-400">
                  50% da receita em 2036
                </div>
              </div>

              {/* Triad 2: A Fábrica */}
              <div className="bg-slate-950/80 border border-teal-500/30 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-400 mb-2 block">02. A FÁBRICA</span>
                  <h3 className="text-base font-bold text-slate-100 mb-2">Manufatura Autônoma 24/7</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Robôs colaborativos, frota autônoma de AMRs, malha contínua de IoT e inspeção óptica de 100% dos componentes, com operação fabril Net Zero em carbono.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-teal-400">
                  OEE ≥ 85% e Zero Defeito
                </div>
              </div>

              {/* Triad 3: A Jornada */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 mb-2 block">03. A JORNADA</span>
                  <h3 className="text-base font-bold text-slate-100 mb-2">Três Horizontes Decenais</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Evolução disciplinada em 5 fases por tecnologia: da Fundação Digital (2026-27), passando pela Escala (2028-31), até a Autonomia Plena em 2036 com risco controlado.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                  11 Tecnologias escaladas
                </div>
              </div>
            </div>

            {/* Closing Acknowledgements */}
            <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                <strong className="text-slate-200">Projeto Integrado PRG100:</strong> Alberto Jesus, Daniel Prado, Enrico Terra, Mateus Ota, Vitor Lobba.
              </div>
              <div className="font-mono text-sky-400 font-semibold">
                Muito Obrigado!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation & Progress Bar */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Slide anterior (Seta esquerda)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-sky-600/20"
            title="Próximo slide (Seta direita ou Espaço)"
          >
            <span>Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenOverview}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-mono text-slate-300 ml-1 cursor-pointer"
            title="Abrir índice completo dos 30 slides"
          >
            {currentSlide.id} / {SLIDES.length}
          </button>
        </div>

        {/* Linear Progress Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Keyboard helper hints */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <span>← / → : Navegar</span>
          <span>·</span>
          <span>T : Transcrição</span>
          <span>·</span>
          <span>P : Notas</span>
        </div>
      </div>
    </div>
  );
}
