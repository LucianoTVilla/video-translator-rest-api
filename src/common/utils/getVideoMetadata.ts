/* eslint-disable @typescript-eslint/no-var-requires */
import ffmpeg from 'fluent-ffmpeg';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export default async function getVideoMetadata(videoUrl: string): Promise<{ duration: number; height: number } | null> {
  console.log(videoUrl);
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoUrl, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration || 0;
        const height = metadata.streams.find((stream) => stream.codec_type === 'video')?.height || 0;
        resolve({ duration, height });
      }
    });
  });
}
