import { GraphModel } from '@tensorflow/tfjs-converter';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import SmartCamera from './components/SmartCamera/container/SmartCamera';
import { SmartCameraHandler } from './components/SmartCamera/types';
import { realtimeDetection } from '../../.';
import { DetectionObject } from '../../dist/types';

interface IProps {
  tfModel: GraphModel;
}

const threshold = 0.9999;

const Webcam: FunctionComponent<IProps> = ({ tfModel }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<SmartCameraHandler>(null);
  useEffect(() => {
    realtimeDetection(tfModel, webcamRef.current?.video)(console.log);
  }, []);
  return (
    <div className="w-144 h-108 rounded-2xl overflow-hidden relative">
      <SmartCamera ref={webcamRef} mirrored={false} visible={!imageSrc} />
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 z-10"
      />
      {imageSrc && (
        <img
          src={imageSrc}
          className={`w-full h-full absolute top-0 left-0 z-10 transition duration-300 ease-in-out`}
        />
      )}
    </div>
  );
};
export default Webcam;
