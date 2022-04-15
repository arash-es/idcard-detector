const getCardDimensions = (box: number[], parentWidth: number, parentHeight: number) => {
  const minY = box[0] * parentHeight;
  const minX = box[1] * parentWidth;
  const maxY = box[2] * parentHeight;
  const maxX = box[3] * parentWidth;
  const x = minX;
  const y = minY;
  const width = maxX - minX;
  const height = maxY - minY;
  return {
    minY,
    minX,
    maxY,
    maxX,
    x,
    y,
    width,
    height,
  };
};

export default getCardDimensions;
