import React from 'react';
import Expand from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/icons/ExpandMore';
import Move from '@material-ui/icons/OpenWith';
import Delete from '@material-ui/icons/Delete';
import { DELETE_COMMAND } from '../data/Commands';

const LayerSelection = (props) => {
    const [expanded, setExpanded] = React.useState(false);
    const { layers, setSelectedLayerIndex, selectedLayerIndex, openMoveLayerModal, sendCommand } = props;

    if(!expanded) {
        return <div className="expand" onClick={() => setExpanded(true)}>
                <span>Layers</span>
                <Expand/>
               </div>
    }

    const handleMoveAction = (index) => {
        openMoveLayerModal();
    }

    const handleDeleteAction = (index) => {
        sendCommand(DELETE_COMMAND, []);
    }

    return <>
            {layers.map((layer, index) => {
            let isSelected = selectedLayerIndex === index;
            return  <div key={index} className={`layer ${selectedLayerIndex === index ? "selected" : ""}`} onClick={() => setSelectedLayerIndex(index)}>
                        <img src={`/images/${layer.file}`} className="image" />
                        <div className="actions">
                            {index > 0 ? <Move className={isSelected ? "" : "disabled"} onClick={() => isSelected && handleMoveAction(index)}/> : null}
                            {index > 0 ? <Delete className={isSelected ? "" : "disabled"} onClick={() => isSelected && handleDeleteAction(index)}/> : null}
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