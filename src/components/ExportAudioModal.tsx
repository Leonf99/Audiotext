import { useState } from 'react';
import { SlideData } from '../types';
import { SLIDES } from '../data/slidesData';
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
          'Falha ao gerar MP3. Verifique se o servidor backend está ativo com GEMINI_API_KEY.'
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

        // Delay between batch calls to allow downloads to settle
        await new Promise((r) => setTimeout(r, 600));
      }

      setSuccessMsg('Todos os 30 arquivos MP3 foram gerados e baixados com sucesso!');
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          'Erro ao exportar lote de MP3s. Verifique a conexão com o servidor.'
      );
    } finally {
      setIsExportingAll(false);
      setAllProgress({ current: 0, total: SLIDES.length, title: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Exportar Narração em MP3</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                  128 kbps Stereo
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Gere e baixe arquivos de áudio .mp3 da locução falada dos slides.
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Active Slide Info Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                  Slide {currentSlide.id} de {SLIDES.length}
                </span>
                <span className="text-xs text-slate-400 truncate max-w-xs">{currentSlide.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                "{currentSlide.speakerScript}"
              </p>
            </div>
          </div>

          {/* Voice Persona Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>Perfil de Voz de Apresentação (Gemini TTS):</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {voices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
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

          {/* Export Actions Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* Action 1: Export Current Slide */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Exportar Apenas o Slide Atual ({currentSlide.id})
                </div>
                <div className="text-[11px] text-slate-400">
                  Gera o arquivo <code className="text-sky-400 font-mono">vertice_slide_{String(currentSlide.id).padStart(2, '0')}_narracao.mp3</code>
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
                    <span>Gerando MP3...</span>
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
                  <span>Exportar Todos os 30 Slides em MP3</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Gera a pasta de áudios completa da apresentação PRG100 para ensaios e podcasts.
                </div>

                {isExportingAll && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        Processando slide {allProgress.current} de {allProgress.total}: {allProgress.title}
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
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 border border-slate-700"
              >
                {isExportingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Baixando Lote ({allProgress.current}/{allProgress.total})...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Baixar Todos (30 .mp3)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Áudio sintetizado a 24kHz / MP3 128 kbps</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
