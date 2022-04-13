import { GraphModel } from '@tensorflow/tfjs-converter';
import { PixelData } from '@tensorflow/tfjs-core';

export type Model = GraphModel | null;

export type Video = HTMLVideoElement | null | undefined;
export interface DetectionObject {
  score: string;
  bbox: [number, number, number, number];
}

export type PredictionScores = number[];
export type PredictionBoxes = [number, number, number, number][];

export type OnDetectionEvent = (data: DetectionObject) => void;

export type DetectionTarget =
  | HTMLVideoElement
  | ImageData
  | HTMLImageElement
  | ImageBitmap
  | PixelData
  | HTMLCanvasElement;
