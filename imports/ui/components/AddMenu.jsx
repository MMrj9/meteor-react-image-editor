import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

export default SimpleMenu = (props) => {
  const { openAddTextModal, file } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openTextModal = () => {
    openAddTextModal();
    setAnchorEl(null);
  }

  return (
    <div>
        <AddCircleOutlineIcon
        fontSize="large" 
        htmlColor={file ? "#fff" : "rgba(0, 0, 0, 0.26)"} 
        className={`toolbar-icon ${file ? "clickable" : ""}`}
        aria-controls="simple-menu" 
        aria-haspopup="true" 
        onClick={(event) => file && handleClick(event)}
        />
        <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        >
        <MenuItem onClick={openTextModal}>Text</MenuItem>
        </Menu>
    </div>
  );
}