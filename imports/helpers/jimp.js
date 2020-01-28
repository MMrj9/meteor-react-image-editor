import Jimp from "jimp";

const RESIZE_OPTIONS  = [
    { value: Jimp.RESIZE_NEAREST_NEIGHBOR, label: "RESIZE_NEAREST_NEIGHBOR" },
    { value: Jimp.RESIZE_BILINEAR, label: "RESIZE_BILINEAR" },
    { value: Jimp.RESIZE_BICUBIC, label: "RESIZE_BICUBIC" },
    { value: Jimp.RESIZE_HERMITE, label: "RESIZE_HERMITE" },
    { value: Jimp.RESIZE_BEZIER, label: "RESIZE_BEZIER" },
];

export { RESIZE_OPTIONS };