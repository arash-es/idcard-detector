import { useEffect } from 'react';
import { useLoadModel } from '../../.';
import Loading from './components/LoadingProgress/LoadingProgress';
import Webcam from './Webcam';

function App() {
  const { loadModel, isLoading, model, progress } = useLoadModel(
    '/models/national_card/model.json'
  );
  useEffect(() => {
    loadModel();
  }, []);
  return (
    <div className="bg-gray-800 w-screen h-screen grid place-items-center text-white">
      {!isLoading && model ? (
        <Webcam tfModel={model} />
      ) : (
        <Loading message={`${progress}%`} />
      )}
    </div>
  );
}

export default App;
