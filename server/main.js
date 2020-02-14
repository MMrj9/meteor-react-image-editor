import { Meteor } from 'meteor/meteor';
import fs from "fs";
import path from "path";
import Jimp from "jimp";
import _ from "underscore";
import text2png from "text2png";
import Future from "fibers/future";

import "./ImagesServer";
import { scaleSelectionToRealDimensions } from "../imports/helpers/selection";

const IMAGE_DIR_PATH = process.env['METEOR_SHELL_DIR'] + '/../../../public/.#images';

/*
* 
 {
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
        const scale = canvas.width / secondaryLayer.imageData.width;
        data[index].resize(secondaryLayer.imageData.width*scale, secondaryLayer.imageData.height*scale);
        data[0].composite(data[index], secondaryLayer.position.x - (secondaryLayer.imageData.width*scale/2), secondaryLayer.position.y - (secondaryLayer.imageData.height*scale/2));
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
    let finalFileName, finalXOrigin, finalYOrigin;
    let addNewLayer = false;
    finalFileName = await Jimp.read(`${IMAGE_DIR_PATH}/${fileName}`)
    .then(img => {
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
          const text = params[0];
          newFileName= `${timestamp}.png`;
          addNewLayer = true;
          fs.writeFileSync(`${IMAGE_DIR_PATH}/${newFileName}`, text2png(text, {color: 'blue'}));
          break;
        case "move":
          finalXOrigin = params[0];
          finalYOrigin = params[1];
          newFileName = layer.file;
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
      //The is a delay between JIMP write funcion finishing and the file being created
      let isFileCreated = false;
      while(!isFileCreated) {
        isFileCreated = fs.existsSync(`${IMAGE_DIR_PATH}/${finalFileName}`);
      }
      const imageData = await getImageData(finalFileName);
      const mainLayerImageData = await getImageData(layers[0].file);
      const newLayer = {
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
        _.extend(_.findWhere(layers, { file: fileName }), newLayer);
      } else {
        layers.push(newLayer);
      }
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