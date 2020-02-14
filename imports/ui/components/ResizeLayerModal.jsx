import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { scaleX, scaleY, unScaleX, unScaleY } from '../../helpers/canvas';
import { RESIZE_COMMAND } from '../../data/Commands';

export default MoveLayerModal = (props) => {
  const { isOpen, close, canvas, layer, mainLayer, sendCommand } = props;
  const [open, setOpen] = React.useState(false);
  const [width, setWidth] = React.useState(scaleX(mainLayer, canvas, layer.imageData.width));
  const [height, setHeight] = React.useState(scaleY(mainLayer, canvas, layer.imageData.height));
  if(isOpen && !open) {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    close();
  };

  const handleSubmit = () => {
    const params = [unScaleX(mainLayer, canvas, width), unScaleY(mainLayer, canvas, height)];
    sendCommand(RESIZE_COMMAND, params);
  }

  return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        style={{display:'flex',alignItems:'center',justifyContent:'center'}}
      >
        <div className="modal move-layer-modal">
          <span>Resize Layer</span>
          <form noValidate autoComplete="off">
            <FormControl>
                <Typography id={"Width"} gutterBottom>Width</Typography>
                <Slider
                aria-labelledby={"Width"}
                valueLabelDisplay="auto"
                min={0}
                max={canvas.width}
                step={1}
                value={width}
                onChange={(event, value) => setWidth(value)} 
                />
            </FormControl>
            <FormControl>
                <Typography id={"Height"} gutterBottom>Height</Typography>
                <Slider
                aria-labelledby={"Height"}
                valueLabelDisplay="auto"
                min={0}
                max={canvas.height}
                step={1}
                value={height}
                onChange={(event, value) => setHeight(value)} 
                />
            </FormControl>
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
              Resize
            </Button>
          </div>
        </div>
      </Modal>
  );
}