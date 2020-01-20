import React, { Component } from 'react';
import UploadFile from './UploadFile.jsx';
import Editor from './Editor.jsx';

const initialState = {
  file : null,
  commandHistory: [],
  currentCommandHistory: null
}

class App extends Component {
  state = initialState;

  setFile = (fileName, fileData) => {
    Meteor.call('file-upload', fileName, fileData, (err, file) => {
      const commandHistory = [{
        command: `fileUpload()`,
        file,
      }]
      const currentCommandHistory = 0;
      this.setState({file, commandHistory, currentCommandHistory});
    });
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
      this.setState({file, commandHistory, currentCommandHistory: commandHistory.length-1});
    });
  }

  previous = () => {
    const { commandHistory, currentCommandHistory } = this.state;
    if(currentCommandHistory > 0) {
      const previousCommandHistoryIndex = currentCommandHistory - 1;
      const previousCommandHistory = commandHistory[previousCommandHistoryIndex];
      this.setState({file: previousCommandHistory.file, currentCommandHistory: previousCommandHistoryIndex});
    }
  }

  next = () => {
    const { commandHistory, currentCommandHistory } = this.state;
    if(currentCommandHistory < (commandHistory.length-1)) {
      const nextCommandHistoryIndex = currentCommandHistory + 1;
      const nextCommandHistory = commandHistory[nextCommandHistoryIndex];
      this.setState({file: nextCommandHistory.file, currentCommandHistory: nextCommandHistoryIndex});
    }
  }

  clear = () => {
    Meteor.call("delete-all-files");
    this.setState({
      ...initialState
    });
  }

  render() {
    const { file, commandHistory, currentCommandHistory} = this.state; 
    return <div className="wrapper">
            <div className="editor">
              <Editor 
                file={file}
                sendCommand={this.sendCommand} 
                commandHistory={commandHistory} 
                currentCommandHistory={currentCommandHistory}
                next={this.next}
                previous={this.previous}
                clear={this.clear}/>
            </div>
            <div className="viewer">
              {!file ? <UploadFile setFile={this.setFile}/> : <img src={`/images/${file}`} className="image"/>}
            </div>
           </div>
  }
}

export default App;
