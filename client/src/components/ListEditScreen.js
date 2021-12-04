import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import { Box, Grid, Paper, TextField, Button } from '@mui/material'
import HomeToolbar from './HomeToolbar'
import List from '@mui/material/List';
import Top5Item from './Top5Item'

const ListEditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const list = store.listToEdit;

    function handleNameChange(event){
        store.editListName(event.target.value)
    }

    function handleSave() {
        store.updateEditedList();
    }

    function handlePublish(){

    }

    return (
        <Box sx={{
            left: "2.5%", 
            width: '95%', 
            p:2,
            borderRadius:"16px",
            backgroundColor:"complement.main",
            width:"90%"
        }}>
            <Grid width="95%" container spacing={2} direction="column" justifyContent="center" alignItems="stretch">
                <Grid item xs={1}>
                    <TextField
                        xs={1}
                        defaultValue={list.name}
                        variant="outlined"
                        label="List Name"
                        onChange={handleNameChange}
                    />
                </Grid>
                <Grid item xs>
                    <Box display="flex" xs sx={{ 
                        p:2,
                        borderRadius:"16px",
                        backgroundColor:"secondary.main",
                        width:"100%"
                        }}>
                        <List sx={{ width: '100%'}}>
                            <Top5Item index={0} item={list.items[0]}/>
                            <Top5Item index={1} item={list.items[1]}/>
                            <Top5Item index={2} item={list.items[2]}/>
                            <Top5Item index={3} item={list.items[3]}/>
                            <Top5Item index={4} item={list.items[4]}/>
                        </List>
                    </Box>
                </Grid>
                <Grid item container spacing={2} direction="row" justifyContent="space-between">
                    <Grid item xs />
                    <Grid item xs="auto">
                        <Button onClick={handleSave} color="primary" variant="contained">
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs="auto">
                        <Button onClick={handlePublish} color="primary" variant="contained">
                            Publish
                        </Button>
                    </Grid>
                    
                </Grid>
            </Grid>
        </Box>
    )
}

export default ListEditScreen;