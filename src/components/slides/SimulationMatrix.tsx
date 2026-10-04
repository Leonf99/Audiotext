import { useState } from 'react';
import { Layers, CheckCircle2, ChevronRight, Cpu, Factory, Truck, Package } from 'lucide-react';

export default function SimulationMatrix() {
  const [activeLevel, setActiveLevel] = useState<number>(0);

  const levels = [
    {
      level: '1. Projeto do Produto',
      tag: 'Gêmeo Digital Mecânico & Térmico',
      icon: Cpu,
      simulation: 'Simulação multifísica acoplada (CFD/FEA) de frenagem regenerativa integrada ao modelo CAD do veículo da montadora.',
      decision: 'Aprovação de geometrias e materiais sem necessidade de construir múltiplos lotes de protótipos físicos caros.',
      metric: '-80% de protótipos físicos',
    },
    {
      level: '2. Fabricação & Linha',
      tag: 'Gêmeo Digital de Fábrica',
      icon: Factory,
      simulation: 'Simulação de eventos discretos do layout da planta: trajetórias de robôs e AMRs, balanceamento de linha e gargalos energéticos.',
      decision: 'Investimento em automação (Capex) apenas em células cujo retorno e ausência de paradas foram comprovados no virtual.',
      metric: 'Zero gargalos imprevistos',
    },
    {
      level: '3. Cadeia de Suprimentos',
      tag: 'Simulação Estocástica de Rede',
      icon: Package,
      simulation: 'Cenários probabilísticos de ruptura de fornecimento, oscilação cambial do aço, atrasos portuários e inflação de insumos.',
      decision: 'Dimensionamento dinâmico de estoques de segurança e homologação antecipada de fornecedores secundários resilientes.',
      metric: '+99.5% disponibilidade de insumo',
    },
    {
      level: '4. Distribuição & JIS',
      tag: 'Roteirização & Sincronismo',
      icon: Truck,
      simulation: 'Modelagem de rotas de transporte, tráfego metropolitano e sequenciamento de paletes sincronizados com a linha da montadora.',
      decision: 'Garantia contratual de entrega Just-In-Sequence com tolerância de minutos, sem risco de parada de montagem do cliente.',
      metric: '100% de pontualidade JIS',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Matriz de Simulação em 4 Níveis Estratégicos</span>
            <span className="text-[11px] text-cyan-400 font-mono">Validação Virtual Prévia</span>
          </h4>
          <p className="text-xs text-slate-400">
            Princípio fundamental: Nenhuma decisão de investimento é tomada antes de ser estressada no ambiente digital.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Visão 2036</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {levels.map((item, idx) => {
          const Icon = item.icon;
          const isSelected = idx === activeLevel;
          return (
            <div
              key={idx}
              onClick={() => setActiveLevel(idx)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400">Nível 0{idx + 1}</span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <h5 className="text-xs font-bold text-slate-100 mb-1">{item.level}</h5>
                <span className="text-[10px] text-cyan-400/90 font-mono block mb-2">{item.tag}</span>

                <div className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-0.5">O que simulamos:</span>
                  {item.simulation}
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-2.5 mt-2">
                <span className="text-emerald-400 block text-[10px] uppercase font-mono mb-0.5 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Decisão Tomada:
                </span>
                <p className="text-[11px] text-slate-200">{item.decision}</p>
                <div className="mt-2 text-right">
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {item.metric}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
