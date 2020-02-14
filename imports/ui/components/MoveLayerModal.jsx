import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { scaleX, scaleY, unScaleX, unScaleY } from '../../helpers/canvas';
import { MOVE_COMMAND } from '../../data/Commands';

export default MoveLayerModal = (props) => {
  const { isOpen, close, canvas, layer, mainLayer, sendCommand } = props;
  const [open, setOpen] = React.useState(false);
  const [x, setX] = React.useState(scaleX(mainLayer, canvas, layer.position.x));
  const [y, setY] = React.useState(scaleY(mainLayer, canvas, layer.position.y));

  if(isOpen && !open) {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    close();
  };

  const handleSubmit = () => {
    const params = [unScaleX(mainLayer, canvas, x), unScaleY(mainLayer, canvas, y)];
    sendCommand(MOVE_COMMAND, params);
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
          <span>Move Layer</span>
          <form noValidate autoComplete="off">
            <FormControl>
                <Typography id={"X Origin"} gutterBottom>X Origin</Typography>
                <Slider
                aria-labelledby={"X Origin"}
                valueLabelDisplay="auto"
                min={0}
                max={canvas.width}
                step={1}
                value={x}
                onChange={(event, value) => setX(value)} 
                />
            </FormControl>
            <FormControl>
                <Typography id={"Y Origin"} gutterBottom>Y Origin</Typography>
                <Slider
                aria-labelledby={"Y Origin"}
                valueLabelDisplay="auto"
                min={0}
                max={canvas.height}
                step={1}
                value={y}
                onChange={(event, value) => setY(value)} 
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
              Move
            </Button>
          </div>
        </div>
      </Modal>
  );
}