# Meteor + React Image Editor

I created this open source platform to test effects/commands from several node.js image manipulation packages. Open Source Sandbox for image editing developers.
You don't need any db or image hosting service to run this project. Images are saved locally.
Its fairly use do add support to new node.js manipulation packages.

This project is currently under development.

![Screenshot](https://i.imgur.com/M3MBYAl.png)


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

- Install NodeJs (https://nodejs.org/en/download/)
- Install Meteor (https://www.meteor.com/install)
- Run
```
npm i
meteor
```

## Usage

You can upload an image and apply effects to it.
You have an history console where you can check the chain of effects that you applied. You can also navigate through that history.
You can download the generated image.

Current Support Features
- add text (text2png)
- TTF font support
- add image
- layer move
- layer delete
- layer resize (JIMP)
- flip (JIMP)
- brightness (JIMP)
- contrast (JIMP)
- opacity (JIMP)
- posterize (JIMP)
- dither565 (JIMP)
- greyscale (JIMP)
- invert (JIMP)
- normalize (JIMP)
- sepia (JIMP)
- rotate  (JIMP)
- gaussian blur (JIMP)
- blur (JIMP)
- crop (JIMP)
- autocrop (JIMP)
- resize (JIMP)
- face detection (face-api.js)

## Support

Please [open an issue](https://github.com/MMrj9/meteor-react-image-editor/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/MMrj9/meteor-react-image-editor/compare/).
