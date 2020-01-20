import React from 'react';

const Dimensions = (props) => {
    const { imageData } = props;
    const { width, height } = imageData.dimensions;
    if(imageData && width && height) {
        return  <div className="dimensions">
                    <span>{`${width} x ${height}`}</span>
                </div>
    } else {
        return null;
    }
}

export default Dimensions;