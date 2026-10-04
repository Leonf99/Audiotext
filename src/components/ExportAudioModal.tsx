import { useState, useMemo } from 'react';
import { SlideData } from '../types';
import { SLIDES, AUTHORS, PROFESSOR, DATE_INFO } from '../data/slidesData';
import { exportSlideAudioAsMp3 } from '../services/audioExportService';
import {
  X,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileAudio,
  Radio,
  Sliders,
  ListMusic,
  FileText,
  Printer,
  Code2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ExportAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: SlideData;
}

export default function ExportAudioModal({
  isOpen,
  onClose,
  currentSlide,
}: ExportAudioModalProps) {
  const [activeTab, setActiveTab] = useState<'mp3' | 'pdf' | 'txt' | 'code'>('mp3');
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [isExportingCurrent, setIsExportingCurrent] = useState<boolean>(false);
  const [isExportingAll, setIsExportingAll] = useState<boolean>(false);
  const [currentProgressText, setCurrentProgressText] = useState<string>('');
  const [allProgress, setAllProgress] = useState<{ current: number; total: number; title: string }>({
    current: 0,
    total: SLIDES.length,
    title: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedTxt, setCopiedTxt] = useState(false);

  if (!isOpen) return null;

  const voices = [
    { id: 'Kore', name: 'Kore (Recomendada)', description: 'Tom executivo, claro e equilibrado em português' },
    { id: 'Fenrir', name: 'Fenrir', description: 'Tom firme, corporativo e com autoridade técnica' },
    { id: 'Puck', name: 'Puck', description: 'Tom dinâmico, envolvente e moderno' },
    { id: 'Zephyr', name: 'Zephyr', description: 'Tom pausado, neutro e de alta clareza' },
  ];

  const handleExportCurrent = async () => {
    setIsExportingCurrent(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await exportSlideAudioAsMp3({
        slideId: currentSlide.id,
        slideTitle: currentSlide.title,
        text: currentSlide.speakerScript,
        voiceName: selectedVoice,
        onProgress: (status) => setCurrentProgressText(status),
      });

      setSuccessMsg(`Arquivo "vertice_slide_${String(currentSlide.id).padStart(2, '0')}.mp3" baixado com sucesso!`);
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          'Falha ao gerar MP3. O servidor sintetizará o áudio em instantes.'
      );
    } finally {
      setIsExportingCurrent(false);
      setCurrentProgressText('');
    }
  };

  const handleExportAll = async () => {
    setIsExportingAll(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      for (let i = 0; i < SLIDES.length; i++) {
        const slide = SLIDES[i];
        setAllProgress({
          current: i + 1,
          total: SLIDES.length,
          title: slide.title,
        });

        await exportSlideAudioAsMp3({
          slideId: slide.id,
          slideTitle: slide.title,
          text: slide.speakerScript,
          voiceName: selectedVoice,
        });

        // Delay between batch calls
        await new Promise((r) => setTimeout(r, 600));
      }

      setSuccessMsg('Todos os 30 arquivos MP3 foram gerados e baixados com sucesso!');
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          'Erro ao exportar lote de MP3s.'
      );
    } finally {
      setIsExportingAll(false);
      setAllProgress({ current: 0, total: SLIDES.length, title: '' });
    }
  };

  const handleDownloadTxt = () => {
    const text = `# TRANSCRIÇÃO DE ÁUDIO & ROTEIRO COMPLETO DE APRESENTAÇÃO
VÉRTICE AUTOPEÇAS — VISÃO 2036
Projeto Integrado PRG100 (Entregas 1 e 2)
Integrantes: ${AUTHORS.join(', ')}
Docente: ${PROFESSOR} (${DATE_INFO})
Total de slides: 30 slides

${'='.repeat(70)}

` +
      SLIDES.map(
        (s) =>
          `SLIDE ${s.id} — ${s.title.toUpperCase()}\nSeção: ${s.partLabel}\n\nTRANSCRIÇÃO DE ÁUDIO:\n"${s.speakerScript}"\n\n`
      ).join('-'.repeat(50) + '\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcricao_audio_vertice_2036.txt';
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('Arquivo TXT baixado com sucesso!');
  };

  const handleCopyTxt = () => {
    const text = SLIDES.map(
      (s) => `[SLIDE ${s.id}: ${s.title}]\n${s.speakerScript}\n`
    ).join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2500);
  };

  const handlePrintPdf = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-400/20 to-teal-400/20 border border-sky-500/30 text-sky-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Central de Downloads Gratuitos
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-semibold">
                  100% Gratuito
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Baixe os áudios MP3, a apresentação em PDF, o roteiro em TXT ou o código do projeto.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('mp3')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'mp3'
                ? 'border-sky-400 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileAudio className="w-3.5 h-3.5" />
            <span>Áudios MP3</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'pdf'
                ? 'border-sky-400 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Slides em PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('txt')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'txt'
                ? 'border-sky-400 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Roteiro TXT</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'border-sky-400 text-sky-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código-Fonte</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: MP3 Audio */}
          {activeTab === 'mp3' && (
            <div className="space-y-4">
              {/* Active Slide Info Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                    Slide {currentSlide.id} de {SLIDES.length}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold truncate max-w-xs">
                    {currentSlide.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                  "{currentSlide.speakerScript}"
                </p>
              </div>

              {/* Voice Persona Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono mb-2">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>Perfil de Voz de Apresentação (Gemini TTS):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVoice(v.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedVoice === v.id
                          ? 'bg-sky-950/60 border-sky-400 text-sky-200 ring-1 ring-sky-500/30'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">{v.name}</span>
                        <Radio
                          className={`w-3.5 h-3.5 ${
                            selectedVoice === v.id ? 'text-sky-400' : 'text-slate-600'
                          }`}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">{v.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action 1: Export Current Slide */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Baixar Áudio do Slide Atual ({currentSlide.id})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Arquivo MP3 individual (128 kbps) para ensaio do slide.
                  </div>
                  {isExportingCurrent && currentProgressText && (
                    <div className="text-xs text-sky-400 font-mono mt-1 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{currentProgressText}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExportCurrent}
                  disabled={isExportingCurrent || isExportingAll}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-md shadow-sky-600/20"
                >
                  {isExportingCurrent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Baixar Slide Atual (.mp3)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action 2: Export All 30 Slides */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-emerald-400" />
                    <span>Baixar Todos os 30 Áudios da Apresentação</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Gera a pasta com todos os 30 arquivos MP3 nomeados e ordenados.
                  </div>

                  {isExportingAll && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>
                          Baixando slide {allProgress.current} de {allProgress.total}: {allProgress.title}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${(allProgress.current / allProgress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExportAll}
                  disabled={isExportingCurrent || isExportingAll}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-md shadow-emerald-600/20"
                >
                  {isExportingAll ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Baixando ({allProgress.current}/{allProgress.total})...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Baixar Todos (30 .mp3)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PDF Export */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Printer className="w-4 h-4" />
                  <span>Exportar Apresentação Completa em PDF</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O documento foi configurado com regras de quebra de página (CSS print rules) que formatam cada um dos 30 slides em tela cheia paisagem com cores nítidas e alta resolução.
                </p>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200">Como salvar:</div>
                  <div>1. Clique no botão verde abaixo <strong>"Gerar / Salvar PDF"</strong>.</div>
                  <div>2. Na janela de impressão, no campo <em>Destino</em>, selecione <strong>Salvar como PDF</strong>.</div>
                  <div>3. Marque a opção <em>Gráficos de segundo plano</em> para manter as cores originais.</div>
                </div>

                <button
                  onClick={handlePrintPdf}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Gerar / Salvar PDF (30 Slides)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TXT Transcription Export */}
          {activeTab === 'txt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Roteiro de Fala Completo (Transcrição)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Baixe o roteiro de fala oficial com a transcrição textual de todos os 30 slides, incluindo autores, professor, divisões em 3 partes e tempos de ensaio.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleDownloadTxt}
                    className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-sky-600/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Arquivo TXT</span>
                  </button>

                  <button
                    onClick={handleCopyTxt}
                    className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedTxt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedTxt ? 'Copiado para a Área de Transferência!' : 'Copiar Tudo'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Code Export */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Code2 className="w-4 h-4" />
                  <span>Onde baixar o Código-Fonte no Google AI Studio</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para baixar o projeto completo (React, Vite, TypeScript, Express, estilos e assets):
                </p>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-sky-400 font-bold">Passo 1:</span>
                    <span>Olhe para a <strong>barra superior do Google AI Studio</strong> (acima da tela da aplicação).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-sky-400 font-bold">Passo 2:</span>
                    <span>No canto superior direito, você verá os botões de <strong>"Export" / "GitHub"</strong> ou o ícone de três pontos <strong>`...`</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-sky-400 font-bold">Passo 3:</span>
                    <span>Clique em <strong>"Download ZIP"</strong> ou conecte ao seu GitHub para clonar o repositório. Não é cobrada nenhuma taxa.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Vértice Autopeças 2036 · PRG100</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
