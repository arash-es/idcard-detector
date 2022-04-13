const rectFontSize = (width: number, maxWidth: number, maxFont: number, minFont: number) => {
  const fontSize = (width * maxFont) / maxWidth;
  return fontSize < minFont ? minFont : fontSize;
};
export default rectFontSize;
