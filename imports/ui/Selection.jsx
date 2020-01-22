import React from 'react';
import { scaleSelectionToLoadedImageDimensions } from '../helpers/selection';

const Selection = (props) => {
    const { selection, imageDimensions, imageData } = props;
    if( selection && 
        !isNaN(selection.originX) &&
        !isNaN(selection.originY) &&
        !isNaN(selection.width) && 
        !isNaN(selection.height) && 
        imageDimensions &&
        !isNaN(imageDimensions.width) && 
        !isNaN(imageDimensions.height)) {
        const scaledSelection = scaleSelectionToLoadedImageDimensions(selection, imageDimensions, imageData)
        const style = {
            left: scaledSelection.originX,
            top: scaledSelection.originY,
            width: scaledSelection.width,
            height: scaledSelection.height
        }
        return  <div className="selection" style={style}></div>
    } else {
        return null;
    }
}

export default Selection;