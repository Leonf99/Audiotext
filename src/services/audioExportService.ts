import { wavToMp3Blob, downloadBlob } from '../utils/mp3Encoder';

export interface ExportAudioOptions {
  slideId: number;
  slideTitle: string;
  text: string;
  voiceName?: string;
  onProgress?: (status: string) => void;
}

/**
 * Downloads the complete, pre-generated master presentation MP3 file from the repository.
 */
export async function downloadFullMasterAudioMp3(onProgress?: (status: string) => void): Promise<void> {
  onProgress?.('Localizando áudio completo no repositório...');

  const masterUrl = '/audio/vertice_audio_completo_visao_2036.mp3';
  try {
    const response = await fetch(masterUrl);
    if (response.ok) {
      onProgress?.('Baixando apresentação de áudio completa (30 slides)...');
      const blob = await response.blob();
      downloadBlob(blob, 'vertice_audio_completo_visao_2036.mp3');
      onProgress?.('Download concluído com sucesso!');
      return;
    }
  } catch (e) {
    console.warn('Áudio estático não encontrado, tentando rota de API:', e);
  }

  // If static file is still generating, inform the user
  throw new Error('O arquivo de áudio mestre ainda está sendo gerado ou não foi encontrado.');
}

/**
 * Requests server-side generation of slide narration MP3 using Gemini TTS and LAME encoder.
 * First checks if a pre-generated slide audio already exists in /audio/vertice_slide_XX.mp3.
 */
export async function exportSlideAudioAsMp3(options: ExportAudioOptions): Promise<void> {
  const { slideId, slideTitle, text, voiceName = 'Kore', onProgress } = options;

  const paddedId = String(slideId).padStart(2, '0');
  const sanitizedTitle = slideTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const filename = `vertice_slide_${paddedId}_${sanitizedTitle}.mp3`;

  // 1. Try fetching existing pre-rendered static audio from the repo
  try {
    const staticUrl = `/audio/vertice_slide_${paddedId}.mp3`;
    const staticRes = await fetch(staticUrl);
    if (staticRes.ok && staticRes.headers.get('content-type')?.includes('audio')) {
      onProgress?.(`Baixando áudio do slide ${slideId} do repositório...`);
      const blob = await staticRes.blob();
      downloadBlob(blob, filename);
      onProgress?.('Download concluído com sucesso!');
      return;
    }
  } catch (err) {
    // Continue to API generation
  }

  onProgress?.('Sintetizando áudio de alta definição...');

  try {
    const response = await fetch('/api/tts/export-mp3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        slideNumber: slideId,
        voiceName,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(
        errJson?.message ||
          `Erro ${response.status} ao gerar áudio MP3 no servidor.`
      );
    }

    onProgress?.('Processando codificação MP3 128 kbps...');

    const mp3Blob = await response.blob();

    onProgress?.('Iniciando download do arquivo MP3...');
    downloadBlob(mp3Blob, filename);
    onProgress?.('Download concluído com sucesso!');
  } catch (err: any) {
    console.error('Falha ao exportar MP3 via servidor:', err);
    throw err;
  }
}
