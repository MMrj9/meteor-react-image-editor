import React from 'react';

const Dimensions = (props) => {
    const { canvas } = props;
    if( canvas &&
        canvas.width && 
        canvas.height) {
        return  <div className="dimensions">
                    <span>{`${canvas.width} x ${canvas.height}`}</span>
                </div>
    } else {
        return null;
    }
}

export default Dimensions;