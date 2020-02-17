import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ADD_TEXT_COMMAND } from '../../data/Commands';

export default AddTextModal = (props) => {
  const { isOpen, close, sendCommand } = props;
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");

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
      text
    }
    sendCommand(data);
    close();
  };

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
            <TextField style={{minWidth: 200}} label="Text" value={text} onChange={(e) => setText(e.target.value)}/>
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