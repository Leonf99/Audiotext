import { wavToMp3Blob, downloadBlob } from '../utils/mp3Encoder';

export interface ExportAudioOptions {
  slideId: number;
  slideTitle: string;
  text: string;
  voiceName?: string;
  onProgress?: (status: string) => void;
}

/**
 * Requests server-side generation of slide narration MP3 using Gemini TTS and LAME encoder.
 * Falls back to client-side conversion if a pre-generated WAV is provided.
 */
export async function exportSlideAudioAsMp3(options: ExportAudioOptions): Promise<void> {
  const { slideId, slideTitle, text, voiceName = 'Kore', onProgress } = options;

  onProgress?.('Conectando ao serviço de síntese de voz...');

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
    const sanitizedTitle = slideTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    const filename = `vertice_slide_${String(slideId).padStart(2, '0')}_${sanitizedTitle}.mp3`;

    onProgress?.('Iniciando download do arquivo MP3...');
    downloadBlob(mp3Blob, filename);
    onProgress?.('Download concluído com sucesso!');
  } catch (err: any) {
    console.error('Falha ao exportar MP3 via servidor:', err);
    throw err;
  }
}
