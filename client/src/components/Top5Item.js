import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Typography, Grid } from '@mui/material';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const item = props.item;
    const index = props.index;

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function handleUpdateItem(event) {
        store.editListItem(index, event.target.value);
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    let editStatus = false;
    if (store.isItemEditActive) {
        editStatus = true;
    }


    let numberSection =(store.listToEdit === null)
        ? (<Typography color="accent.main" noWrap variant="h5">
                {index+1}.
            </Typography>)
        : (<Box display="flex" m="auto" alignItems='center' sx={{ 
            p: 1,
            height: 40,
            borderRadius:"8px",
            backgroundColor:"accent.main"
            }}>
            {
            <Typography variant="h5">
                {index+1}.
             </Typography>
            }
        </Box>)

    let textSection = (store.listToEdit === null) 
        ? (<Typography color="accent.main" noWrap variant="h5">
                {item}
            </Typography>) 
        : (<Box display="flex" m="auto" alignItems='center' sx={{ 
            p: 1,
            height: 40,
            borderRadius:"8px",
            backgroundColor:"accent.main"
            }}>
            <TextField
                fullWidth
                onChange={handleUpdateItem}
                defaultValue={item}
            />
        </Box>)

    return (
        <ListItem
            sx={{ display: 'flex', p: 1 }}
            style={{ width: '100%' }}>

            <Grid px={1} container direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                <Grid item xs="auto">
                    {numberSection}
                </Grid>
                <Grid item xs>
                    {textSection}
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default Top5Item;