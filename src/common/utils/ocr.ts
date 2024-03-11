import path from 'path';
import Tesseract from 'tesseract.js';

export default function ocr(id: string): Promise<string> {
  const imageDir = './images';
  const imageName = id + '.png';

  const imagePath = path.join(imageDir, imageName);

  return new Promise((resolve, reject) => {
    Tesseract.recognize(imagePath, 'eng', { logger: (e) => console.log(e) })
      .then((out) => resolve(out.data.text))
      .catch((error) => reject(error));
  });
}
