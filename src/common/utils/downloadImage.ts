import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

export default function downloadImage(videoUrl: string, id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = './images';
    const outputName = id + '.png';

    const outputPath = path.join(outputDir, outputName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    ffmpeg(videoUrl)
      .screenshots({
        timestamps: ['00:00:00'],
        filename: outputName,
        folder: outputDir,
      })
      .on('end', () => {
        console.log('Image downloaded successfully');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error downloading image:', err);
        reject(err);
      });
  });
}
