import getCardDimensions from "./getCardDimensions";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius?: number,
  fill?: boolean,
  stroke?: boolean
) {
  if (typeof stroke == "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
}

const drawRect = (ctx: CanvasRenderingContext2D, box: [number, number, number, number]) => {
  //   const buildDetectedObjects = () => {
  // const detectionObjects: DetectionObject[] = [];
  // for (let i = 0; i < scores.length; i++) {
  //   const score = scores[i];
  //   if (score > threshold) {
  //     const bbox: [number, number, number, number] = [0, 0, 0, 0];
  //     const minY = boxes[i][0] * videoElement.offsetHeight;
  //     const minX = boxes[i][1] * videoElement.offsetWidth;
  //     const maxY = boxes[i][2] * videoElement.offsetHeight;
  //     const maxX = boxes[i][3] * videoElement.offsetWidth;
  //     bbox[0] = minX;
  //     bbox[1] = minY;
  //     bbox[2] = maxX - minX;
  //     bbox[3] = maxY - minY;
  //     detectionObjects.push({
  //       score: score.toFixed(4),
  //       bbox: bbox,
  //     });
  //   }
  // }
  //   };
  //Getting predictions
  //   const detections = buildDetectedObjects(scores, threshold, boxes);
  //   for (let i = 0; i < detections.length; i++) {
  //     const item = detections[i];
  //     const x = item["bbox"][0];
  //     const y = item["bbox"][1];
  //     const width = item["bbox"][2];
  //     const height = item["bbox"][3];
  //     // Draw the bounding box.
  //     ctx.strokeStyle = "#00FFFF";
  //     ctx.lineWidth = 4;
  //     ctx.strokeRect(x, y, width, height);
  //   }
  const { x, y, width, height } = getCardDimensions(box, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = "#00FFFF";
  ctx.lineWidth = 4;
  roundRect(ctx, x, y, width, height, 8);
};

export default drawRect;
