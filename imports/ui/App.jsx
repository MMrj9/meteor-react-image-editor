import React, { Component } from 'react';
import UploadFile from './UploadFile.jsx';
import Editor from './Editor.jsx';
import Dimensions from './Dimensions.jsx';
import Selection from './Selection.jsx';
import { validateSelection } from '../helpers/selection';


const initialState = {
  file : null,
  commandHistory: [],
  currentCommandHistory: null,
  imageData: null,
  selection: {
    originX: 0,
    originY: 0,
    width: 0,
    height: 0,
  },
  imageDimensions: {
    width: null,
    height: null,
  },
  shouldRerender: false
}

class App extends Component {
  state = initialState;

  handleResize = () => {
    const { file } = this.state; 
    if(file) {
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

  setFile = (fileName, fileData) => {
    Meteor.call('file-upload', fileName, fileData, (err, file) => {
        const commandHistory = [{
          command: `fileUpload()`,
          file,
        }]
        const currentCommandHistory = 0;
        this.setState({file, commandHistory, currentCommandHistory});
        this.updateImageData();
    });
  }

  updateImageData = () => {
    Meteor.call('get-file-data', (err, imageData) => {
      this.setState({ imageData });
    })
  }

  sendCommand = (command, params) => {
    const { file, commandHistory, currentCommandHistory } = this.state; 
    Meteor.call('apply-command', file, command, params, (err, file) => {
      if(currentCommandHistory < commandHistory.length-1) {
        commandHistory.splice(currentCommandHistory+1, commandHistory.length-1);
      }
      const newCommandHistory = {
       command: `${command}(${params.map(param => `${param}`)})`,
       file,
      }
      commandHistory.push(newCommandHistory);
      this.setState({...initialState, file, commandHistory, currentCommandHistory: commandHistory.length-1});
      this.updateImageData();
    });
  }

  previous = () => {
    const { commandHistory, currentCommandHistory } = this.state;
    if(currentCommandHistory > 0) {
      const previousCommandHistoryIndex = currentCommandHistory - 1;
      const previousCommandHistory = commandHistory[previousCommandHistoryIndex];
      this.setState({file: previousCommandHistory.file, currentCommandHistory: previousCommandHistoryIndex});
      this.updateImageData(previousCommandHistory.file);
    }
  }

  next = () => {
    const { commandHistory, currentCommandHistory } = this.state;
    if(currentCommandHistory < (commandHistory.length-1)) {
      const nextCommandHistoryIndex = currentCommandHistory + 1;
      const nextCommandHistory = commandHistory[nextCommandHistoryIndex];
      this.setState({file: nextCommandHistory.file, currentCommandHistory: nextCommandHistoryIndex});
      this.updateImageData(nextCommandHistory.file);
    }
  }

  clear = () => {
    Meteor.call("delete-all-files");
    this.setState({
      ...initialState
    });
  }

  setImageDimensions = (img) => {
    const imageDimensions = {
        height:img.offsetHeight,
        width:img.offsetWidth
    }
    this.setState({imageDimensions});
  }

  setStateVariable = (variable, param = null, value) => {
      const { imageData } = this.state;
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
            const isValidSelection = validateSelection(stateVariable, imageData);
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
      file, 
      commandHistory, 
      currentCommandHistory, 
      imageData, 
      selection, 
      imageDimensions, 
      shouldRerender } = this.state; 
    return <div className="wrapper">
            <div className="editor">
              <Editor 
                file={file}
                sendCommand={this.sendCommand} 
                commandHistory={commandHistory} 
                currentCommandHistory={currentCommandHistory}
                next={this.next}
                previous={this.previous}
                clear={this.clear}
                imageData={imageData}
                setStateVariable={this.setStateVariable}/>
            </div>
            <div className="viewer">
              {!file 
              ? <UploadFile setFile={this.setFile}/> 
              : !shouldRerender 
              ? <div className="image-container">
                  <img 
                  src={`/images/${file}`} 
                  className="image" 
                  onLoad={(img) => this.setImageDimensions(img.target)}/> 
                  {imageData && imageDimensions && selection && <Selection selection={selection} imageData={imageData} imageDimensions={imageDimensions}/>}
                </div>
                : null}
              {imageData && <Dimensions imageData={imageData} imageDimensions={imageDimensions} />}
            </div>
           </div>
  }
}

export default App;
