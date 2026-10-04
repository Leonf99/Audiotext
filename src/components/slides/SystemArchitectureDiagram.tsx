import { useState } from 'react';
import { ShieldCheck, Cloud, Server, Cpu, Database, Globe } from 'lucide-react';

export default function SystemArchitectureDiagram() {
  const [selectedLayer, setSelectedLayer] = useState<number>(3);

  const layers = [
    {
      id: 5,
      name: 'Camada 5: Clientes & Ecossistema Externo',
      short: 'Portal & Ecossistema',
      icon: Globe,
      color: 'border-sky-500/40 text-sky-400 bg-sky-950/20',
      activeColor: 'border-sky-400 bg-sky-950/40 text-sky-300',
      systems: ['Portal Web B2B (Montadoras)', 'APIs REST / GraphQL', 'EDI / JIS em Tempo Real', 'App do Motorista / Frotas', 'Oficinas com Realidade Aumentada (AR)'],
      description: 'Interface de integração direta com montadoras, frotistas e concessionárias, fornecendo rastreamento de pedidos, laudos e telemetria.',
    },
    {
      id: 4,
      name: 'Camada 4: Gestão do Negócio (Enterprise)',
      short: 'Gestão de Negócio',
      icon: Cloud,
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
      activeColor: 'border-indigo-400 bg-indigo-950/40 text-indigo-300',
      systems: ['ERP em Nuvem (IA Integrada)', 'SCM (Supply Chain Integrada)', 'CRM Automotivo B2B', 'PLM (Gerenciamento do Ciclo de Vida do Produto)'],
      description: 'Orquestração corporativa, planejamento orçamentário dinâmico, cálculo de custo por peça em tempo real e controle de suprimentos.',
    },
    {
      id: 3,
      name: 'Camada 3: Operação da Fábrica (Industrial Operations)',
      short: 'Operação Fabril (MES / APS)',
      icon: Server,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
      activeColor: 'border-cyan-400 bg-cyan-950/40 text-cyan-300',
      systems: ['MES (Manufacturing Execution System)', 'APS (Planejamento Avançado com IA)', 'WMS (Armazenagem Inteligente)', 'QMS (Gestão de Qualidade em Linha)'],
      description: 'Controle de chão de fábrica em tempo real, balanceamento estocástico de ordens de serviço, otimização de matriz energética e monitoramento de OEE.',
    },
    {
      id: 2,
      name: 'Camada 2: Inteligência & Dados (Analytics Engine)',
      short: 'Dados & Inteligência',
      icon: Database,
      color: 'border-teal-500/40 text-teal-400 bg-teal-950/20',
      activeColor: 'border-teal-400 bg-teal-950/40 text-teal-300',
      systems: ['Data Lake Corporativo', 'Modelos Preditivos de IA & ML', 'Gêmeo Digital (Digital Twin Produto/Linha)', 'Ledger em Blockchain'],
      description: 'Fusão de telemetria dos robôs com dados de uso veicular, treinamento de modelos de defeito zero e registro perpétuo de procedência.',
    },
    {
      id: 1,
      name: 'Camada 1: Infraestrutura & Chão de Fábrica (Edge & Conectividade)',
      short: 'Infraestrutura & Edge',
      icon: Cpu,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      activeColor: 'border-emerald-400 bg-emerald-950/40 text-emerald-300',
      systems: ['Nuvem Híbrida Multi-Zona', 'Servidores Edge na Borda (Near-Robot)', 'Rede Privativa 5G Industrial', 'Malha IoT / Sensores de Vibração / RFID'],
      description: 'Conectividade ultra-confiável e de latência inferior a 5ms para comando de robôs, AGVs, AMRs e leitura por visão computacional.',
    },
  ];

  const current = layers.find((l) => l.id === selectedLayer) || layers[2];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Arquitetura de Sistemas em 5 Camadas</span>
            <span className="text-[11px] text-sky-400 font-mono">Padrão ISA-95 Modernizado</span>
          </h4>
          <p className="text-xs text-slate-400">
            Estrutura desacoplada e orientada a microsserviços com segurança unificada.
          </p>
        </div>

        {/* Cybersecurity Shield Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="font-semibold font-mono text-[11px]">Zero Trust & IEC 62443 Transversal</span>
        </div>
      </div>

      {/* Layer Stack */}
      <div className="space-y-2 mb-4">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isSelected = layer.id === selectedLayer;
          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                isSelected ? layer.activeColor : `${layer.color} hover:bg-slate-800/40`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold w-6 h-6 rounded bg-slate-950/60 flex items-center justify-center border border-slate-700">
                  C{layer.id}
                </span>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">{layer.name}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px] opacity-80">
                <span className="font-mono">{layer.systems.length} sistemas</span>
                <span>·</span>
                <span className="text-slate-300">{layer.systems.slice(0, 2).join(', ')}...</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Layer Detail Focus */}
      <div className="bg-slate-950/90 rounded-lg border border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
          <div>
            <div className="text-xs font-mono font-bold text-sky-400 mb-0.5">{current.name}</div>
            <p className="text-xs text-slate-300">{current.description}</p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 self-start">
            Zero Trust Enforced
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {current.systems.map((sys, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono"
            >
              {sys}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
