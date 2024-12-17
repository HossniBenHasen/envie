import BwipJs from "bwip-js";

export const createQrcode = (text: string) => {
  const canvas = document.createElement("canvas");
  BwipJs.toCanvas(canvas, {
    bcid: "pdf417",
    text: text,
    scale: 2,
    height: 8,
    includetext: true,
    textxalign: "center"
  })

  const image = document.createElement('img');
  image.src = canvas.toDataURL('image/png');

  return image;
};