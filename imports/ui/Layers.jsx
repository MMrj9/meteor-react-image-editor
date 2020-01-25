import React from 'react';
import _ from "underscore";

const Layers = (props) => {
    const { layers, setCanvas } = props;
    if(_.isEmpty(layers)) {
        return null;
    }
    return layers.map((layer) => {
        return  <img 
                key={layer.file}
                src={`/images/${layer.file}`} 
                className="image" 
                onLoad={(img) => setCanvas(img.target)}/> 
    });
}

export default Layers;