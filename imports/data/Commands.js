import { BOOLEAN, RANGE, SELECT, STRING } from './ParamTypes';
import { RESIZE_OPTIONS } from '../helpers/jimp';

const COMMANDS = (canvas) => [
    {
      name: "autocrop",
      description: "Automatically crop same-color borders from image (if any).",
      params: []
    },
    {
      name: "crop",
      description: "Crop to the given region",
      params: [
        { name: "originX", type: RANGE, updateParent: "selection", defaultValue: 0, min: 0, max: canvas && canvas.width, step: 1 }, 
        { name: "originY", type: RANGE, updateParent: "selection", defaultValue: 0, min: 0, max: canvas && canvas.height, step: 1 }, 
        { name: "width", type: RANGE, updateParent: "selection", defaultValue: 0, min: 0, max: canvas && canvas.width, step: 1 }, 
        { name: "height", type: RANGE, updateParent: "selection", defaultValue: 0, min: 0, max: canvas && canvas.height, step: 1 },
      ]
    },
    {
      name: "flip",
      description: "Flip the image horizontally or vertically",
      params: [{ name: "horizontal", type: BOOLEAN, defaultValue: false},{ name: "vertical", type: BOOLEAN, defaultValue: false}]
    },
    {
      name: "rotate",
      description: "Rotate the image clockwise by a number of degrees. Optionally, a resize mode can be passed. If `false` is passed as the second parameter, the image width and height will not be resized.",
      params: [
        { name: "degress", type: RANGE, defaultValue: 0, min: 0, max: 360, step: 1 }, 
        { name: "mode", type: SELECT, defaultValue: false, 
          options: [
            { value: false, label: "Don't Resize" }, 
            { value: true, label: "Resize Default" },
            ...RESIZE_OPTIONS
        ]}
      ]
    },
    {
      name: "brightness",
      description: "Adjust the brighness by a value -1 to +1",
      params: [{ name: "value", type: RANGE, defaultValue: 0, min: -1, max: 1, step: 0.01 }]
    },
    {
      name: "contrast",
      description: "Adjust the contrast by a value -1 to +1",
      params: [{ name: "value", type: RANGE, defaultValue: 0, min: -1, max: 1, step: 0.001 }]
    },
    {
      name: "posterize",
      description: "Apply a posterize effect",
      params: [{ name: "value", type: RANGE, defaultValue: 0, min: 0, max: 50, step: 1 }]
    },
    {
      name: "dither565",
      description: "Ordered dithering of the image and reduce color space to 16-bits (RGB565)",
      params: []
    },
    {
      name: "greyscale",
      description: "Remove colour from the image",
      params: []
    },
    {
      name: "invert",
      description: "Invert the image colours",
      params: []
    },
    {
      name: "normalize",
      description: "Normalize the channels in an image",
      params: []
    },
    {
      name: "sepia",
      description: "Apply a sepia wash to the image",
      params: []
    },
    {
      name: "gaussian",
      description: "Gaussian blur the image by r pixels (VERY slow)",
      params: [{ name: "value", type: RANGE, defaultValue: 1, min: 1, max: 10, step: 1 }]
    },
    {
      name: "blur",
      description: "Fast blur the image by r pixels",
      params: [{ name: "value", type: RANGE, defaultValue: 1, min: 1, max: 100, step: 1 }]
    },
  ]

  const ADD_IMAGE_COMMAND = {
    name: "add_image",
    description: "Adds an image",
    params: [{ name: "fileName", type: STRING, defaultValue: ""},{ name: "fileData", type: STRING, defaultValue: ""}],
  }

  const ADD_TEXT_COMMAND = {
    name: "add_text",
    description: "Adds a text layer with the selected properties",
    params: [{ name: "text", type: STRING, defaultValue: ""}],
  }

  const MOVE_COMMAND = {
    name: "move",
    description: "Moves the selected layer to the give (x,y) origin",
    params: [{ name: "x", type: RANGE, defaultValue: 0},{ name: "y", type: RANGE, defaultValue: 0}],
  }

  const DELETE_COMMAND = {
    name: "delete",
    description: "Deletes the selected layer"
  }

  const RESIZE_COMMAND = {
    name: "resize",
    description: "Resizes the selected layer to the give dimensions",
    params: [{ name: "width", type: RANGE, defaultValue: 0}, { name: "heigh", type: RANGE, defaultValue: 0}],
  }

  export { COMMANDS, ADD_TEXT_COMMAND, MOVE_COMMAND, DELETE_COMMAND, RESIZE_COMMAND, ADD_IMAGE_COMMAND }