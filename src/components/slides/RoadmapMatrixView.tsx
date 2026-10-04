import { useState } from 'react';
import { ROADMAP_TECHNOLOGIES } from '../../data/slidesData';
import { Filter, Calendar, CheckCircle2 } from 'lucide-react';

export default function RoadmapMatrixView() {
  const [selectedHorizon, setSelectedHorizon] = useState<'all' | 'h1' | 'h2' | 'h3'>('all');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036];

  const filteredTechs = ROADMAP_TECHNOLOGIES.filter((t) => {
    if (selectedHorizon === 'h1') return t.scaleYear <= 2030;
    if (selectedHorizon === 'h2') return t.scaleYear >= 2030 && t.scaleYear <= 2032;
    if (selectedHorizon === 'h3') return t.scaleYear >= 2032;
    return true;
  });

  const phaseColors: Record<number, string> = {
    1: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    2: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
    3: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40',
    4: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
    5: 'bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/80 shadow-xs shadow-emerald-500/20',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-2.5">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Matriz do Roadmap Tecnológico Decenal (2026–2036)</span>
            <span className="text-[11px] text-sky-400 font-mono">11 Tecnologias</span>
          </h4>
          <p className="text-xs text-slate-400">
            Fases: 1 Concepção · 2 Experimentação · 3 Aprovação · 4 Paralelo · 5 Larga Escala.
          </p>
        </div>

        {/* Horizon Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedHorizon('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedHorizon === 'all' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas (11)
          </button>
          <button
            onClick={() => setSelectedHorizon('h1')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedHorizon === 'h1' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            H1 (2026-27)
          </button>
          <button
            onClick={() => setSelectedHorizon('h2')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedHorizon === 'h2' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            H2 (2028-31)
          </button>
          <button
            onClick={() => setSelectedHorizon('h3')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedHorizon === 'h3' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            H3 (2032-36)
          </button>
        </div>
      </div>

      {/* Roadmap Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 bg-slate-950/60">
              <th className="py-2 px-3 font-semibold w-56">Tecnologia / Iniciativa</th>
              <th className="py-2 px-2 font-semibold text-center w-20">Escala (F5)</th>
              {years.map((yr) => (
                <th
                  key={yr}
                  className={`py-2 px-1 text-center font-mono text-[10px] ${
                    yr === 2030 || yr === 2032 || yr === 2036 ? 'text-sky-400 font-bold bg-sky-950/20' : ''
                  }`}
                >
                  {yr.toString().slice(2)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTechs.map((tech) => {
              const isSelected = selectedTech === tech.name;
              return (
                <tr
                  key={tech.name}
                  onClick={() => setSelectedTech(isSelected ? null : tech.name)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-800/60' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <td className="py-2 px-3">
                    <div className="font-semibold text-slate-200 text-xs">{tech.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tech.category}</div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      {tech.scaleYear}
                    </span>
                  </td>
                  {years.map((yr) => {
                    const phase = tech.phasesByYear[yr];
                    return (
                      <td key={yr} className="py-1 px-1 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-mono ${
                            phaseColors[phase] || 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          F{phase}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Tech Callout Note */}
      {selectedTech && (
        <div className="mt-3 p-2.5 bg-slate-950/90 rounded-lg border border-sky-500/30 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-slate-100">{selectedTech}:</span>
            <span>{ROADMAP_TECHNOLOGIES.find((t) => t.name === selectedTech)?.notes}</span>
          </div>
          <button
            onClick={() => setSelectedTech(null)}
            className="text-[10px] text-slate-400 hover:text-slate-200 underline font-mono ml-2"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
