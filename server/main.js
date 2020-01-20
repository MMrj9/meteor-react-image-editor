import { Meteor } from 'meteor/meteor';
import fs from "fs";
import path from "path";
import Jimp from "jimp";
import { log } from 'util';

const IMAGE_DIR_PATH = process.env['METEOR_SHELL_DIR'] + '/../../../public/.#images';

Meteor.startup(function() {
  //Delete all files from image directory
  deleteAllFiles();
});

Meteor.methods({
  'file-upload': (fileName, fileData) => {
    try {
      fs.writeFileSync(`${IMAGE_DIR_PATH}/${fileName}`, fileData, 'binary');
      return fileName;
    } catch(e) {
      console.log(e);
      return null;
    }
  },
  'delete-all-files': () => {
    deleteAllFiles();
  },
  'apply-command': async (fileName, command, params) => {
    const timestamp = (new Date()).getTime();
    const newFile = await Jimp.read(`${IMAGE_DIR_PATH}/${fileName}`)
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
    return newFile;
  },
});

WebApp.connectHandlers.use(function(req, res, next) {
    var re = /^\/images\/(.*)$/.exec(req.url);
    if (re !== null) {
        var filePath = process.env.PWD + '/public/.#images/' + re[1];
        var data = fs.readFileSync(filePath);
        res.writeHead(200, {
                'Content-Type': 'image'
            });
        res.write(data);
        res.end();
    } else {
        next();
    }
});

const deleteAllFiles = () => {
  fs.readdir(IMAGE_DIR_PATH, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(IMAGE_DIR_PATH, file), err => {
        if (err) throw err;
      });
    }
  });
}