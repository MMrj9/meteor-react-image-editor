import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export default class UploadFile extends Component {
  state = {
    counter: 0,
  }

  onChangeHandler = (event) => {
    const { uploadFile } = this.props;
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      uploadFile(file.name, reader.result);
    };
    reader.readAsBinaryString(file);
  } 

  render() {
    return (
      <div>
        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            name="file" 
            accept="image/x-png,image/gif,image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => this.onChangeHandler(e)}
          />
        </Button>
      </div>
    );
  }
}
