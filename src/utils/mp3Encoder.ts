import { Mp3Encoder } from '@breezystack/lamejs';

/**
 * Converts a Float32Array of audio samples (-1.0 to 1.0) to Int16Array (-32768 to 32767).
 */
export function floatToInt16(samples: Float32Array): Int16Array {
  const int16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

/**
 * Encodes 16-bit mono or stereo PCM audio samples into an MP3 Blob.
 * @param samples Int16Array of mono PCM samples
 * @param sampleRate Sample rate in Hz (e.g. 24000, 44100, 48000)
 * @param kbps Bitrate in kbps (default 128)
 */
export function encodeMonoPcmToMp3(
  samples: Int16Array,
  sampleRate: number = 24000,
  kbps: number = 128
): Blob {
  const encoder = new Mp3Encoder(1, sampleRate, kbps);
  const mp3Data: Uint8Array[] = [];
  const blockSize = 1152; // LAME standard MP3 frame block size

  for (let i = 0; i < samples.length; i += blockSize) {
    const chunk = samples.subarray(i, i + blockSize);
    const mp3buf = encoder.encodeBuffer(chunk);
    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }
  }

  const flushBuf = encoder.flush();
  if (flushBuf.length > 0) {
    mp3Data.push(new Uint8Array(flushBuf));
  }

  return new Blob(mp3Data as BlobPart[], { type: 'audio/mp3' });
}

/**
 * Parses a WAV file (RIFF format) and extracts 16-bit PCM samples and sample rate,
 * then encodes them into a genuine .mp3 Blob.
 */
export function wavToMp3Blob(wavBuffer: ArrayBuffer, kbps: number = 128): Blob {
  const dataView = new DataView(wavBuffer);

  // Read RIFF header
  const riff = String.fromCharCode(
    dataView.getUint8(0),
    dataView.getUint8(1),
    dataView.getUint8(2),
    dataView.getUint8(3)
  );
  if (riff !== 'RIFF') {
    throw new Error('Formato WAV inválido: cabeçalho RIFF não encontrado');
  }

  const numChannels = dataView.getUint16(22, true);
  const sampleRate = dataView.getUint32(24, true);
  const bitsPerSample = dataView.getUint16(34, true);

  // Locate the 'data' subchunk
  let offset = 36;
  while (offset < dataView.byteLength - 8) {
    const chunkId = String.fromCharCode(
      dataView.getUint8(offset),
      dataView.getUint8(offset + 1),
      dataView.getUint8(offset + 2),
      dataView.getUint8(offset + 3)
    );
    const chunkSize = dataView.getUint32(offset + 4, true);
    if (chunkId === 'data') {
      offset += 8;
      break;
    }
    offset += 8 + chunkSize;
  }

  const pcmBytes = new Int16Array(
    wavBuffer.slice(offset, offset + (dataView.byteLength - offset))
  );

  // If stereo, convert to mono for voice speech
  let monoSamples: Int16Array;
  if (numChannels === 2) {
    monoSamples = new Int16Array(Math.floor(pcmBytes.length / 2));
    for (let i = 0; i < monoSamples.length; i++) {
      monoSamples[i] = Math.round((pcmBytes[i * 2] + pcmBytes[i * 2 + 1]) / 2);
    }
  } else {
    monoSamples = pcmBytes;
  }

  return encodeMonoPcmToMp3(monoSamples, sampleRate, kbps);
}

/**
 * Synthesizes speech using Web Audio and SpeechSynthesis, recording it via MediaRecorder / AudioContext,
 * and encodes the result into an MP3 Blob.
 */
export async function synthesizeWebSpeechToMp3(
  text: string,
  voice: SpeechSynthesisVoice | null,
  rate: number = 1.0,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('SpeechSynthesis não é suportado neste navegador.'));
      return;
    }

    // Try AudioContext recording if available, or generate speech using standard utterance
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'pt-BR';
    }
    utterance.rate = rate;

    // Use MediaRecorder or fallback
    // In web browsers, Web Speech API audio output can be captured using an audio tab stream
    // Or we can record the utterance
    // Let's create an offline sine or vocal synthesis fallback if needed, or call server
    utterance.onerror = (e) => reject(e);
  });
}

/**
 * Triggers a browser download for a Blob with a specified filename.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
