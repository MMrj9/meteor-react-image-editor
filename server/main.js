import { Meteor } from 'meteor/meteor';
import fs from "fs";
import path from "path";
import Jimp from "jimp";

import "./ImagesServer";

const IMAGE_DIR_PATH = process.env['METEOR_SHELL_DIR'] + '/../../../public/.#images';

let imageData = {
  dimensions: {
    width: null,
    height: null
  }
}

Meteor.startup(function() {
  //Delete all files from image directory
  deleteAllFiles();
});

Meteor.methods({
  'file-upload': (fileName, fileData) => {
    try {
      fs.writeFileSync(`${IMAGE_DIR_PATH}/${fileName}`, fileData, 'binary');
      updateImageDimensions(fileName);
      return fileName;
    } catch(e) {
      console.log(e);
      return null;
    }
  },
  'get-file-data': async (fileName) => {
    if(fileName) {
      //Updatet current image data
      await updateImageDimensions(fileName);
    } 
    return imageData;
  },
  'delete-all-files': () => {
    deleteAllFiles();
  },
  'apply-command': async (fileName, command, params) => {
    const timestamp = (new Date()).getTime();
    const newFileName = await Jimp.read(`${IMAGE_DIR_PATH}/${fileName}`)
    .then(img => {
      const newFileName= `${timestamp}${fileName}`;
      switch (command) {
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
      console.error(err);
    });
    updateImageDimensions(newFileName);
    return newFileName;
  },
});


const updateImageDimensions = (fileName) => {
    Jimp.read(`${IMAGE_DIR_PATH}/${fileName}`)
    .then(img => {
      imageData.dimensions.width = img.bitmap.width;
      imageData.dimensions.height = img.bitmap.height;
      return imageData;
    })
    .catch(err => {
      console.error(err);
      return null;
    });
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