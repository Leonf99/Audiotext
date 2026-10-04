import { Target, CheckCircle2, TrendingUp, Zap, Clock, ShieldCheck, Leaf } from 'lucide-react';

export default function StrategicTargetsGauges() {
  const targets = [
    {
      id: 1,
      title: 'OEE nas Linhas Robotizadas',
      target: '≥ 85%',
      baseline: '62% (2026)',
      icon: TrendingUp,
      status: 'Meta de Excelência Mundial',
      color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
    },
    {
      id: 2,
      title: 'Rastreabilidade Individual Unitária',
      target: '100%',
      baseline: 'Lotes genéricos (2026)',
      icon: ShieldCheck,
      status: 'Genealogia Serial DataMatrix',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    },
    {
      id: 3,
      title: 'Redução de Paradas Não Planejadas',
      target: '-70%',
      baseline: 'Referência 2026',
      icon: Zap,
      status: 'Manutenção Preditiva & IoT',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
    },
    {
      id: 4,
      title: 'Redução de Lead Time (Pedido ao JIS)',
      target: '-50%',
      baseline: '18 dias (2026)',
      icon: Clock,
      status: 'Sincronização Just-in-Sequence',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20',
    },
    {
      id: 5,
      title: 'Receita de Novos Produtos & Serviços',
      target: '≥ 80%',
      baseline: '0% novos produtos (2026)',
      icon: Target,
      status: 'Frenagem + SaaS + Circular',
      color: 'text-teal-400 border-teal-500/30 bg-teal-950/20',
    },
    {
      id: 6,
      title: 'Energia Elétrica de Fontes Renováveis',
      target: '100%',
      baseline: 'Rede convencional (2026)',
      icon: Leaf,
      status: 'Solar on-site + Baterias 2ª vida',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    },
    {
      id: 7,
      title: 'Emissões Líquidas de Carbono (Escopo 1 e 2)',
      target: 'Net Zero',
      baseline: 'Fábrica fóssil (2026)',
      icon: Leaf,
      status: 'Operação Fabril Descarbonizada',
      color: 'text-green-400 border-green-500/30 bg-green-950/20',
    },
    {
      id: 8,
      title: 'Inspeção Automática de Qualidade',
      target: '100%',
      baseline: 'Amostragem manual (2026)',
      icon: CheckCircle2,
      status: 'Visão Computacional em Linha',
      color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Os 8 Indicadores Estratégicos (Metas 2036)</span>
            <span className="text-[11px] text-sky-400 font-mono">Linha de Base: 2026</span>
          </h4>
          <p className="text-xs text-slate-400">
            Metas do plano com mensuração continuada a partir do primeiro ano da transição (Fase 1).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {targets.map((tgt) => {
          const Icon = tgt.icon;
          return (
            <div
              key={tgt.id}
              className={`p-3.5 rounded-lg border flex flex-col justify-between ${tgt.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">Meta #{tgt.id}</span>
                  <Icon className="w-4 h-4 opacity-80" />
                </div>
                <h5 className="text-xs font-semibold text-slate-200 line-clamp-2 min-h-[32px] mb-2">
                  {tgt.title}
                </h5>
              </div>

              <div className="border-t border-slate-800/80 pt-2 mt-1">
                <div className="text-xl font-bold font-mono text-slate-100 tracking-tight">{tgt.target}</div>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-slate-400 font-mono">Base: {tgt.baseline}</span>
                </div>
                <div className="mt-1.5 text-[9px] font-mono text-slate-300 opacity-90 line-clamp-1">
                  {tgt.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
