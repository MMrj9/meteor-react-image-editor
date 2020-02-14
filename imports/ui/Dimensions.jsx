import React from 'react';

const Dimensions = (props) => {
    const { canvas, mainLayer } = props;
    if( canvas &&
        canvas.width && 
        canvas.height) {
        return  <div className="dimensions">
                    <span>{`${canvas.width} x ${canvas.height}`}</span>
                    <span>{`${mainLayer.imageData.width} x ${mainLayer.imageData.height}`}</span>
                </div>
    } else {
        return null;
    }
}

export default Dimensions;