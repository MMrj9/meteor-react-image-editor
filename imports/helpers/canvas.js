const scaleX = (mainLayer, canvas, x) => {
    const scale = canvas.width / mainLayer.imageData.width;
    return Math.round(x * scale);
}

const scaleY = (mainLayer, canvas, y) => {
    const scale = canvas.height / mainLayer.imageData.height;
    return Math.round(y * scale);
}

const unScaleX = (mainLayer, canvas, x) => {
    const scale = canvas.width / mainLayer.imageData.width;
    return Math.round(x / scale);
}

const unScaleY = (mainLayer, canvas, y) => {
    const scale = canvas.height / mainLayer.imageData.height;
    return Math.round(y / scale);
}

export { scaleX, scaleY, unScaleX ,unScaleY };
