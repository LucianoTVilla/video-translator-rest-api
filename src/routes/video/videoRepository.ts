import { VideoDocument } from './videoModel';
import { VideoModel } from './videoModel';

export const videoRepository = {
  Video: VideoModel,

  createAsync: async (
    url: string,
    duration: number,
    height: number,
    translation: string
  ): Promise<VideoDocument | null> => {
    try {
      const createdVideo = await videoRepository.Video.create({
        url: url,
        duration: duration,
        height: height,
        translation: translation,
      });
      return createdVideo;
    } catch (error) {
      console.error('Error creating video:', error);
      return null;
    }
  },

  findAllAsync: async (): Promise<VideoDocument[] | null> => {
    try {
      const videos = await videoRepository.Video.find();
      return videos;
    } catch (error) {
      console.error('Error finding all videos:', error);
      return null;
    }
  },

  findByIdAsync: async (id: string): Promise<VideoDocument | null> => {
    try {
      const video = await videoRepository.Video.findById(id);
      return video;
    } catch (error) {
      console.error('Error finding video by ID:', error);
      return null;
    }
  },

  updateOcrResultByIdAsync: async (id: string, ocrResult: string): Promise<VideoDocument | null> => {
    try {
      const updatedVideo = await videoRepository.Video.findByIdAndUpdate(id, { ocrResult: ocrResult }, { new: true });
      return updatedVideo;
    } catch (error) {
      console.error('Error updating OCR result by ID:', error);
      return null;
    }
  },
};
