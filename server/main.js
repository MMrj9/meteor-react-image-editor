import { Meteor } from 'meteor/meteor';
import fs from "fs";
import path from "path";
import Jimp from "jimp";
import _ from "underscore";

import "./ImagesServer";
import { scaleSelectionToRealDimensions } from "../imports/helpers/selection";

const IMAGE_DIR_PATH = process.env['METEOR_SHELL_DIR'] + '/../../../public/.#images';

/*
* 
 {
  file: null
  imageData: {
    dimensions: {
      width: null,
      height: null
    }
  }
*/
let layers = []

Meteor.startup(function() {
  //Delete all files from image directory
  deleteAllFiles();
});

Meteor.methods({
  'file-upload': async (fileName, fileData) => {
    try {
      fs.writeFileSync(`${IMAGE_DIR_PATH}/${fileName}`, fileData, 'binary');
      const imageData = await getImageData(fileName);
      const newLayer = {
        file: fileName,
        imageData: {
          width: imageData.width,
          height: imageData.height,
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
  'apply-command': async (canvas, layer, command, params) => {
    const timestamp = (new Date()).getTime();
    const fileName = layer.file;
    const newFileName = await Jimp.read(`${IMAGE_DIR_PATH}/${fileName}`)
    .then(img => {
      const newFileName= `${timestamp}${fileName}`;
      switch (command) {
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
        default:
          break;
      }
      return newFileName;
    })
    .catch(err => {
      throw(err);
    });
    try {
      //The is a delay between JIMP write funcion finishing and the file being created
      let isFileCreated = false;
      while(!isFileCreated) {
        isFileCreated = fs.existsSync(`${IMAGE_DIR_PATH}/${newFileName}`);
      }

      const imageData = await getImageData(newFileName);
      const newLayer = {
        file: newFileName,
        imageData: {
          width: imageData.width,
          height: imageData.height,
        }
      }
      _.extend(_.findWhere(layers, { file: fileName }), newLayer);
    } catch(err) {
      throw(err);
    }
    return {layers,params};
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
      throw err;
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