import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

import { videoService } from './videoService';

export const videoRouter = (() => {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      await videoService.create(url);
      res.status(StatusCodes.CREATED).json({ message: 'Video submited successfully' });
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  });

  // Ruta para obtener todos los videos
  router.get('/', async (req: Request, res: Response) => {
    try {
      const allVideos = await videoService.findAll();
      res.status(StatusCodes.OK).json(allVideos);
    } catch (error) {
      console.error('Error retrieving videos:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/audio/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const audio = await videoService.findAudioById(id);
      console.log(audio);
      if (!audio) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Audio not found' });
        return;
      }

      res.sendFile(path.resolve(audio));
    } catch (error) {
      console.error('Error retrieving audio by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/translated-audio/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const audio = await videoService.findTranslatedAudioById(id);
      console.log(audio);
      if (!audio) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Audio not found' });
        return;
      }

      res.sendFile(path.resolve(audio));
    } catch (error) {
      console.error('Error retrieving audio by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/first-frame/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const image = await videoService.findFirstFrameById(id);
      console.log(image);
      if (!image) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Image not found' });
        return;
      }

      res.sendFile(path.resolve(image));
    } catch (error) {
      console.error('Error retrieving image by ID:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  });

  return router;
})();
