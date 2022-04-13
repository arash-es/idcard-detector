import { Model } from '../types/index';
import { GraphModel, loadGraphModel } from '@tensorflow/tfjs-converter';
import { useState } from 'react';

let modelCache: Model = null;

const useLoadModel = (modelPath: string) => {
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState<GraphModel | null>(modelCache);
  const loadModel = async () => {
    if (model) {
      return Promise.resolve(model);
    }
    setLoading(true);
    try {
      const model = await loadGraphModel(modelPath, {
        onProgress: percentage => {
          setProgress(percentage * 100);
        },
      });
      modelCache = model;
      setModel(model);
      return Promise.resolve(model);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  };
  return {
    loadModel,
    isLoading,
    progress,
    model,
  };
};
export default useLoadModel;
