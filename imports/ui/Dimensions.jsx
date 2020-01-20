import React from 'react';

const Dimensions = (props) => {
    const { imageData, imageDimensions } = props;
    if( imageData && 
        imageData.dimensions.width && 
        imageData.dimensions.height && 
        imageDimensions.width && 
        imageDimensions.height) {
        return  <div className="dimensions">
                    <span>{`${imageDimensions.width} x ${imageDimensions.height}`}</span>
                    <span>{`${imageData.dimensions.width} x ${imageData.dimensions.height}`}</span>
                </div>
    } else {
        return null;
    }
}

export default Dimensions;