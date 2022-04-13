import { GraphModel } from '@tensorflow/tfjs-converter';
import { useState } from 'react';
import { loadModel as modelLoader } from '../utils';

export const useLoadModel = (modelPath: string) => {
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState<GraphModel | null>(null);

  const loadModel = async () => {
    try {
      setLoading(true);
      const model = await modelLoader(modelPath, percentage => {
        setProgress(percentage * 100);
      });
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
