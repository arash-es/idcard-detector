import { useRef } from 'react';
import blobToBase64 from '../../../utils/base64/blobToBase64';
import { WebcamDimensions, WebcamRef } from '../types';

/* eslint-disable no-unused-vars */

const useReactWebcam = () => {
  const isCapturing = useRef(false);
  const webcamRef = useRef<WebcamRef>(null);
  const mediaRecorderRef = useRef<MediaRecorder>();
  const recordedChunks = useRef<Blob | null>(null);

  const captureImage = (screenshotDimensions?: WebcamDimensions) => {
    const result = webcamRef.current?.getScreenshot(screenshotDimensions);
    if (webcamRef.current?.onDataAvailable) {
      webcamRef.current.onDataAvailable(result as string);
    }
    return result;
  };

  const handleDataAvailable = async ({ data }: BlobEvent) => {
    if (data.size > 0) {
      recordedChunks.current = data;
      if (webcamRef.current?.onDataAvailable) {
        const base64 = await blobToBase64(data);
        webcamRef.current.onDataAvailable(base64, data);
      }
    }
  };

  const startCaptureVideo = () => {
    if (webcamRef.current && !isCapturing.current) {
      isCapturing.current = true;
      mediaRecorderRef.current = new MediaRecorder(
        webcamRef.current.stream as MediaStream,
        {
          ...(MediaRecorder.isTypeSupported('video/webm') && {
            mimeType: 'video/webm'
          })
        }
      );
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
      if (webcamRef.current.onCaptureStart) webcamRef.current.onCaptureStart();
    }
  };

  const stopCaptureVideo = () => {
    if (webcamRef.current && isCapturing.current) {
      mediaRecorderRef.current?.stop();
      isCapturing.current = false;
      if (webcamRef.current?.onCaptureStop) {
        webcamRef.current.onCaptureStop();
      }
    }
  };

  return {
    captureImage,
    startCaptureVideo,
    stopCaptureVideo,
    webcamRef
  };
};
export default useReactWebcam;
