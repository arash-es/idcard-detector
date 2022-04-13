import { loadGraphModel } from '@tensorflow/tfjs-converter';
import { GraphModel } from '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs';
import {
  Model,
  DetectionObject,
  Video,
  DetectionTarget,
  PredictionBoxes,
  PredictionScores,
} from '../types/index';
import { OnProgressCallback } from '@tensorflow/tfjs-core/dist/io/types';

let modelCache: Model = null;

const prepareInput = async (target: DetectionTarget) => {
  const image = await tf.browser.fromPixelsAsync(target);
  const preparedImage = image.cast('int32').expandDims();
  return preparedImage;
};

export const detect = async (model: GraphModel, target: DetectionTarget) => {
  try {
    tf.engine().startScope();
    const input = await prepareInput(target);
    const predictions = (await model.executeAsync(input)) as tf.Tensor<
      tf.Rank
    >[];
    const data: DetectionObject = {
      bbox: ((await predictions[2].array()) as PredictionBoxes[])[0][0],
      score: `${((await predictions[3].array()) as PredictionScores[])[0][0]}`,
    };
    tf.engine().endScope();
    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const realtimeDetection = (model: Model, videoElement: Video) => {
  return function runDetection(onDetect: (data: DetectionObject) => void) {
    if (model && videoElement && videoElement.readyState === 4) {
      detect(model, videoElement).then(onDetect);
    }
    requestAnimationFrame(() => runDetection(onDetect));
  };
};

export const loadModel = async (
  path: string,
  onProgress: OnProgressCallback
) => {
  if (modelCache) {
    return Promise.resolve(modelCache);
  }
  await tf.setBackend('webgl');
  try {
    const model = await loadGraphModel(path, {
      onProgress,
    });
    modelCache = model;
    return Promise.resolve(model);
  } catch (e) {
    return Promise.reject(e);
  }
};
