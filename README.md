# Meteor + React Image Editor

I created this open source platform to test effects from several node.js image manipulation packages.
You don't need any db or image hosting service to run this project. Images are saved locally.

This project is currently under development.

![Screenshot](https://imgur.com/I5xSt6z)


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

Current Support Effects
- flip (JIMP)
- brightness (JIMP)
- contrast (JIMP)
- dither565 (JIMP)
- greyscale (JIMP)
- invert (JIMP)
- normalize (JIMP)
- sepia (JIMP)
- rotate  (JIMP)
- gaussian blur (JIMP)
- blur (JIMP)




## Support

Please [open an issue](https://github.com/MMrj9/meteor-react-image-editor/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/MMrj9/meteor-react-image-editor/compare/).
