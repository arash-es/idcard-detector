import { FunctionComponent, useEffect, useRef, useState } from 'react';
import SmartCamera from './components/SmartCamera/container/SmartCamera';
import { SmartCameraHandler } from './components/SmartCamera/types';
import { RealtimeDetectionEngine } from '../../.';
import { DetectionObject } from '../../dist/types';
import pipeline from './utils/FP/pipeline';
import drawRect from './helpers/drawRect';
import drawTimer from './helpers/drawTimer';
import drawError from './helpers/drawError';
import getCardDimensions from './helpers/getCardDimensions';
import Loading from './components/LoadingProgress/LoadingProgress';

interface IProps {}

const threshold = 0.9999;

const Webcam: FunctionComponent<IProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<SmartCameraHandler>(null);
  const errorRef = useRef<string | null>(null);
  const imageSrcRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const captureTimer = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const clearError = () => {
    errorRef.current = null;
  };

  const setError = (message: string) => {
    errorRef.current = message;
    if (captureTimer.current || timerRef.current) {
      clearTimerInterval();
      clearCaptureTimerValue();
    }
  };

  const clearCaptureTimerValue = () => {
    captureTimer.current = null;
  };

  const clearTimerInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  };

  const clearImage = () => {
    setImageSrc(null);
    imageSrcRef.current = null;
  };

  const clearCanvasContext = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const reset = () => {
    clearImage();
    clearError();
    clearCaptureTimerValue();
    clearCanvasContext();
  };

  const prepareCanvas = () => {
    if (webcamRef.current?.video && canvasRef.current) {
      const videoElement = webcamRef.current?.video;
      const videoWidth =
        videoElement.parentElement?.getBoundingClientRect().width || 0;
      const videoHeight =
        videoElement.parentElement?.getBoundingClientRect().height || 0;
      videoElement.width = videoWidth;
      videoElement.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    return ctx;
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D | null | undefined) => (
    data: DetectionObject
  ) => {
    if (ctx) {
      drawRect(ctx, data.bbox);
      drawTimer(ctx, data.bbox, captureTimer.current);
      drawError(ctx, data.bbox, errorRef.current);
    }
    return data;
  };

  const validatePosition = (data: DetectionObject) => {
    const isCardObvious = () => {
      const parentWidth = canvasRef.current?.offsetWidth || 0;
      const parentHeight = canvasRef.current?.offsetHeight || 0;
      const { bbox: box } = data;
      const { height, width } = getCardDimensions(
        box,
        parentWidth,
        parentHeight
      );
      const cardArea = width * height;
      const parentArea = parentWidth * parentHeight;
      return (cardArea / parentArea) * 100 > 50;
    };
    if (!isCardObvious()) {
      setError('Move Card Closer');
    } else {
      clearError();
    }
    return data;
  };

  const zoomImage = (box: number[]) => {
    const parentWidth = canvasRef.current?.offsetWidth || 0;
    const parentHeight = canvasRef.current?.offsetHeight || 0;
    const { maxX, maxY, minX, minY, width, height } = getCardDimensions(
      box,
      parentWidth,
      parentHeight
    );
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(${(parentWidth * parentHeight) /
        (width * height) /
        10 +
        1})`;
      imageRef.current.style.transformOrigin = `${(maxX + minX) / 2}px ${(maxY +
        minY) /
        2}px`;
    }
  };

  const captureImageHandler = (data: DetectionObject) => {
    if (!timerRef.current && !imageSrcRef.current && !errorRef.current) {
      captureTimer.current = 3;
      timerRef.current = setInterval(() => {
        if (captureTimer.current === 1) {
          const image = webcamRef.current?.captureImage() as string;
          setImageSrc(image);
          zoomImage(data.bbox);
          imageSrcRef.current = image;
          clearTimerInterval();
          clearCaptureTimerValue();
        }
        (captureTimer.current as number) -= 1;
      }, 1000);
    }
    return data;
  };

  const detectionHandler = (data: DetectionObject) => {
    const canvasContext = prepareCanvas();
    if (+data.score > threshold) {
      pipeline(
        drawCanvas(canvasContext),
        validatePosition,
        captureImageHandler
      )(data);
    } else {
      pipeline(clearTimerInterval, clearError, clearCaptureTimerValue)(data);
    }
  };
  useEffect(() => {
    if (webcamRef.current?.video && !imageSrc) {
      const engine = new RealtimeDetectionEngine(webcamRef.current.video);
      engine.start(detectionHandler);
    }
  }, [imageSrc]);

  const cameraLoading = (
    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
      <Loading message="camera is loading" color="black" />
    </div>
  );

  return (
    <div className="w-144 h-108 rounded-2xl overflow-hidden relative">
      <SmartCamera ref={webcamRef} mirrored={false} loading={cameraLoading} />
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 z-10"
      />
      {imageSrc && (
        <img
          ref={imageRef}
          src={imageSrc}
          onClick={reset}
          className={`w-full h-full absolute top-0 left-0 z-10 transition duration-300 ease-in-out`}
        />
      )}
    </div>
  );
};
export default Webcam;
