import { StatusCodes } from 'http-status-codes';
import path from 'path';
import process from 'process';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import createTranslatedAudio from '@/common/utils/createTranslatedAudio';
import downloadAudio from '@/common/utils/downloadAudio';
import downloadImage from '@/common/utils/downloadImage';
import getVideoMetadata from '@/common/utils/getVideoMetadata';
import ocr from '@/common/utils/ocr';
import translateAudio from '@/common/utils/translateAudio';
import { VideoDocument } from '@/routes/video/videoModel';
import { videoRepository } from '@/routes/video/videoRepository';
import { logger } from '@/server';

export const videoService = {
  create: async (videoUrl: string): Promise<any> => {
    try {
      const videoMetadata = await getVideoMetadata(videoUrl);

      if (!videoMetadata) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Failed to retrieve video metadata',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      await downloadAudio(videoUrl);
      const audioTranslated = await translateAudio(videoUrl);
      await createTranslatedAudio(videoUrl, audioTranslated.text);

      const createdVideo = await videoRepository.createAsync(
        videoUrl,
        videoMetadata.duration,
        videoMetadata.height,
        audioTranslated.text
      );

      await downloadImage(videoUrl, createdVideo?._id?.toString());
      const ocrResult = await ocr(createdVideo?._id?.toString());
      console.log('OCR RESULT: ' + ocrResult);

      await videoRepository.updateOcrResultByIdAsync(createdVideo?._id.toString(), ocrResult);

      if (!createdVideo) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Failed to create video',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return new ServiceResponse<VideoDocument>(
        ResponseStatus.Success,
        'Video created successfully',
        createdVideo,
        StatusCodes.CREATED
      );
    } catch (error) {
      const errorMessage = `Error creating video: ${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findAll: async (): Promise<ServiceResponse<VideoDocument[] | null>> => {
    try {
      const videos = await videoRepository.findAllAsync();
      if (!videos) {
        return new ServiceResponse(ResponseStatus.Failed, 'No videos found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<VideoDocument[]>(ResponseStatus.Success, 'Videos found', videos, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error finding all videos: ${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findAudioById: async (id: string): Promise<string> => {
    try {
      const video = await videoRepository.findByIdAsync(id);
      if (!video) {
        return 'Audio file not found';
      }
      const audioFileName = encodeURIComponent(video.url) + '.mp3';
      const audioFilePath = path.join(process.cwd(), 'audios', audioFileName);
      return audioFilePath;
    } catch (error) {
      const errorMessage = `Error finding video by ID: ${(error as Error).message}`;
      logger.error(errorMessage);
      return 'Internal Server Error';
    }
  },
  findTranslatedAudioById: async (id: string): Promise<string> => {
    try {
      const video = await videoRepository.findByIdAsync(id);
      if (!video) {
        return 'Audio file not found';
      }
      const audioFileName = encodeURIComponent(video.url) + 'translated' + '.mp3';
      const audioFilePath = path.join(process.cwd(), 'audios', audioFileName);
      return audioFilePath;
    } catch (error) {
      const errorMessage = `Error finding video by ID: ${(error as Error).message}`;
      logger.error(errorMessage);
      return 'Internal Server Error';
    }
  },
  findFirstFrameById: async (id: string): Promise<string> => {
    try {
      const video = await videoRepository.findByIdAsync(id);
      if (!video) {
        return 'Video file not found';
      }
      const imageFileName = encodeURIComponent(video._id) + '.png';
      const imageFilePath = path.join(process.cwd(), 'images', imageFileName);
      return imageFilePath;
    } catch (error) {
      const errorMessage = `Error finding video by ID: ${(error as Error).message}`;
      logger.error(errorMessage);
      return 'Internal Server Error';
    }
  },
};
