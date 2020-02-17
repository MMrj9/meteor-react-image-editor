import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import { ADD_IMAGE_COMMAND } from '../../data/Commands';

export default AddImageModal = (props) => {
  const { isOpen, close, sendCommand } = props;
  const [open, setOpen] = React.useState(false);

  if(isOpen && !open) {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    close();
  };

  const onChangeHandler = (event) => {
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const data = {
          selectedCommand: ADD_IMAGE_COMMAND,
          fileName: file.name,
          fileData: reader.result
      }
      sendCommand(data);
      handleClose();
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
            <span>Add Image</span>
          </div>
          <form noValidate autoComplete="off">
            <Button
            variant="contained"
            component="label">
            Upload File
            <input
            type="file"
            name="file" 
            accept="image/x-png,image/gif,image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => onChangeHandler(e)}/>
            </Button>       
          </form>
          <div className="modal-actions">
            <Button 
              onClick={handleClose}
              variant="contained"
              color="secondary">
              Close
            </Button>
          </div>
        </div>
      </Modal>
  );
}