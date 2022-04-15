import rectFontSize from '../utils/Canvas/rectFontSIze';
import getCardDimensions from './getCardDimensions';

const drawError = (
  ctx: CanvasRenderingContext2D,
  box: [number, number, number, number],
  error: string | null
) => {
  if (error) {
    const { x, y, width, height } = getCardDimensions(
      box,
      ctx.canvas.width,
      ctx.canvas.height
    );
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const rtl = false;
    const font = `${rectFontSize(
      width,
      ctx.canvas.width,
      24,
      10
    )}px sans-serif`;
    ctx.font = font;
    ctx.fillStyle = '#000000';
    const paddingX = 16;
    const paddingY = 8;
    const textWidth = ctx.measureText(error).width + paddingX;
    const textHeight = parseInt(font, 10) + paddingY;
    ctx.fillRect(
      x + (width - textWidth) / 2,
      y + (height - textHeight) / 2,
      textWidth,
      textHeight
    );
    ctx.fillStyle = '#ffffff';
    ctx.fillText(
      error,
      x + width / 2 + (rtl ? paddingX / 2 : 0),
      y + height / 2
    );
  }
};
export default drawError;
