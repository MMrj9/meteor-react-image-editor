import React from 'react';

const Selection = (props) => {
    const { selection, canvas } = props;
    console.log("selection", selection);
    if( selection && 
        !isNaN(selection.originX) &&
        !isNaN(selection.originY) &&
        !isNaN(selection.width) && 
        !isNaN(selection.height) && 
        !isNaN(canvas.width) && 
        !isNaN(canvas.height)) {
        const style = {
            left: selection.originX,
            top: selection.originY,
            width: selection.width,
            height: selection.height
        }
        return  <div className="selection" style={style}></div>
    } else {
        return null;
    }
}

export default Selection;