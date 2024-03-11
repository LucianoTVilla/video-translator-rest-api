import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

export default function downloadAudio(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = './audios';
    const outputName = encodeURIComponent(videoUrl) + '.mp3';

    const outputPath = path.join(outputDir, outputName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    ffmpeg(videoUrl)
      .setStartTime(30)
      .setDuration(15)
      .output(outputPath)
      .outputOptions('-vn')
      .format('mp3')
      .on('end', () => {
        console.log('Audio extracted successfully');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error: ', err);
        reject(err);
      })
      .run();
  });
}
