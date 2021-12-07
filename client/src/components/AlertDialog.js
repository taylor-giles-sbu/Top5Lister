import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * 
 * @param {*} props
 *      open (Boolean) = Initial open state of dialog
 *      handleClose (function) = Callback to run when dialog is closed
 *      title (String) = The title of the dialog
 *      description (String) = The description of the dialog
 *      buttonText (String) = The text in the Close button for the dialog 
 *      onButtonClick (function) = Callback to run when dialog button is clicked
 * @returns
 */
export default function AlertDialog(props) {
//   const [open, setOpen] = React.useState(false);

  let open = props.open
  const close = () => {
      open = false
  }

  return (
    <div>
      <Dialog
        open={open}
        // onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onButtonClick} autoFocus>
            {props.buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}