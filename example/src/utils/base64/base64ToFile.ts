const base64ToFile = (dataUrl: string, filename: string, isPic = true) => {
  const arr = isPic ? dataUrl.split(',') : dataUrl.split(';');
  const base64 = isPic ? arr : dataUrl.split('base64,');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mime = isPic ? arr[0].match(/:(.*?);/)[0] : base64[0];
  const bstr = isPic ? atob(arr[1]) : atob(base64[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  // eslint-disable-next-line no-plusplus
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime
  });
};
export default base64ToFile;
