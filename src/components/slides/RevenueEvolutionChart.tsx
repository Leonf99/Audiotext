import { useState } from 'react';
import { REVENUE_DATA } from '../../data/slidesData';
import { TrendingUp, DollarSign, PieChart } from 'lucide-react';

export default function RevenueEvolutionChart() {
  const [selectedYear, setSelectedYear] = useState<number>(2036);

  const currentData = REVENUE_DATA.find((d) => d.year === selectedYear) || REVENUE_DATA[REVENUE_DATA.length - 1];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Meta de Composição de Receita (2026–2036)</span>
            <span className="text-[11px] text-emerald-400 font-mono">Transição Decenal</span>
          </h4>
          <p className="text-xs text-slate-400">
            Redução programada da dependência de embreagens mecânicas e diversificação de margens.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-500"></span>
            <span className="text-slate-300">Embreagens (20%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-sky-400"></span>
            <span className="text-slate-300">Frenagem Reg. (50%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-teal-400"></span>
            <span className="text-slate-300">Serviços SaaS & Circular (30%)</span>
          </div>
        </div>
      </div>

      {/* Stacked Bars Timeline */}
      <div className="grid grid-cols-11 gap-1.5 h-44 mb-3 items-end pt-4 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
        {REVENUE_DATA.map((item) => {
          const isSelected = item.year === selectedYear;
          return (
            <div
              key={item.year}
              onClick={() => setSelectedYear(item.year)}
              className={`h-full flex flex-col justify-end cursor-pointer group p-1 rounded transition-all ${
                isSelected ? 'bg-slate-800/80 ring-1 ring-sky-400' : 'hover:bg-slate-900/60'
              }`}
            >
              {/* Stacked bar segments */}
              <div className="w-full flex flex-col justify-end h-32 rounded overflow-hidden">
                {/* Serviços */}
                {item.servicosDigitaisCirculares > 0 && (
                  <div
                    style={{ height: `${item.servicosDigitaisCirculares}%` }}
                    className="w-full bg-teal-500 transition-all duration-300"
                    title={`Serviços: ${item.servicosDigitaisCirculares}%`}
                  ></div>
                )}
                {/* Frenagem */}
                {item.frenagemRegenerativa > 0 && (
                  <div
                    style={{ height: `${item.frenagemRegenerativa}%` }}
                    className="w-full bg-sky-400 transition-all duration-300"
                    title={`Frenagem Regenerativa: ${item.frenagemRegenerativa}%`}
                  ></div>
                )}
                {/* Embreagens */}
                <div
                  style={{ height: `${item.embreagens}%` }}
                  className="w-full bg-rose-500 transition-all duration-300"
                  title={`Embreagens: ${item.embreagens}%`}
                ></div>
              </div>

              {/* Year label */}
              <div
                className={`text-center font-mono text-[10px] mt-1.5 select-none ${
                  isSelected ? 'text-sky-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.year.toString().slice(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Year Detail Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950/90 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-800 border border-slate-700 text-sky-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Ano em Foco</div>
            <div className="text-base font-bold font-mono text-slate-100">{selectedYear}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2.5 h-8 rounded bg-rose-500"></div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">Embreagens (Legado)</div>
            <div className="text-base font-bold font-mono text-rose-400">{currentData.embreagens}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2.5 h-8 rounded bg-sky-400"></div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">Frenagem Regenerativa</div>
            <div className="text-base font-bold font-mono text-sky-400">{currentData.frenagemRegenerativa}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2.5 h-8 rounded bg-teal-400"></div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">Serviços & Circular</div>
            <div className="text-base font-bold font-mono text-teal-400">
              {currentData.servicosDigitaisCirculares}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
