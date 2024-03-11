import { config } from 'dotenv';
import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';

config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export default async function createTranslatedAudio(videoUrl: string, text: string): Promise<void> {
  const outputDir = './audios';
  const outputName = encodeURIComponent(videoUrl) + 'translated' + '.mp3';

  const outputPath = path.join(outputDir, outputName);

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(outputPath, buffer);
    console.log('Translated audio file created successfully:', outputPath);
  } catch (error) {
    console.error('Error creating translated audio:', error);
    throw error;
  }
}
