import { forwardRef } from "react";
import Webcam, { WebcamProps } from "react-webcam";
import styles from "./SmartCamera.module.css";
import { FaceDetectionOptions, SmartCameraEvents, SmartCameraHandler } from "../types";
import useSmartCamera from "../hooks/useSmartCamera";

interface OwnProps {
  visible?: boolean;
  withFaceDetection?: boolean;
  overlay?: JSX.Element;
  loading?: JSX.Element;
  faceDetectionOptions?: Partial<FaceDetectionOptions>;
}

type Props = OwnProps & SmartCameraEvents & Partial<WebcamProps>;

const SmartCamera = forwardRef<SmartCameraHandler, Props>(
  (
    {
      onCaptureStart,
      onCaptureStop,
      onDataAvailable,
      onUserMedia,
      onUserMediaError,
      overlay,
      loading,
      visible = true,
      ...otherProps
    },
    forwardedRef
  ) => {
    const { webcamRef, isLoading, onUserMediaLoadError, onUserMediaLoad, webcamStyle, showOverlay } = useSmartCamera(forwardedRef, {
      onCaptureStart,
      onCaptureStop,
      onDataAvailable,
      onUserMediaError,
      onUserMedia,
    });
    return (
      <div className={[styles.webcam, !visible ? styles.hidden : ""].join(" ")}>
        {isLoading && loading}
        <Webcam
          mirrored
          playsInline
          screenshotFormat="image/jpeg"
          {...otherProps}
          style={webcamStyle}
          onUserMedia={onUserMediaLoad}
          onUserMediaError={onUserMediaLoadError}
          ref={webcamRef}
        />
        {showOverlay && <div className={styles.overlay}>{overlay}</div>}
      </div>
    );
  }
);

export default SmartCamera;
