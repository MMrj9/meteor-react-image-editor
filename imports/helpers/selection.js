const scaleSelectionToLoadedImageDimensions = (selection, imageDimensions, imageData) => {
    const loadedImageDimensions = imageDimensions;
    const serverImageDimensions = imageData.dimensions;
    const scaleX = loadedImageDimensions.width/serverImageDimensions.width;
    const scaleY = loadedImageDimensions.height/serverImageDimensions.height;
    return {
        originX: selection.originX * scaleX,
        originY: selection.originY * scaleY,
        width: selection.width * scaleX,
        height: selection.height * scaleY,
    }
}

const validateSelection = (selection, imageData) => {
    const serverImageDimensions = imageData.dimensions;
    return contains(serverImageDimensions, selection);
}

const contains = (rect1, rect2) => {
    console.log("rect1.originX <= rect2.originX",rect1.originX <= rect2.originX);
    console.log("rect1.originY <= rect2.originY",rect1.originY <= rect2.originY);
    console.log("rect1.originX + rect1.width >= rect2.originX + rect2.width",rect1.originX + rect1.width >= rect2.originX + rect2.width);
    console.log("rect1.originY + rect1.height >= rect2.originY + rect2.height",rect1.originY + rect1.height >= rect2.originY + rect2.height);
    return  rect1.originX <= rect2.originX && 
            rect1.originY <= rect2.originY && 
            rect1.originX + rect1.width >= rect2.originX + rect2.width && 
            rect1.originY + rect1.height >= rect2.originY + rect2.height;
}

export { scaleSelectionToLoadedImageDimensions, validateSelection };