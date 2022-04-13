import {
  CSSProperties,
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { SmartCameraEvents, SmartCameraHandler } from '../types';
import useReactWebcam from './useReactWebcam';

/* eslint-disable no-unused-vars */

const useSmartCamera = (
  handlerRef: ForwardedRef<SmartCameraHandler>,
  events: SmartCameraEvents,
) => {
  const [userMediaLoading, setUserMediaLoading] = useState(true);
  const [userMediaError, setUserMediaError] = useState(false);

  const { webcamRef, startCaptureVideo, stopCaptureVideo, captureImage } =
    useReactWebcam();

  useEffect(() => {
    (function bindEventListeners() {
      const { onCaptureStop, onCaptureStart, onDataAvailable } = events;
      if (webcamRef.current) {
        webcamRef.current.onCaptureStart = onCaptureStart;
        webcamRef.current.onCaptureStop = onCaptureStop;
        webcamRef.current.onDataAvailable = onDataAvailable;
      }
    })();
  }, []);

  useImperativeHandle(
    handlerRef,
    () => ({
      startCapturing: startCaptureVideo,
      stopCapturing: stopCaptureVideo,
      captureImage,
      video: webcamRef.current?.video
    }),
    []
  );

  const onUserMediaLoad = useCallback(
    (stream: MediaStream) => {
      setUserMediaLoading(false);
      setUserMediaError(false);
      if (events.onUserMedia) events.onUserMedia(stream);
    },
    [events.onUserMedia]
  );

  const onUserMediaLoadError = useCallback(
    (_error: string | DOMException) => {
      setUserMediaLoading(false);
      setUserMediaError(true);
      if (events.onUserMediaError) events.onUserMediaError(_error);
    },
    [events.onUserMediaError]
  );

  const isLoading =
    !userMediaError && (userMediaLoading);

  const webcamStyle = useMemo<CSSProperties>(
    () => ({
      opacity: Number(!isLoading),
      visibility: isLoading ? 'hidden' : 'visible'
    }),
    [isLoading]
  );

  const showOverlay = !userMediaError && !isLoading;


  return {
    onUserMediaLoad,
    onUserMediaLoadError,
    isLoading,
    webcamRef,
    webcamStyle,
    showOverlay,
  };
};
export default useSmartCamera;
