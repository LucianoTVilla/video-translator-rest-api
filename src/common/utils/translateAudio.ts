import * as deepl from 'deepl-node';
import { config } from 'dotenv';
import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';

config();

export default async function translateAudio(videoUrl: string): Promise<any> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  const deeplKey = process.env.DEEPL_KEY || '';
  const translator = new deepl.Translator(deeplKey);
  try {
    const fileName = encodeURIComponent(videoUrl);
    const audiosDirectory = path.join('audios');
    const filePath = path.join(audiosDirectory, fileName + '.mp3');

    if (!fs.existsSync(filePath)) {
      throw new Error('Audios file does not exist');
    }

    const speechToTextResult = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
    });
    console.log(speechToTextResult);

    const translation = await translator.translateText(String(speechToTextResult), null, 'es');
    console.log(translation);
    return translation;
  } catch (error) {
    console.error('Translation Error', error);
    throw error;
  }
}
