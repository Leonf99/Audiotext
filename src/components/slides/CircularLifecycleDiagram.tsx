import { useState } from 'react';
import { Cpu, RotateCcw, PenTool, Factory, Car, Activity, RefreshCw } from 'lucide-react';

export default function CircularLifecycleDiagram() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: '1. Concepção & P&D',
      icon: Cpu,
      summary: 'IA cruza telemetria de frotas e metas das montadoras.',
      details:
        'Algoritmos de inteligência artificial analisam padrões térmicos reais e exigências de frenagem das montadoras para calibrar as especificações de torque e massa.',
      badge: 'Alimentado por Big Data',
    },
    {
      id: 2,
      title: '2. Projeto CAD / CAE',
      icon: PenTool,
      summary: 'Gêmeo digital simula frenagem, dissipação e desgaste.',
      details:
        'Simulações termomecânicas e de dinâmica de fluidos no Digital Twin eliminam 80% dos protótipos físicos e validam tolerâncias antes do corte do metal.',
      badge: 'Zero Retrabalho Físico',
    },
    {
      id: 3,
      title: '3. Manufatura Ágil',
      icon: Factory,
      summary: 'Células robotizadas e impressão 3D sob demanda.',
      details:
        'Usinagem de alta precisão e conformação com robôs industriais e cobots. 100% dos lotes inspecionados por visão computacional com gravação DataMatrix laser.',
      badge: 'Fábrica Autônoma 24/7',
    },
    {
      id: 4,
      title: '4. Montagem no Carro',
      icon: Car,
      summary: 'Entrega Just-In-Sequence com pareamento do chassi.',
      details:
        'Os módulos são expedidos na ordem exata da linha da montadora e recebem pareamento criptográfico instantâneo com o número de chassi (VIN) do veículo.',
      badge: 'Sincronização JIS',
    },
    {
      id: 5,
      title: '5. Uso & Monitoramento',
      icon: Activity,
      summary: 'Sensores IoT transmitem estresse e desgaste em tempo real.',
      details:
        'Sensores integrados ao módulo brake-by-wire monitoram temperatura, coeficiente de atrito e rotação. App de frota avisa necessidade de troca antes de qualquer falha.',
      badge: 'Telemetria Contínua',
    },
    {
      id: 6,
      title: '6. Fim de Vida & Circular',
      icon: RefreshCw,
      summary: 'Remanufatura certificada e reciclagem de materiais.',
      details:
        'Peças desgastadas retornam por logística reversa. Componentes nobres são recondicionados e materiais de atrito são reaproveitados para alimentar o ciclo.',
      badge: 'Economia Circular Fechada',
    },
  ];

  const current = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Circuito Fechado (Cradle-to-Cradle)</span>
            <span className="text-[11px] text-teal-400 font-mono">Loop de Dados & Materiais</span>
          </h4>
          <p className="text-xs text-slate-400">
            Clique em cada etapa para examinar os fluxos integrados de informação e engenharia circular.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <RotateCcw className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
          <span>Ciclo Fechado 2036</span>
        </div>
      </div>

      {/* Steps Grid / Process Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
        {steps.map((st) => {
          const Icon = st.icon;
          const isSelected = st.id === activeStep;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStep(st.id)}
              className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono font-bold ${
                      isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {st.id}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                </div>
                <div className="text-xs font-semibold text-slate-200 line-clamp-1">{st.title.split('. ')[1]}</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 line-clamp-2">{st.summary}</div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Callout */}
      <div className="bg-slate-950/90 rounded-lg border border-teal-500/30 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-semibold text-teal-400">{current.badge}</span>
              <span className="text-slate-600">·</span>
              <span className="text-sm font-bold text-slate-100">{current.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.details}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-md p-3 shrink-0 md:w-64 text-[11px] text-slate-300">
            <div className="text-slate-400 font-mono mb-1 text-[10px] uppercase tracking-wider">
              Realimentação do Ciclo
            </div>
            <p>
              {current.id === 6
                ? 'Componentes e pós metálicos reprocessados reingressam na Concepção e no corte de novas peças.'
                : 'Telemetria de sensores e dados de inspeção alimentam os algoritmos de projeto continuamente.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
