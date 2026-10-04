import { useState } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

export default function ProductLifecycleChart() {
  const [selectedYear, setSelectedYear] = useState<number>(2030);

  const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036];

  // Lifecycle indices (0-100 relative index)
  const data: Record<number, { embreagem: number; frenagem: number; context: string }> = {
    2026: { embreagem: 95, frenagem: 5, context: 'Vértice hoje: 100% dependência de discos de embreagem mecânicos.' },
    2027: { embreagem: 90, frenagem: 12, context: 'Início da eletrificação nos grandes centros; primeiros testes de bancada do módulo.' },
    2028: { embreagem: 82, frenagem: 24, context: 'Penetração acelerada de híbridos plug-in e elétricos puros no mercado OEM.' },
    2029: { embreagem: 70, frenagem: 40, context: 'Montadoras reduzem encomendas de transmissões manuais; piloto da linha regenerativa.' },
    2030: { embreagem: 55, frenagem: 60, context: 'Ponto de Inflexão: Frenagem regenerativa ultrapassa embreagens em investimento e relevância.' },
    2031: { embreagem: 42, frenagem: 75, context: 'Escala industrial do módulo regenerativo com 2 grandes montadoras globais.' },
    2032: { embreagem: 32, frenagem: 86, context: 'Frenagem regenerativa atinge larga escala fabril (Fase 5); consolidação B2B.' },
    2033: { embreagem: 25, frenagem: 92, context: 'Embreagem opera estritamente sob demanda em célula enxuta para reposição.' },
    2034: { embreagem: 20, frenagem: 95, context: 'Serviços de monitoramento e remanufatura atingem escala plena.' },
    2035: { embreagem: 16, frenagem: 97, context: 'Linha de freios brake-by-wire integrada a frotas autônomas e comerciais.' },
    2036: { embreagem: 12, frenagem: 100, context: 'Visão 2036 consolidada: frenagem inteligente lidera o portfólio corporativo.' },
  };

  const current = data[selectedYear];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Ciclo de Vida Tecnológico (2026–2036)</span>
            <span className="text-xs text-sky-400 font-mono">Curvas Conceituais</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Declínio estrutural da transmissão por atrito mecânico vs. ascensão da eletromobilidade regenerativa.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-rose-500/80 inline-block"></span>
            <span className="text-slate-300">Discos de Embreagem (Legado)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-400 inline-block"></span>
            <span className="text-slate-300">Frenagem Regenerativa (Futuro)</span>
          </div>
        </div>
      </div>

      {/* SVG Multi-curve Graph */}
      <div className="relative w-full h-56 bg-slate-950/60 rounded-lg border border-slate-800/80 p-4">
        <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
          {/* Horizontal Grid lines */}
          <line x1="40" y1="20" x2="780" y2="20" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="40" y1="65" x2="780" y2="65" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="40" y1="110" x2="780" y2="110" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="40" y1="155" x2="780" y2="155" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />

          {/* Area & Line: Embreagem (Descendente) */}
          <path
            d="M 60,30 Q 220,40 380,95 T 760,165 L 760,180 L 60,180 Z"
            fill="url(#roseGradient)"
            opacity="0.15"
          />
          <path
            d="M 60,30 Q 220,40 380,95 T 760,165"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Area & Line: Frenagem Regenerativa (Ascendente) */}
          <path
            d="M 60,175 Q 220,165 380,90 T 760,25 L 760,180 L 60,180 Z"
            fill="url(#cyanGradient)"
            opacity="0.2"
          />
          <path
            d="M 60,175 Q 220,165 380,90 T 760,25"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Selected Year Vertical Marker */}
          {(() => {
            const index = years.indexOf(selectedYear);
            const xPos = 60 + (index / (years.length - 1)) * 700;
            return (
              <g>
                <line x1={xPos} y1="10" x2={xPos} y2="180" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx={xPos} cy="10" r="4" fill="#38bdf8" />
              </g>
            );
          })()}

          {/* Year Markers on Bottom Axis */}
          {years.map((yr, idx) => {
            const x = 60 + (idx / (years.length - 1)) * 700;
            const isSelected = yr === selectedYear;
            return (
              <text
                key={yr}
                x={x}
                y="196"
                textAnchor="middle"
                fontSize="10"
                fill={isSelected ? '#38bdf8' : '#94a3b8'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                className="cursor-pointer select-none"
                onClick={() => setSelectedYear(yr)}
              >
                {yr}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Year Scrubbing Control */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="text-xs text-slate-400 font-mono">2026</span>
        <input
          type="range"
          min={2026}
          max={2036}
          step={1}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
        />
        <span className="text-xs text-sky-400 font-mono font-semibold">2036</span>
      </div>

      {/* Dynamic Year Context Box */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-md border border-rose-500/20 text-rose-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Embreagem Mecânica ({selectedYear})</div>
            <div className="text-sm font-semibold font-mono text-rose-400">{current.embreagem}% Demanda Relativa</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-md border border-sky-500/20 text-sky-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Frenagem Regenerativa ({selectedYear})</div>
            <div className="text-sm font-semibold font-mono text-sky-400">{current.frenagem}% Maturidade/Adoção</div>
          </div>
        </div>

        <div className="md:col-span-1 flex items-center gap-2 text-xs text-slate-300 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
          {selectedYear >= 2030 ? (
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="leading-snug">{current.context}</span>
        </div>
      </div>
    </div>
  );
}
