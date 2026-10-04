import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Mp3Encoder } from '@breezystack/lamejs';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

/**
 * Encodes a 16-bit mono WAV buffer into MP3 format using lamejs
 */
function convertWavBufferToMp3(wavBuffer: Buffer, kbps: number = 128): Buffer {
  // WAV header parsing
  const riff = wavBuffer.subarray(0, 4).toString('ascii');
  if (riff !== 'RIFF') {
    throw new Error('Formato WAV inválido.');
  }

  const numChannels = wavBuffer.readUInt16LE(22);
  const sampleRate = wavBuffer.readUInt32LE(24);

  // Find 'data' subchunk
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

  const pcmLength = (wavBuffer.length - offset) / 2;
  const pcm16 = new Int16Array(pcmLength);
  for (let i = 0; i < pcmLength; i++) {
    pcm16[i] = wavBuffer.readInt16LE(offset + i * 2);
  }

  // Downmix to mono if stereo
  let monoSamples: Int16Array;
  if (numChannels === 2) {
    const monoLength = Math.floor(pcmLength / 2);
    monoSamples = new Int16Array(monoLength);
    for (let i = 0; i < monoLength; i++) {
      monoSamples[i] = Math.round((pcm16[i * 2] + pcm16[i * 2 + 1]) / 2);
    }
  } else {
    monoSamples = pcm16;
  }

  const encoder = new Mp3Encoder(1, sampleRate, kbps);
  const mp3Chunks: Buffer[] = [];
  const blockSize = 1152;

  for (let i = 0; i < monoSamples.length; i += blockSize) {
    const chunk = monoSamples.subarray(i, i + blockSize);
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

// Endpoint to generate and export TTS audio as .mp3 using Gemini TTS
app.post('/api/tts/export-mp3', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', slideNumber = 1 } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texto para síntese não informado.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'NO_API_KEY',
        message: 'Chave GEMINI_API_KEY não configurada no ambiente.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style:
                  'Apresentador executivo de engenharia automotiva em português do Brasil, claro, confiante e pausado.',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Nenhum áudio foi gerado pelo modelo.' });
    }

    const wavBuffer = Buffer.from(base64Audio, 'base64');
    const mp3Buffer = convertWavBufferToMp3(wavBuffer, 128);

    const filename = `vertice_slide_${String(slideNumber).padStart(2, '0')}_narracao.mp3`;

    res.setHeader('Content-Type', 'audio/mp3');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', mp3Buffer.length);
    return res.end(mp3Buffer);
  } catch (error: any) {
    console.error('Erro na rota /api/tts/export-mp3:', error);
    return res.status(500).json({
      error: 'TTS_GENERATION_FAILED',
      message: error?.message || 'Falha ao sintetizar áudio MP3.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
