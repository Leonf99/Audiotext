import { useState } from 'react';
import { Lightbulb, Beaker, CheckSquare, GitFork, Rocket, ArrowRight } from 'lucide-react';

export default function ImplementationPhasesView() {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const phases = [
    {
      id: 1,
      name: 'Concepção',
      short: 'Fase 1',
      icon: Lightbulb,
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
      activeColor: 'border-amber-400 bg-amber-950/50 text-amber-300',
      objective: 'Ideação inicial, mapeamento de requisitos e seleção criteriosa da tecnologia e parceiros.',
      deliverables: [
        'Benchmarking internacional de fornecedores',
        'Estudo de viabilidade técnica e financeira (VPL / TIR)',
        'Definição da arquitetura-alvo e requisitos de cibersegurança',
      ],
      governance: 'Aprovação pelo comitê executivo de inovação para liberação de verba de prototipagem.',
    },
    {
      id: 2,
      name: 'Experimentação',
      short: 'Fase 2',
      icon: Beaker,
      color: 'border-sky-500/40 text-sky-400 bg-sky-950/20',
      activeColor: 'border-sky-400 bg-sky-950/50 text-sky-300',
      objective: 'Desenvolvimento de Provas de Conceito (PoC), protótipos em bancada e testes de esforço.',
      deliverables: [
        'Bancadas de teste com simulação Hardware-in-the-Loop',
        'Piloto isolado (ex: 1 AMR ou 1 grupo de sensores em prensa)',
        'Avaliação de limites físicos e taxas de erro preliminares',
      ],
      governance: 'Validação técnica dos critérios de sucesso da PoC para avançar ao chão de fábrica.',
    },
    {
      id: 3,
      name: 'Aprovação & Ajustes',
      short: 'Fase 3',
      icon: CheckSquare,
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
      activeColor: 'border-indigo-400 bg-indigo-950/50 text-indigo-300',
      objective: 'Uso experimental em célula piloto controlada com coleta intensiva de dados e calibração fina.',
      deliverables: [
        'Treinamento inicial de operadores e técnicos-chave',
        'Ajustes nos algoritmos e tempos de ciclo',
        'Homologação de conformidade com normas automotivas e de segurança',
      ],
      governance: 'Auditoria de qualidade e aceite formal da equipe de engenharia e produção.',
    },
    {
      id: 4,
      name: 'Uso em Paralelo',
      short: 'Fase 4',
      icon: GitFork,
      color: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
      activeColor: 'border-purple-400 bg-purple-950/50 text-purple-300',
      objective: 'A nova tecnologia opera lado a lado com o método legado para garantir contingência e comparar resultados.',
      deliverables: [
        'Convivência monitorada sem risco de parada da expedição',
        'Verificação de divergências de dados entre novo sistema e legado',
        'Plano de contingência e reversão caso haja anomalia',
      ],
      governance: 'Período mínimo de estabilidade (3 a 6 meses) sem incidentes críticos.',
    },
    {
      id: 5,
      name: 'Larga Escala',
      short: 'Fase 5',
      icon: Rocket,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      activeColor: 'border-emerald-400 bg-emerald-950/50 text-emerald-300',
      objective: 'Implantação definitiva corporativa em 100% das linhas fabris e desativação total do método legado.',
      deliverables: [
        'Operação autônoma estabilizada 24/7',
        'Integração nativa com ERP, MES, nuvem e portais de clientes',
        'Desligamento seguro e arquivamento de sistemas legados',
      ],
      governance: 'Meta operacional atingida e incorporação aos KPIs estratégicos da Vértice.',
    },
  ];

  const current = phases.find((p) => p.id === selectedPhase) || phases[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Metodologia em 5 Fases de Implementação</span>
            <span className="text-[11px] text-sky-400 font-mono">Mitigação de Riscos Técnicos</span>
          </h4>
          <p className="text-xs text-slate-400">
            Nenhuma tecnologia avança sem cumprir os critérios de saída de cada portão (Stage-Gate).
          </p>
        </div>
      </div>

      {/* 5 Phase Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
        {phases.map((ph, idx) => {
          const Icon = ph.icon;
          const isSelected = ph.id === selectedPhase;
          return (
            <button
              key={ph.id}
              onClick={() => setSelectedPhase(ph.id)}
              className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                isSelected ? ph.activeColor : `${ph.color} hover:bg-slate-800/40`
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold">FASE 0{ph.id}</span>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="text-xs font-bold">{ph.name}</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 line-clamp-2">{ph.objective}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed Phase Card */}
      <div className="bg-slate-950/90 rounded-lg border border-slate-800 p-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400">Fase 0{current.id}: {current.name}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300 font-medium">{current.objective}</span>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Principais Entregáveis & Atividades:
              </span>
              <ul className="space-y-1">
                {current.deliverables.map((deliv, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 shrink-0 md:w-72 text-xs">
            <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold mb-1">
              Critério de Saída (Stage Gate)
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{current.governance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
