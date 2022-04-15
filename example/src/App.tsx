import Loading from './components/LoadingProgress/LoadingProgress';
import useLoadModel from './hooks/useLoadModel';
import Webcam from './container/Webcam';

function App() {
  const { isLoading, progress } = useLoadModel(
    '/models/national_card/model.json'
  );
  return (
    <div className="bg-gray-800 w-screen h-screen grid place-items-center text-white">
      {!isLoading ? <Webcam /> : <Loading message={`${progress}%`} />}
    </div>
  );
}

export default App;
