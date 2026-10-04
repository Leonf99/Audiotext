import { useState } from 'react';
import { QrCode, Shield, CheckCircle2, AlertOctagon, Car, Activity, Box, Cpu } from 'lucide-react';

export default function TraceabilityFlow() {
  const [activeStage, setActiveStage] = useState<number>(2);

  const stages = [
    {
      id: 1,
      title: 'Insumo & Fornecedor',
      tag: 'Lote de Aço & Composto',
      icon: Box,
      idType: 'Certificado Digital SHA-256',
      desc: 'Cada lote de aço laminado ou composto de fricção entra no sistema com laudo químico e mecânico assinado digitalmente pelo fornecedor siderúrgico.',
      blockchainStatus: 'Bloco de Origem Gravado',
    },
    {
      id: 2,
      title: 'Identidade da Peça',
      tag: 'Gravação Laser 2D',
      icon: QrCode,
      idType: 'DataMatrix Unitário',
      desc: 'Na saída da usinagem, cada disco recebe um código DataMatrix microscópico gravado a laser com tolerâncias geométricas e data/hora milissegundo.',
      blockchainStatus: 'Identidade Serial Única',
    },
    {
      id: 3,
      title: 'Montagem do Módulo',
      tag: 'Brake-by-Wire Assembly',
      icon: Cpu,
      idType: 'Hash de Firmware & Calibração',
      desc: 'Os sensores eletrônicos, pinça e software de controle são integrados. Resultados do dinamômetro inercial e versão de firmware são registrados.',
      blockchainStatus: 'Certidão Técnica Integrada',
    },
    {
      id: 4,
      title: 'Vínculo no Veículo',
      tag: 'Linha da Montadora (OEM)',
      icon: Car,
      idType: 'Pareamento com Chassi (VIN)',
      desc: 'Ao ser instalado na fábrica da montadora, o leitor RFID vincula o código serial da Vértice ao número de identificação do veículo (VIN).',
      blockchainStatus: 'Vínculo B2B Bilateral',
    },
    {
      id: 5,
      title: 'Uso & Telemetria',
      tag: 'Frotas & Motoristas',
      icon: Activity,
      idType: 'Log Contínuo de Desgaste',
      desc: 'Durante os milhares de quilômetros rodados, sensores de pastilha e estresse térmico enviam dados anonimizados via rede veicular para a nuvem.',
      blockchainStatus: 'Histórico Operacional',
    },
    {
      id: 6,
      title: 'Circular & Recall',
      tag: 'Logística Reversa / Pós-Venda',
      icon: Shield,
      idType: 'Passaporte Digital de Produto',
      desc: 'Em caso de recall por anomalia de fornecedor, o sistema identifica cirurgicamente apenas os chassis afetados em segundos, sem recolhimento em massa.',
      blockchainStatus: 'Auditoria e Circularidade',
    },
  ];

  const current = stages.find((s) => s.id === activeStage) || stages[1];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Genealogia Serial e Rastreabilidade Blockchain</span>
            <span className="text-[11px] text-sky-400 font-mono">100% dos Componentes</span>
          </h4>
          <p className="text-xs text-slate-400">
            Acompanhamento transparente do lingote de aço até a remanufatura em fim de vida.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-sky-950/40 border border-sky-500/30 rounded-lg text-sky-300 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-[11px]">Zero Planilhas Paralelas</span>
        </div>
      </div>

      {/* Horizontal Step Flow */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
        {stages.map((st) => {
          const Icon = st.icon;
          const isSelected = st.id === activeStage;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStage(st.id)}
              className={`p-3 rounded-lg border text-left transition-all relative ${
                isSelected
                  ? 'bg-sky-950/40 border-sky-400 shadow-md shadow-sky-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-slate-400">0{st.id}</span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
              </div>
              <div className="text-xs font-semibold text-slate-200 line-clamp-1">{st.title}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-1 line-clamp-1">{st.tag}</div>
            </button>
          );
        })}
      </div>

      {/* Detail Inspector Card */}
      <div className="bg-slate-950/90 rounded-lg border border-slate-800 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400">{current.idType}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                {current.blockchainStatus}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{current.desc}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 shrink-0 md:w-72">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Mitigação de Recall Cirúrgico</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Se um lote siderúrgico acusar impureza após 3 anos, o sistema identifica instantaneamente os 420 veículos exatos que receberam a peça, sem recolhimentos desnecessários de frota.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
