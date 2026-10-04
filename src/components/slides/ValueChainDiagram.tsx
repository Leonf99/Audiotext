import { useState } from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function ValueChainDiagram() {
  const [activeArea, setActiveArea] = useState<string>('primary_operacoes');

  const supportActivities = [
    {
      id: 'support_infra',
      name: 'Infraestrutura da Empresa',
      content: 'ERP em nuvem com inteligência artificial integrada, apuração de custos por peça em tempo real e governança transparente.',
    },
    {
      id: 'support_rh',
      name: 'Recursos Humanos',
      content: 'Academia Digital Vértice, requalificação com Realidade Aumentada e parcerias com SENAI e faculdades técnicas.',
    },
    {
      id: 'support_pd',
      name: 'Desenvolvimento Tecnológico',
      content: 'PLM unificado, simulação em gêmeo digital (CFD/FEA), algoritmos de IA e manufatura aditiva 3D em P&D.',
    },
    {
      id: 'support_compras',
      name: 'Aquisição & Suprimentos',
      content: 'SCM com previsão colaborativa de demanda (CPFR) e rastreabilidade de lotes de aço em blockchain.',
    },
  ];

  const primaryActivities = [
    {
      id: 'primary_inbound',
      name: 'Logística de Entrada',
      badge: 'Inbound',
      content: 'Descarregamento autônomo por AMRs, leitura automatizada de etiquetas RFID e conferência instantânea de fornecedores.',
    },
    {
      id: 'primary_operacoes',
      name: 'Operações & Manufatura',
      badge: 'Chão de Fábrica',
      content: 'Células flexíveis com robôs e cobots, MES em tempo real, 100% de inspeção por visão computacional e zero emissão líquida.',
    },
    {
      id: 'primary_outbound',
      name: 'Logística de Saída',
      badge: 'Outbound',
      content: 'Sequenciamento Just-in-Sequence (JIS), carretas monitoradas por sensores IoT e entrega sincronizada na montadora.',
    },
    {
      id: 'primary_mkt',
      name: 'Marketing & Vendas',
      badge: 'Relacionamento',
      content: 'Engenharia simultânea B2B, co-desenvolvimento com montadoras, portal web com APIs e transparência contratual.',
    },
    {
      id: 'primary_servicos',
      name: 'Pós-Venda & Serviços',
      badge: 'Circularidade',
      content: 'Monitoramento IoT de desgaste para frotas, apoio a oficinas com Realidade Aumentada e logística reversa de remanufatura.',
    },
  ];

  const allItems = [...supportActivities, ...primaryActivities];
  const currentItem = allItems.find((item) => item.id === activeArea) || primaryActivities[1];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Cadeia de Valor Estratégica (Modelo de Porter)</span>
            <span className="text-[11px] text-sky-400 font-mono">Excelência Operacional & Diferenciação</span>
          </h4>
          <p className="text-xs text-slate-400">
            Convergência entre atividades de suporte tecnológico e atividades primárias de manufatura.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Margem por Diferenciação</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
        {/* Support Activities Stack (4 rows) */}
        <div className="lg:col-span-8 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Atividades de Apoio (Infraestrutura & Capacitação)
          </div>
          {supportActivities.map((act) => (
            <button
              key={act.id}
              onClick={() => setActiveArea(act.id)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                activeArea === act.id
                  ? 'bg-sky-950/60 border-sky-400 text-sky-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-semibold">{act.name}</span>
              <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[55%]">{act.content}</span>
            </button>
          ))}

          {/* Primary Activities (5 columns below) */}
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 pt-2 mb-1">
            Atividades Primárias (Fluxo Físico & Valor ao Cliente)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
            {primaryActivities.map((act) => (
              <button
                key={act.id}
                onClick={() => setActiveArea(act.id)}
                className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between h-20 ${
                  activeArea === act.id
                    ? 'bg-teal-950/60 border-teal-400 text-teal-200 ring-1 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[9px] font-mono text-teal-400 uppercase">{act.badge}</div>
                <div className="text-[11px] font-bold leading-tight">{act.name}</div>
                <div className="text-[9px] text-slate-400 line-clamp-1">Ver detalhe</div>
              </button>
            ))}
          </div>
        </div>

        {/* Value Proposition & Margin Arrow */}
        <div className="lg:col-span-4 bg-gradient-to-br from-sky-950/40 via-slate-950 to-teal-950/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-400 mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Proposta de Valor Central</span>
            </div>
            <p className="text-xs text-slate-100 font-medium italic border-l-2 border-sky-400 pl-2.5 py-1 mb-3">
              "Frenagem segura e eficiente, entregue no prazo e com transparência total, do projeto ao fim de vida."
            </p>

            <div className="text-[11px] text-slate-300 space-y-1.5">
              <div className="text-slate-400 font-mono text-[10px] uppercase">Impacto na Margem:</div>
              <div>• Eliminação de perdas por retrabalho e estoques ociosos.</div>
              <div>• Nova receita recorrente por assinatura SaaS (frotas).</div>
              <div>• Fidelização B2B por integração técnica com montadoras.</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] font-mono text-teal-400 uppercase font-bold mb-0.5">
              Foco Selecionado: {currentItem.name}
            </div>
            <p className="text-[11px] text-slate-300">{currentItem.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
