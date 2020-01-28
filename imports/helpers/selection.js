const scaleSelectionToRealDimensions = (canvas, imageData, selection) => {
    const scaleX = imageData.width/canvas.width;
    const scaleY = imageData.height/canvas.height;
    const originX = Math.round(selection.originX * scaleX);
    const originY = Math.round(selection.originY * scaleY);
    let width = Math.round(selection.width * scaleX);
    let height = Math.round(selection.height * scaleY);
    width = originX + width > imageData.originX + imageData.width ? imageData.originX + imageData.width : width;
    height = originY + height > imageData.originY + imageData.height ? imageData.originY + imageData.height : height;
    return {originX, originY, width, height};
}

const validateSelection = (canvas, selection) => {
    canvas.originX = 0;
    canvas.originY = 0;;
    return contains(canvas, selection);
}

const contains = (rect1, rect2) => {
    return  rect1.originX <= rect2.originX && 
            rect1.originY <= rect2.originY && 
            rect1.originX + rect1.width >= rect2.originX + rect2.width && 
            rect1.originY + rect1.height >= rect2.originY + rect2.height;
}

export { validateSelection, scaleSelectionToRealDimensions };