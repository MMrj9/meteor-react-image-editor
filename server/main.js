import { Meteor } from 'meteor/meteor';
import fs from "fs";
import path from "path";
import Jimp from "jimp";
import _ from "underscore";
import text2png from "text2png";
import Future from "fibers/future";

import "./ImagesServer";
import { scaleSelectionToRealDimensions } from "../imports/helpers/selection";
import { getFileExtension, changeFileExtension, removeFileExtension } from "../imports/helpers/file";

import '@tensorflow/tfjs-node';
import * as nodeCanvas from 'canvas';
import * as faceapi from 'face-api.js';


const IMAGE_DIR_PATH = process.env['METEOR_SHELL_DIR'] + '/../../../public/.#images';
const FONT_DIR_PATH = process.env['METEOR_SHELL_DIR'] + '/../../../public/.#fonts';
const WEIGHTS_DIR_PATH = process.env['METEOR_SHELL_DIR'] + '/../../../server/weights';

/*
* 
 {
  id: null
  file: null
  imageData: {
      width: null,
      height: null
  }
  position {
    x: null,
    y: null
  }
*/
let layers = [];
let fonts = [];

Meteor.startup(function() {
  //Delete all files from image directory
  deleteAllFiles();
  //Update font list
  getFonts();
});

Meteor.methods({
  'file-upload': async (fileName, fileData) => {
    try {
      fs.writeFileSync(`${IMAGE_DIR_PATH}/${fileName}`, fileData, 'binary');
      const imageData = await getImageData(fileName);
      const newLayer = {
        id: 0,
        file: fileName,
        imageData: {
          width: imageData.width,
          height: imageData.height,
        },
        position: {
          x: 0,
          y: 0,
        }
      };
      layers = [];
      layers.push(newLayer);
      return layers;
    } catch(err) {
      throw(err);
    }
  },
  'get-file-data': async (fileName) => {
    if(fileName) {
      //Updatet current image data
      await getImageData(fileName);
    } 
    return imageData;
  },
  'delete-all-files': () => {
    deleteAllFiles();
  },
  'generate-final-file': async (canvas) => {
    const jimps = [];
    layers.forEach((layer) => {
      jimps.push(Jimp.read(`${IMAGE_DIR_PATH}/${layer.file}`));
    });

    const future = new Future();
    Promise.all(jimps).then(async () => {
      return Promise.all(jimps);
    }).then(async (data) => {
      const mainLayer = layers[0];
      data.forEach(async (d, index) => {
        if(index === 0) return;
        const secondaryLayer = layers[index];
        data[0].composite(data[index], secondaryLayer.position.x, secondaryLayer.position.y);
      })
    
      const timestamp = (new Date()).getTime();
      const fileName = mainLayer.file;
      let newFileName= `${timestamp}${fileName}`;
      data[0].write(`${IMAGE_DIR_PATH}/${newFileName}`, async () => {
        future.return(newFileName);
      });
    });
    future.wait();
    return future.value;
  },
  'apply-command': async (canvas, layer, command, params) => {
    const timestamp = (new Date()).getTime();
    const fileName = layer.file;
    let finalFileName, finalXOrigin, finalYOrigin, isDelete;
    let addNewLayer = false;
    finalFileName = await Jimp.read(`${IMAGE_DIR_PATH}/${fileName}`)
    .then(async (img) => {
      let newFileName= `${timestamp}${fileName}`;
      switch (command.name) {
        case "autocrop":
          img.autocrop().write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "crop":
          const selection = {
            originX: params[0],
            originY: params[1],
            width: params[2],
            height: params[3],
          }
          const scaledSelection = scaleSelectionToRealDimensions(canvas, layer.imageData, selection);
          img.crop(scaledSelection.originX, scaledSelection.originY, scaledSelection.width, scaledSelection.height).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          params = [scaledSelection.originX, scaledSelection.originY, scaledSelection.width, scaledSelection.height];
          break
        case "flip":
          img.flip(params[0], params[1]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "brightness":
          img.brightness(params[0]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "contrast":
          img.contrast(params[0]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "posterize":
          img.posterize(params[0]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "opacity":
          newFileName = getFileExtension(newFileName) !== "png" ? changeFileExtension(newFileName, "png") : newFileName;
          img.opacity(params[0]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "dither565":
          img.dither565().write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "greyscale":
          img.greyscale().write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "invert":
          img.invert().write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "normalize":
          img.normalize().write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "sepia":
          img.sepia().write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "rotate":
          img.rotate(params[0]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "gaussian":
          img.gaussian(params[0]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "blur":
          img.blur(params[0]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break
        case "add_text":
          newFileName= `${timestamp}.png`;
          addNewLayer = true;
          if(params[1] === "Futura") {
            fs.writeFileSync(`${IMAGE_DIR_PATH}/${newFileName}`, 
            text2png(params[0], { 
              font: `${params[2]}px Futura`, 
              color: params[3],}));
          } else {
            fs.writeFileSync(`${IMAGE_DIR_PATH}/${newFileName}`, 
            text2png(params[0], { 
              font: `${params[2]}px ${params[1]}`, 
              color: params[3], 
              localFontPath: params[1] ? `${FONT_DIR_PATH}/${params[1]}.ttf` : null, 
              localFontName:  params[1] ? params[1] : null}));
          }
          break;
        case "add_image":
          newFileName= `${timestamp}${params[0]}`;
          addNewLayer = true; 
          fs.writeFileSync(`${IMAGE_DIR_PATH}/${newFileName}`, params[1], 'binary');
          params[1] = "fileData";
          break;
        case "move":
          finalXOrigin = params[0];
          finalYOrigin = params[1];
          newFileName = layer.file;
          break;
        case "delete":
          isDelete = true;
          break;
        case "resize":
          img.resize(params[0], params[1]).write(`${IMAGE_DIR_PATH}/${newFileName}`);
          break;
        case "face_detection":
          const { Canvas, Image, ImageData } = nodeCanvas;
          faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
          const faceDetectionNet = faceapi.nets.ssdMobilenetv1;
          const minConfidence = 0.5
          const SsdMobilenetv1Options = new faceapi.SsdMobilenetv1Options({ minConfidence })
          await faceDetectionNet.loadFromDisk(WEIGHTS_DIR_PATH);
          const img = await nodeCanvas.loadImage(`${IMAGE_DIR_PATH}/${layer.file}`);
          const detections = await faceapi.detectAllFaces(img, SsdMobilenetv1Options);
          const out = faceapi.createCanvasFromMedia(img);
          faceapi.draw.drawDetections(out, detections);
          fs.writeFileSync(`${IMAGE_DIR_PATH}/${newFileName}`, out.toBuffer('image/jpeg'));
          break;
        default:
          break;
      }
      return newFileName;
    })
    .catch(err => {
      throw(err);
    });

    try {
      if(isDelete) {
        layers = _.without(layers, _.findWhere(layers, {
          file: fileName
        }));
        return {layers, params};
      }

      //The is a delay between JIMP write funcion finishing and the file being created
      let isFileCreated = false;
      while(!isFileCreated) {
        isFileCreated = fs.existsSync(`${IMAGE_DIR_PATH}/${finalFileName}`);
      }
      const imageData = await getImageData(finalFileName);
      const mainLayerImageData = await getImageData(layers[0].file);
      const newLayer = {
        id: addNewLayer ? layers.length : layer.id, 
        file: finalFileName,
        imageData: {
          width: imageData.width,
          height: imageData.height,
        },
        position: {
          x: finalXOrigin === undefined ? (mainLayerImageData.width/2) - (imageData.width/2) : finalXOrigin,
          y: finalYOrigin === undefined ? (mainLayerImageData.height/2) - (imageData.height/2) : finalYOrigin,
        }
      }

      if(fileName && !addNewLayer) {
        _.extend(_.findWhere(layers, { id: layer.id }), newLayer);
      } else {
        layers.push(newLayer);
      }
    } catch(err) {
      throw(err);
    }
    return {layers,params};
  },
  'font-upload': async (fileName, fileData) => {
    try {
      fs.writeFileSync(`${FONT_DIR_PATH}/${fileName}`, fileData, 'binary');
      const newFont = removeFileExtension(fileName);
      fonts.push(newFont);
      return fonts;
    } catch(err) {
      throw(err);
    }
  },
  'get-fonts': async () => {
    return fonts;
  },
});


const getImageData = async (fileName) => {
    const imageData = await Jimp.read(`${IMAGE_DIR_PATH}/${fileName}`)
    .then(img => {
      const imageData = {};
      imageData.width = img.bitmap.width;
      imageData.height = img.bitmap.height;
      imageData.originX = 0;
      imageData.originY = 0;
      return imageData;
    })
    .catch(err => {
      return getImageData(fileName);
    });
    return imageData;
}

const deleteAllFiles = () => {
    fs.readdir(IMAGE_DIR_PATH, (err, files) => {
      if (err) {
        fs.mkdirSync(IMAGE_DIR_PATH, { recursive: true });
      } else {
        for (const file of files) {
          fs.unlink(path.join(IMAGE_DIR_PATH, file), err => {
            if (err) throw err;
          });
        }
      }
    });
}

const getFonts = () => {
  fs.readdir(FONT_DIR_PATH, (err, files) => {
    files.forEach(file => {
      const font = removeFileExtension(file);
      fonts.push(font);
    });
  });
}