import styles from "./LoadingProgress.module.css";
import { useLayoutEffect } from "react";

interface IProps {
  message: string;
  color?: string;
}

function Loading({ message, color = "#ffffff" }: IProps) {
  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--loading-color", color);
  }, [color]);
  return (
    <div className="grid place-items-center">
      <div className={styles["loader-5"]}>
        <span></span>
      </div>
      <p className="mt-4" style={{ color }}>
        {message}
      </p>
    </div>
  );
}

export default Loading;
