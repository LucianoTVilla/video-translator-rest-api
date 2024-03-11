import { Document, Model, model, Schema } from 'mongoose';

export interface VideoDocument extends Document {
  url: string;
  duration: number;
  height: number;
  translation: string;
  ocrResult: string;
}

const VideoSchema: Schema = new Schema({
  url: { type: String, required: true },
  duration: { type: Number, required: true },
  height: { type: Number, required: true },
  translation: { type: String, required: true },
  ocrResult: { type: String },
});

export const VideoModel: Model<VideoDocument> = model<VideoDocument>('Video', VideoSchema);
