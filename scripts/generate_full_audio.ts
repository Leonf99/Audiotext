import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { Mp3Encoder } from '@breezystack/lamejs';
import dotenv from 'dotenv';
import { SLIDES } from '../src/data/slidesData';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERRO: GEMINI_API_KEY não encontrada nas variáveis de ambiente.');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Extracts 16-bit PCM samples from a WAV buffer (24kHz mono)
 */
function extractPcmFromWav(wavBuffer: Buffer): Int16Array {
  let offset = 36;
  while (offset < wavBuffer.length - 8) {
    const chunkId = wavBuffer.subarray(offset, offset + 4).toString('ascii');
    const chunkSize = wavBuffer.readUInt32LE(offset + 4);
    if (chunkId === 'data') {
      offset += 8;
      break;
    }
    offset += 8 + chunkSize;
  }

  const pcmLength = Math.floor((wavBuffer.length - offset) / 2);
  const pcm16 = new Int16Array(pcmLength);
  for (let i = 0; i < pcmLength; i++) {
    pcm16[i] = wavBuffer.readInt16LE(offset + i * 2);
  }
  return pcm16;
}

/**
 * Encodes an Int16Array of PCM samples to MP3 using lamejs
 */
function encodePcmToMp3(samples: Int16Array, sampleRate = 24000, kbps = 128): Buffer {
  const encoder = new Mp3Encoder(1, sampleRate, kbps);
  const mp3Chunks: Buffer[] = [];
  const blockSize = 1152;

  for (let i = 0; i < samples.length; i += blockSize) {
    const chunk = samples.subarray(i, i + blockSize);
    const mp3buf = encoder.encodeBuffer(chunk);
    if (mp3buf.length > 0) {
      mp3Chunks.push(Buffer.from(mp3buf));
    }
  }

  const flushBuf = encoder.flush();
  if (flushBuf.length > 0) {
    mp3Chunks.push(Buffer.from(flushBuf));
  }

  return Buffer.concat(mp3Chunks);
}

async function generateSlidePcm(text: string, slideId: number): Promise<Int16Array> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: text,
            speechMetadata: {
              style: 'Apresentador executivo e técnico em português do Brasil, claro, confiante e pausado.',
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error(`Nenhum áudio gerado para o slide ${slideId}`);
  }

  const wavBuffer = Buffer.from(base64Audio, 'base64');
  return extractPcmFromWav(wavBuffer);
}

async function main() {
  const outputDir = path.resolve(process.cwd(), 'public', 'audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Iniciando geração de áudio com Gemini TTS para todos os ${SLIDES.length} slides...`);

  const allPcmChunks: Int16Array[] = [];
  // 0.8 seconds of silence at 24kHz = 19,200 zero samples
  const silencePause = new Int16Array(19200);

  for (let i = 0; i < SLIDES.length; i++) {
    const slide = SLIDES[i];
    console.log(`[${i + 1}/${SLIDES.length}] Sintetizando Slide ${slide.id}: "${slide.title}"...`);

    let pcm: Int16Array | null = null;
    let retries = 3;
    while (retries > 0) {
      try {
        pcm = await generateSlidePcm(slide.speakerScript, slide.id);
        break;
      } catch (err: any) {
        retries--;
        console.warn(`Tentativa falhou para slide ${slide.id} (${err.message}). Tentativas restantes: ${retries}`);
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    if (!pcm) {
      console.error(`Falha permanente no slide ${slide.id}, pulando.`);
      continue;
    }

    allPcmChunks.push(pcm);
    allPcmChunks.push(silencePause);

    // Save individual slide MP3 as well!
    const slideMp3 = encodePcmToMp3(pcm, 24000, 128);
    const slideFilename = `vertice_slide_${String(slide.id).padStart(2, '0')}.mp3`;
    fs.writeFileSync(path.join(outputDir, slideFilename), slideMp3);

    // Rate-limit throttle: 350ms between API calls
    await new Promise((r) => setTimeout(r, 350));
  }

  // Concatenate all samples into single continuous presentation
  console.log('Concatenando amostras de áudio e codificando arquivo MP3 completo...');
  const totalLength = allPcmChunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const combinedPcm = new Int16Array(totalLength);
  let currentOffset = 0;
  for (const chunk of allPcmChunks) {
    combinedPcm.set(chunk, currentOffset);
    currentOffset += chunk.length;
  }

  const completeMp3Buffer = encodePcmToMp3(combinedPcm, 24000, 128);
  const masterFilename = 'vertice_audio_completo_visao_2036.mp3';
  const masterPath = path.join(outputDir, masterFilename);
  fs.writeFileSync(masterPath, completeMp3Buffer);

  const durationMin = (totalLength / 24000 / 60).toFixed(1);
  const sizeMb = (completeMp3Buffer.length / (1024 * 1024)).toFixed(2);

  console.log(`\nSUCESSO! Arquivo de áudio completo gerado em: ${masterPath}`);
  console.log(`Duração: ~${durationMin} minutos | Tamanho: ${sizeMb} MB | Formato: MP3 128 kbps 24kHz Mono`);
}

main().catch((err) => {
  console.error('Erro na execução do gerador:', err);
  process.exit(1);
});
