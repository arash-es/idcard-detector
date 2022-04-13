import { GraphModel } from '@tensorflow/tfjs-converter';
import { useEffect, useState } from 'react';
import { DetectionObject, Model } from '../types';
import { loadModel as modelLoader, realtimeDetection } from '../utils';

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

export const useRealtimeDetection = (
  model: Model,
  videoElement: HTMLVideoElement | undefined
) => {
  const [detectionData, setDetectionData] = useState<DetectionObject | null>(
    null
  );
  useEffect(() => {
    if (model && videoElement) {
      realtimeDetection(model, videoElement)(setDetectionData);
    }
  }, [model]);
  return detectionData;
};
