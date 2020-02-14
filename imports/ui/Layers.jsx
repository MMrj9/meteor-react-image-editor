import React from 'react';
import _ from "underscore";
import { scaleX, scaleY } from "../helpers/canvas";

const Layers = (props) => {
    const { layers, canvas, setCanvas } = props;
    if(_.isEmpty(layers)) {
        return null;
    }
    return layers.map((layer, index) => {
        return  <div key={index} className="layer" 
                style={{
                    position: index > 0 ? "absolute" : "relative" ,
                    zIndex: index, 
                    left: index > 0 ? scaleX(layers[0], canvas ,layer.position.x) : "",
                    top: index > 0 ? scaleY(layers[0], canvas ,layer.position.y) : ""
                }}>
                    <img 
                    key={layer.file}
                    src={`/images/${layer.file}`} 
                    className="image" 
                    onLoad={(img) => index===0 && setCanvas(img.target)}/> 
                </div>
    });
}

export default Layers;