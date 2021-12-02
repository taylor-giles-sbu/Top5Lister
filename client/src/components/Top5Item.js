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
    const [draggedTo, setDraggedTo] = useState(0);
    const [text, setText] = useState("");

    function handleDragStart(event, targetId) {
        event.dataTransfer.setData("item", targetId);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        console.log("entering");
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        console.log("leaving");
        setDraggedTo(false);
    }

    function handleDrop(event, targetId) {
        event.preventDefault();
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        console.log("handleDrop (sourceId, targetId): ( " + sourceId + ", " + targetId + ")");

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let index = event.target.id.substring("list-".length);
            let text = event.target.value;
            store.addUpdateItemTransaction(index-1, text);
            toggleEdit();
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function handleUpdateText(event) {
        setText(event.target.value);
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
    let { index } = props;

    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }


    let numberSection =(store.listToEdit === null)
        ? (<Typography color="accent.main" noWrap variant="h5">
                1.
            </Typography>)
        : (<Box display="flex" m="auto" alignItems='center' sx={{ 
            p: 1,
            height: 40,
            borderRadius:"16px",
            backgroundColor:"accent.main"
            }}>
            {
            <Typography variant="h5">
                1.
             </Typography>
            }
        </Box>)

    let textSection = (store.listToEdit === null) 
        ? (<Typography color="accent.main" noWrap variant="h5">
                Item
            </Typography>) 
        : (<Box display="flex" m="auto" alignItems='center' sx={{ 
            p: 1,
            height: 40,
            borderRadius:"16px",
            backgroundColor:"accent.main"
            }}>
            <TextField
                fullWidth
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
            />
        </Box>)

    return (
        <ListItem
            sx={{ display: 'flex', p: 1 }}
            style={{ width: '100%' }}>

            <Grid container direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                <Grid item xs="auto">
                    {numberSection}
                </Grid>
                <Grid item xs={10}>
                    {textSection}
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default Top5Item;