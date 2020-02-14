import React, { Component } from 'react';
import _ from "underscore";
import Snackbar from '@material-ui/core/Snackbar';

import Alert from './primitives/Alert';
import UploadFile from './UploadFile.jsx';
import Editor from './Editor.jsx';
import Dimensions from './Dimensions.jsx';
import Layers from './Layers.jsx';
import Selection from './Selection.jsx';
import LayerSelection from './LayerSelection.jsx';
import { MoveLayerModal } from './components';
import { validateSelection } from '../helpers/selection';


const initialState = {
  layers : [],
  selectedLayerIndex: null,
  commandHistory: [],
  currentCommandHistory: null,
  selection: {
    originX: 0,
    originY: 0,
    width: 0,
    height: 0,
  },
  canvas: {
    width: null,
    height: null,
  },
  shouldRerender: false,
  alert: null,
  isMoveLayerModalOpen: false,
}

class App extends Component {
  state = initialState;

  getSelectedLayer = () => {
    const { layers, selectedLayerIndex } = this.state; 
    if(!_.isEmpty(layers) && !isNaN(selectedLayerIndex)) {
      return layers[selectedLayerIndex];
    } 
    return null;
  }

  handleResize = () => {
    const { layers } = this.state; 
    if(!_.isEmpty(layers)) {
      this.setState({shouldRerender: true});
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentDidUpdate() {
    const { shouldRerender } = this.state; 
    if(shouldRerender) {
      this.setState({shouldRerender: false});
    }
  }

  uploadFile = (fileName, fileData) => {
    Meteor.call('file-upload', fileName, fileData, (err, layers) => {
        const commandHistory = [{
          command: `fileUpload(${fileName})`,
          layers,
        }]
        const currentCommandHistory = 0;
        const selectedLayerIndex = 0;
        this.setState({layers, commandHistory, currentCommandHistory, selectedLayerIndex });
    });
  }

  sendCommand = (command, params) => {
    const { commandHistory, currentCommandHistory, canvas, layers, selectedLayerIndex } = this.state; 
    Meteor.call('apply-command', canvas, this.getSelectedLayer(), command, params, (err, result) => {
      if(err) {
        this.setAlert(err.reason, "error");
      }
      if(currentCommandHistory < commandHistory.length-1) {
        commandHistory.splice(currentCommandHistory+1, commandHistory.length-1);
      }
      const resultLayers = result.layers;
      const resultParams = result.params;
      const newCommandHistory = {
       command: `${command.name}(${resultParams.map(param => `${param}`)})`,
       layers: resultLayers,
      }
      commandHistory.push(newCommandHistory);
      const newSelectedLayerIndex = resultLayers.length < layers.length ? 0 : selectedLayerIndex;
      this.setState({ layers: resultLayers, commandHistory, currentCommandHistory: commandHistory.length-1, selection: initialState.selection, selectedLayerIndex: newSelectedLayerIndex});
      this.setState({selection: {
        originX: 0,
        originY: 0,
        width: 0,
        height: 0,
      }})
    });
  }

  previous = () => {
    const { commandHistory, currentCommandHistory } = this.state;
    if(currentCommandHistory > 0) {
      const previousCommandHistoryIndex = currentCommandHistory - 1;
      const previousCommandHistory = commandHistory[previousCommandHistoryIndex];
      this.setState({layers: previousCommandHistory.layers, currentCommandHistory: previousCommandHistoryIndex});
    }
  }

  next = () => {
    const { commandHistory, currentCommandHistory } = this.state;
    if(currentCommandHistory < (commandHistory.length-1)) {
      const nextCommandHistoryIndex = currentCommandHistory + 1;
      const nextCommandHistory = commandHistory[nextCommandHistoryIndex];
      this.setState({layers: nextCommandHistory.layers, currentCommandHistory: nextCommandHistoryIndex});
    }
  }

  clear = () => {
    Meteor.call("delete-all-files");
    this.setState({
      ...initialState
    });
  }

  setCanvas = (img) => {
      const canvas = {
          width: img.offsetWidth,
          height: img.offsetHeight
      }
      this.setState({canvas});
  }

  setStateVariable = (variable, param = null, value) => {
      const { canvas } = this.state;
      const stateVariable  = this.state[variable];
      if(stateVariable) {
        if(param) {
          stateVariable[param] = value;
        } else {
          stateVariable = value;
        }
      }
      switch (variable) {
        case "selection":
            const isValidSelection = validateSelection(canvas, stateVariable);
            if(!isValidSelection) {
              return false;
            }
          break;
        default:
          break;
      }
      this.setState({[stateVariable]: stateVariable});
      return true;
  }

  setAlert = (message, severity) => {
    const alert = {message, severity};
    this.setState({alert});
  }
  

  render() {
    const { 
      layers, 
      selectedLayerIndex,
      commandHistory, 
      currentCommandHistory, 
      selection, 
      canvas, 
      shouldRerender,
      alert,
      isMoveLayerModalOpen } = this.state; 

    const selectedLayer = this.getSelectedLayer();
    return <div className="wrapper">
            <div className="editor">
              <Editor 
                file={selectedLayer}
                sendCommand={this.sendCommand} 
                commandHistory={commandHistory} 
                currentCommandHistory={currentCommandHistory}
                next={this.next}
                previous={this.previous}
                clear={this.clear}
                setStateVariable={this.setStateVariable}
                canvas={canvas}/>
            </div>
            <div className="viewer">
              {_.isEmpty(layers) 
              ? <UploadFile uploadFile={this.uploadFile}/> 
              : !shouldRerender 
              ? <div className="canvas" style={{width: canvas.width, height: canvas.height}}>
                  <div className="image-container">
                    <Layers layers={layers} canvas={canvas} setCanvas={this.setCanvas}/>
                    {selectedLayer && <Selection selection={selection} selectedLayer={selectedLayer} canvas={canvas}/>}
                  </div>
                </div>
                : null}
              {!_.isEmpty(layers) ?
              <div className="layer-selection">
                <LayerSelection 
                layers={layers} 
                selectedLayerIndex={selectedLayerIndex}
                setSelectedLayerIndex={(index) => this.setState({selectedLayerIndex: index})} 
                openMoveLayerModal={() => this.setState({isMoveLayerModalOpen: true})}
                sendCommand={this.sendCommand}/>
              </div> : null }
              {canvas && <Dimensions canvas={canvas} mainLayer={layers[0]}/>}
            </div>
            { alert ? 
            <Snackbar open={true} autoHideDuration={6000} onClose={this.setState({alert: null})}>
               <Alert onClose={this.setState({alert: null})} severity={alert.severity}>
                {alert.message}
               </Alert>
              </Snackbar> : null }
            { isMoveLayerModalOpen ? 
            <MoveLayerModal 
              isOpen={isMoveLayerModalOpen}
              close={() => this.setState({isMoveLayerModalOpen: false})} 
              canvas={canvas} 
              layer={selectedLayer}
              mainLayer={layers[0]}
              sendCommand={this.sendCommand}/> : null}
           </div>
  }
}

export default App;
