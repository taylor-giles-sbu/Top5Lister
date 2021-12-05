import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Grid } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'transparent',
    boxShadow: 5,
    p: 4,
};

export default function MUIDeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
    }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.unmarkListForDeletion();
    }

    return (
        <Modal
            open={store.listMarkedForDeletion !== null}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    Delete the {name} Top 5 List?
                </header>
                <Grid container direction="row" spacing={2} id="confirm-cancel-container">
                    <Grid item xs />
                    <Grid item xs='auto'>
                        <Button
                            variant="outlined"
                            color="black"
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={handleCloseModal}
                        >Cancel</Button>
                    </Grid>
                    
                    <Grid item xs='auto'>
                        <Button
                            variant="contained"
                            color="accent"
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={handleDeleteList}
                        >Confirm</Button>
                    </Grid>
                </Grid>
            </div>
            </Box>
        </Modal>
    );
}