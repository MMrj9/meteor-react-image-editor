import React from 'react';
import Expand from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/icons/ExpandMore';
import Move from '@material-ui/icons/OpenWith';

const LayerSelection = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    const { layers, setSelectedLayer, selectedLayerIndex, openMoveLayerModal } = props;

    if(!expanded) {
        return <div className="expand" onClick={() => setExpanded(true)}>
                <span>Layers</span>
                <Expand/>
               </div>
    }

    const handleMoveAction = (index) => {
        setSelectedLayer(index);
        openMoveLayerModal();
    }

    return <>
            {layers.map((layer, index) => {
            return  <div key={index} className={`layer ${selectedLayerIndex === index ? "selected" : ""}`} onClick={() => setSelectedLayer(index)}>
                        <img src={`/images/${layer.file}`} className="image" />
                        <div className="actions">
                            {index > 0 ? <Move onClick={() => handleMoveAction(index)}/> : null}
                        </div>
                    </div>
            })}
            <div className="collapse" onClick={() => setExpanded(false)}>
                <span>Collapse</span>
                <Collapse/>
            </div>
            </>
}

export default LayerSelection;