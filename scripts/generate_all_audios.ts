import fs from 'fs';
import path from 'path';
import { SLIDES } from '../src/data/slidesData';

/**
 * Splits text into sentence fragments <= 180 characters for TTS requests
 */
function splitIntoFragments(text: string, maxLen = 175): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [text];
  const fragments: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if (trimmed.length <= maxLen) {
      fragments.push(trimmed);
    } else {
      // Split by commas or spaces
      const parts = trimmed.split(/,\s+/);
      let curr = '';
      for (const p of parts) {
        if ((curr + ', ' + p).length <= maxLen) {
          curr = curr ? curr + ', ' + p : p;
        } else {
          if (curr) fragments.push(curr);
          curr = p;
        }
      }
      if (curr) fragments.push(curr);
    }
  }

  return fragments;
}

async function fetchFragmentAudio(text: string): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao obter áudio TTS para: "${text.slice(0, 30)}..."`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateSlideAudio(scriptText: string, slideId: number): Promise<Buffer> {
  const fragments = splitIntoFragments(scriptText);
  const audioBuffers: Buffer[] = [];

  for (const frag of fragments) {
    let retries = 3;
    let buf: Buffer | null = null;
    while (retries > 0) {
      try {
        buf = await fetchFragmentAudio(frag);
        break;
      } catch (e) {
        retries--;
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (buf) {
      audioBuffers.push(buf);
    }
    // Small throttle
    await new Promise((r) => setTimeout(r, 120));
  }

  return Buffer.concat(audioBuffers);
}

async function main() {
  const audioDir = path.resolve(process.cwd(), 'public', 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  console.log(`Gerando áudios completos em MP3 para todos os ${SLIDES.length} slides...`);

  const allSlideBuffers: Buffer[] = [];

  for (let i = 0; i < SLIDES.length; i++) {
    const slide = SLIDES[i];
    const padded = String(slide.id).padStart(2, '0');
    console.log(`[${i + 1}/${SLIDES.length}] Processando Slide ${slide.id}: "${slide.title}"...`);

    const slideAudio = await generateSlideAudio(slide.speakerScript, slide.id);
    const slideFilename = `vertice_slide_${padded}.mp3`;
    const slideFilePath = path.join(audioDir, slideFilename);
    fs.writeFileSync(slideFilePath, slideAudio);

    allSlideBuffers.push(slideAudio);
    console.log(`  -> Salvo: ${slideFilename} (${(slideAudio.length / 1024).toFixed(1)} KB)`);

    // Friendly delay
    await new Promise((r) => setTimeout(r, 200));
  }

  // Concatenate all 30 slides into a single master MP3
  console.log('\nConcatenando todos os 30 slides no arquivo mestre...');
  const masterBuffer = Buffer.concat(allSlideBuffers);
  const masterPath = path.join(audioDir, 'vertice_audio_completo_visao_2036.mp3');
  fs.writeFileSync(masterPath, masterBuffer);

  const totalMb = (masterBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`\nSUCESSO TOTAL!`);
  console.log(`Arquivo mestre criado: public/audio/vertice_audio_completo_visao_2036.mp3`);
  console.log(`Tamanho final: ${totalMb} MB`);
}

main().catch((err) => {
  console.error('Erro na geração dos áudios:', err);
  process.exit(1);
});
