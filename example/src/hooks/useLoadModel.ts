import { useEffect, useState } from 'react';
import { Model, loadModel as modelLoader } from '../../../.';

const useLoadModel = (modelPath: string) => {
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState<Model>(null);

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

  useEffect(() => {
      loadModel()
  }, [])

  return {
    isLoading,
    progress,
    model,
  };
};

export default useLoadModel;
