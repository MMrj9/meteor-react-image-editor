import React, { Component } from 'react';
import _ from "underscore";

import UploadFile from './UploadFile.jsx';
import Editor from './Editor.jsx';
import Dimensions from './Dimensions.jsx';
import Layers from './Layers.jsx';
import Selection from './Selection.jsx';
import { validateSelection } from '../helpers/selection';


const initialState = {
  layers : [],
  selectedLayer: null,
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
  shouldRerender: false
}

class App extends Component {
  state = initialState;

  getSelectedLayer = () => {
    const { layers, selectedLayer } = this.state; 
    return layers[selectedLayer];
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
        const selectedLayer = 0;
        this.setState({layers, commandHistory, currentCommandHistory, selectedLayer });
    });
  }

  sendCommand = (command, params) => {
    const { commandHistory, currentCommandHistory, canvas } = this.state; 
    Meteor.call('apply-command', canvas, this.getSelectedLayer(), command, params, (err, result) => {
      if(currentCommandHistory < commandHistory.length-1) {
        commandHistory.splice(currentCommandHistory+1, commandHistory.length-1);
      }
      const { layers, params } = result;
      const newCommandHistory = {
       command: `${command}(${params.map(param => `${param}`)})`,
       layers,
      }
      commandHistory.push(newCommandHistory);
      this.setState({ layers, commandHistory, currentCommandHistory: commandHistory.length-1, selection: initialState.selection });
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
        height: img.offsetHeight,
        width: img.offsetWidth
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

  render() {
    const { 
      layers, 
      commandHistory, 
      currentCommandHistory, 
      selection, 
      canvas, 
      shouldRerender } = this.state; 
    

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
                    <Layers layers={layers} setCanvas={this.setCanvas}/>
                    {selectedLayer && <Selection selection={selection} selectedLayer={selectedLayer} canvas={canvas}/>}
                  </div>
                </div>
                : null}
              {canvas && <Dimensions canvas={canvas}/>}
            </div>
           </div>
  }
}

export default App;
