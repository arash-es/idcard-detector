import getCardDimensions from "./getCardDimensions";

const drawTimer = (ctx: CanvasRenderingContext2D, box: [number, number, number, number], time: number | null) => {
  if (time) {
    const { x, y, width, height } = getCardDimensions(box, ctx.canvas.width, ctx.canvas.height);
    const font = "24px sans-serif";
    ctx.font = font;
    const textHeight = parseInt(font, 10);
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = textHeight;
    const circle = new Path2D(); // <<< Declaration
    circle.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000000";
    ctx.fill(circle);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${time}`, x + width / 2, y + height / 2);
  }
};
export default drawTimer;
