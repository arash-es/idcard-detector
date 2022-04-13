const fixBase64Encode = (base64: string) => base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
export default fixBase64Encode;
