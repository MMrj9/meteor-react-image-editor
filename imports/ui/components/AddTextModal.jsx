import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { FormLabel } from '@material-ui/core';
import { SketchPicker } from 'react-color';

import { ADD_TEXT_COMMAND } from '../../data/Commands';

export default AddTextModal = (props) => {
  const { isOpen, close, sendCommand } = props;
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [fontSize, setFontSize] = React.useState(30);
  const [color, setColor] = React.useState("#fff");
  const [fonts, setFonts] = React.useState([]);
  const [font, setFont] = React.useState("Futura");

  Meteor.call('get-fonts', function(error, getFontsResult) { 
    setFonts(getFontsResult);
  });

  if(isOpen && !open) {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    close();
  };

  const handleSubmit = () => {
    const data = {
      selectedCommand: ADD_TEXT_COMMAND,
      text, font: font === "Futura" ? null : font, fontSize, color, 
    }
    sendCommand(data);
    handleClose();
  };


  const onFontChangeHandler = (event) => {
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      Meteor.call('font-upload', file.name, reader.result, function(error, uploadFontResult) { 
        if (error) { 
          console.log('error', error); 
          return;
        } 
        setFonts(uploadFontResult);
      });
    };
    reader.readAsBinaryString(file);
  }
  
  return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        style={{display:'flex',alignItems:'center',justifyContent:'center'}}
      >
        <div className="modal add-modal">
          <div className="modal-header">
            <span>Add Text</span>
          </div>
          <form noValidate autoComplete="off">
            <TextField label="Text" InputLabelProps={{shrink: true}} value={text} onChange={(e) => setText(e.target.value)}/>
            <div className="flex-row">
              <div className="flex-column">
                <TextField label="Font Size (px)" type="number" InputLabelProps={{shrink: true}} value={fontSize} onChange={(e) => setFontSize(e.target.value)}/>
                <div className="flex-row">
                  <FormControl>
                    <InputLabel>Font</InputLabel>
                    <Select value={font} defaultValue="Futura" onChange={(e) => setFont(e.target.value)}>
                      <MenuItem value={"Futura"}>Futura</MenuItem>
                      {fonts.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button
                      className="link"
                      component="label">
                      Upload Font (.ttf)
                      <input
                      type="file"
                      accept=".ttf"
                      style={{ display: "none" }}
                      onChange={(e) => onFontChangeHandler(e)}/>
                  </Button> 
                </div>
              </div>
              <div className="flex-column">
                <FormLabel>Text Color</FormLabel>
                <SketchPicker name='color' color={color} onChange={color => setColor(color.hex)}/>  
              </div>
            </div>
          </form>
          <div className="modal-actions">
            <Button 
              onClick={handleClose}
              variant="contained"
              color="secondary">
              Close
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              color="primary">
              Add
            </Button>
          </div>
        </div>
      </Modal>
  );
}