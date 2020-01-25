import React, { Component } from 'react';
import  _  from 'underscore';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Slider from '@material-ui/core/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import Clear from '@material-ui/icons/Clear';
import Download from '@material-ui/icons/GetApp';

import COMMANDS from '../data/Commands';
import { BOOLEAN, RANGE, SELECT } from '../data/CommandTypes';


export default class Editor extends Component {
  state = {
    selectedCommand: null,
  }

  UNSAFE_componentWillMount() {
    this.delayedCallback = _.debounce( (param, value) => {
      const { setStateVariable } = this.props;
      if(param.updateParent) {
        const result = setStateVariable(param.updateParent, param.name, value);
        if(result) {
          this.setState({ [param.name]: value });
        } 
      } else {
        this.setState({ [param.name]: value });
      }
    }, 1);
  }

  sendCommand = () => {
    const state = this.state;
    const { selectedCommand } = state;
    const { sendCommand } = this.props;
    const params = [];
    const clearStateParams = {};
    selectedCommand.params.forEach(param => {
      params.push(state[param.name] || param.defaultValue);
      clearStateParams[param.name] = param.defaultValue;
    });
    sendCommand(selectedCommand.name, params);
    this.setState(clearStateParams);
  }

  _renderForm = () => {
    const { file } = this.props;
    const { selectedCommand } = this.state;

    return <div className="form">
            {this._renderToolbar()}
            {!selectedCommand ? null : 
            <div>
              <Typography variant="h5">{selectedCommand.name}</Typography>
              <Typography variant="body2">{selectedCommand.description}</Typography>
              <br/>
              <FormGroup>
                {this._generateForm(selectedCommand.params)}
                <br/>
                <Button 
                  variant="contained" 
                  color="primary" 
                  disabled={!file}
                  onClick={() => this.sendCommand()}>Apply</Button>
              </FormGroup>
            </div>}
           </div>
  }

  _renderToolbar = () => {
      const { file, clear } = this.props;
      const { _renderCommandSelection, download } = this;
      return <div className="toolbar">
               <Clear
                  fontSize="large" 
                  htmlColor={file ? "#fff" : "rgba(0, 0, 0, 0.26)"} 
                  className={`toolbar-icon ${file ? "clickable" : ""}`} 
                  onClick={() => file && clear()}
                />
                <Download 
                  fontSize="large" 
                  htmlColor={file ? "#fff" : "rgba(0, 0, 0, 0.26)"} 
                  className={`toolbar-icon ${file ? "clickable" : ""}`} 
                  onClick={() => file && download()}
                />
                {_renderCommandSelection()}
             </div>
  }

  download = () => {
    const { file } = this.props;
    const a = document.createElement('a');
    a.href =`/images/${file.file}`;
    a.download = `/images/${file.file}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  _generateForm = (params) => {
    const state = this.state;
    return params.map((param) => {
      switch (param.type) {
        case BOOLEAN:
          return  <FormControlLabel
                    key={param.name}
                    label={param.name}
                    control={
                    <Checkbox 
                      checked={state[param.name] || param.defaultValue} 
                      value={param.name}
                      onChange={(event) => this.handleParamChange(param, event.target.checked, event)} 
                    />}
                  />
        case RANGE:
          return  <FormControl key={param.name}>
                    <Typography id={param.name} gutterBottom>
                      {param.name}
                    </Typography>
                    <Slider
                    key={param.name}    
                    aria-labelledby={param.name}
                    valueLabelDisplay="auto"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={state[param.name] || param.defaultValue}
                    onChange={(event, value) => this.handleParamChange(param, value, event)} 
                    />
                  </FormControl>
        case SELECT:
          return <FormControl key={param.name}>
                    <InputLabel id={param.name}>{param.name}</InputLabel>
                    <Select
                      labelId={param.name}
                      value={state[param.name] || param.defaultValue}
                      onChange={(event) => this.handleParamChange(param, event.target.value, event)}
                    >
                      {param.options.map((option) => {
                        return <MenuItem value={option.value}>{option.label}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
        default:
          break;
      }
    });
  }

  handleParamChange = (param, value, event) => {
    this.delayedCallback(param, value);
  };

  handleCommandChange = ( newCommand ) => {
    const { selectedCommand } = this.state;
    const clearParams = {};
    if(selectedCommand) {
      selectedCommand.params.forEach((param) => {
        clearParams[param.name] = null;
      });
    }
    this.setState({...clearParams, selectedCommand: newCommand});
  }

  _renderCommandSelection = () => {
    const { canvas } = this.props;   
    return <Autocomplete
            options={COMMANDS(canvas)}
            getOptionLabel={command => command.name}
            style={{ width: 250, marginLeft: "auto" }}
            renderInput={params => (
              <TextField {...params} label="Commands" variant="outlined" fullWidth />
            )}
            onChange={(event, newCommand) => this.handleCommandChange(newCommand)}
          />
  }

  _renderHistory = () => {
    const { commandHistory, currentCommandHistory, previous, next} = this.props;
    return <div className="history">
            <Paper elevation={0} className="history-console">
              {commandHistory.map((history, index) => {
                return <Typography key={index} className={index === currentCommandHistory ? "test" : ""}>{history.command}</Typography>
              })}
            </Paper>
            <div className="history-buttons">
              <Button
                variant="contained"
                color="primary"
                startIcon={<ChevronLeft/>}
                onClick={() => previous()}
              >Previous</Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ChevronRight/>}
                onClick={() => next()}
              >Next</Button>
            </div>
           </div>
  }

  render() {
    return <div className="commands">
            {this._renderForm()}
            {this._renderHistory()}
           </div>
  }
}

