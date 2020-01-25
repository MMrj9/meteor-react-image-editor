const scaleSelectionToRealDimensions = (canvas, imageData, selection) => {
    const scaleX = imageData.width/canvas.width;
    const scaleY = imageData.height/canvas.height;
    return {
        originX: Math.round(selection.originX * scaleX),
        originY: Math.round(selection.originY * scaleY),
        width: Math.round(selection.width * scaleX),
        height: Math.round(selection.height * scaleY)
    }
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