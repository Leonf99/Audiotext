import { useState } from 'react';
import { Users, Zap, Wrench, HeartHandshake, Truck, Target, DollarSign, Wallet } from 'lucide-react';

export default function BusinessModelCanvasView() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const blocks = [
    {
      id: 'kp',
      title: 'Parcerias-Chave',
      icon: Users,
      colSpan: 'col-span-1 md:col-span-2 row-span-2',
      items: [
        'Montadoras OEM (co-desenvolvimento B2B)',
        'Provedores de Nuvem e Cibersegurança',
        'Integradores de Robótica & AMRs',
        'Startups de IA, Sensores & Baterias',
        'Universidades, SENAI e Finep/BNDES',
        'Empresas de Reciclagem & Remanufatura',
      ],
    },
    {
      id: 'ka',
      title: 'Atividades-Chave',
      icon: Wrench,
      colSpan: 'col-span-1 md:col-span-2',
      items: [
        'Engenharia de frenagem regenerativa & software',
        'Manufatura autônoma 24/7 com AMRs',
        'Inspeção óptica 100% por visão computacional',
        'Simulação contínua em gêmeo digital',
      ],
    },
    {
      id: 'vp',
      title: 'Proposta de Valor',
      icon: Zap,
      colSpan: 'col-span-1 md:col-span-2 row-span-2',
      highlight: true,
      items: [
        'Frenagem segura, regenerativa e eficiente',
        'Entrega garantida no prazo (JIS) com tolerância zero',
        'Transparência e rastreabilidade total berço-ao-túmulo',
        'Manutenção preditiva para frotas comerciais',
        'Pegada de carbono Net Zero na manufatura',
      ],
    },
    {
      id: 'cr',
      title: 'Relacionamento',
      icon: HeartHandshake,
      colSpan: 'col-span-1 md:col-span-2',
      items: [
        'Co-desenvolvimento técnico desde a fase de conceito',
        'Engenharia simultânea B2B transparente',
        'Portal e APIs em tempo real para montadoras',
        'App intuitivo de saúde dos freios para frotas',
      ],
    },
    {
      id: 'cs',
      title: 'Segmentos de Clientes',
      icon: Target,
      colSpan: 'col-span-1 md:col-span-2 row-span-2',
      items: [
        'Montadoras de veículos elétricos (BEV) e híbridos (PHEV)',
        'Frotistas comerciais (logística, táxis e ônibus)',
        'Mercado de reposição (aftermarket para híbridos)',
        'Montadoras de caminhões elétricos leves',
      ],
    },
    {
      id: 'kr',
      title: 'Recursos-Chave',
      icon: Zap,
      colSpan: 'col-span-1 md:col-span-2',
      items: [
        'Fábrica robotizada com AMRs e 5G privado',
        'Portfólio de patentes de materiais de atrito e algoritmos',
        'Gêmeos digitais de produto e linha de produção',
        'Equipe técnica multidisciplinar requalificada',
      ],
    },
    {
      id: 'ch',
      title: 'Canais',
      icon: Truck,
      colSpan: 'col-span-1 md:col-span-2',
      items: [
        'Portal B2B e integração direta por API / EDI',
        'Linhas de expedição Just-In-Sequence com sensores IoT',
        'Rede credenciada de oficinas com Realidade Aumentada',
        'Canal digital de logística reversa e retorno',
      ],
    },
    {
      id: 'cst',
      title: 'Estrutura de Custos',
      icon: Wallet,
      colSpan: 'col-span-1 md:col-span-5',
      items: [
        'Investimento em automação (robôs industriais, AMRs, cobots)',
        'Infraestrutura de nuvem híbrida, edge computing e redes 5G',
        'P&D e engenharia de software embarcado para freio regenerativo',
        'Certificações automotivas rigorosas (ISO 27001, TISAX, UNECE R155/R156)',
        'Energia renovável fotovoltaica e requalificação contínua da equipe',
      ],
    },
    {
      id: 'rs',
      title: 'Fontes de Receita',
      icon: DollarSign,
      colSpan: 'col-span-1 md:col-span-5',
      items: [
        'Venda de módulos de frenagem regenerativa (50% da receita em 2036)',
        'Assinatura de monitoramento preditivo e telemetria para frotas (SaaS)',
        'Serviços circulares de remanufatura e reciclagem de componentes',
        'Venda sob demanda de embreagens para híbridos e reposição (20%)',
      ],
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Business Model Canvas — Vértice Visão 2036</span>
            <span className="text-[11px] text-sky-400 font-mono">9 Blocos Estratégicos</span>
          </h4>
        </div>
        <div className="text-xs text-slate-400 font-mono">PRG100</div>
      </div>

      {/* Canvas 10-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-2">
        {blocks.map((block) => {
          const Icon = block.icon;
          const isHighlighted = block.highlight;
          const isSelected = selectedBlock === block.id;

          return (
            <div
              key={block.id}
              onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
              className={`${block.colSpan} p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                isHighlighted
                  ? 'bg-gradient-to-b from-sky-950/60 to-slate-950 border-sky-400/80 shadow-md shadow-sky-500/10'
                  : isSelected
                  ? 'bg-slate-800/80 border-slate-400 ring-1 ring-slate-400/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isHighlighted ? 'text-sky-300' : 'text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {block.title}
                  </span>
                </div>

                <ul className="space-y-1">
                  {block.items.map((it, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                      <span className="text-sky-400/60 shrink-0 font-mono">›</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
