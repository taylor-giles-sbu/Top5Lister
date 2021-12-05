import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import { Box, Button, Typography, Grid } from '@mui/material'
import HomeToolbar from './HomeToolbar'
import ListWrapper from './ListWrapper'
import List from '@mui/material/List';
import AddIcon from '@mui/icons-material/Add';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_HOME);
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listOfLists = "";
    if (store) {
        console.log(store.lists)
        let listCards = store.shownLists.map((list)  => (
                <ListCard
                    list={list}
                />
        ))
        listOfLists = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'transparent' }}>
            {
                listCards
            }
            </List>;
    }

    let footer = ""
    switch(store.currentTab){
        case HOMESCREEN_TAB_TYPE.TAB_HOME:
            footer = <Button 
            size="large" 
            color="black" 
            startIcon={<AddIcon/>}
            disabled={store.listToEdit!==null}
            onClick={handleCreateNewList}>
                Your Lists
            </Button>
            break;
        case HOMESCREEN_TAB_TYPE.TAB_LISTS: 
            footer = <Typography variant="h5" p={2}>
                All Lists
            </Typography>
            break;
        case HOMESCREEN_TAB_TYPE.TAB_USERS:
            footer = <Typography variant="h5" p={2}>
                All Lists
            </Typography>
            break;
        case HOMESCREEN_TAB_TYPE.TAB_COMMUNITY:
            footer = <Typography variant="h5" p={2}>
                Community Lists
            </Typography>
            break;
    }
    return (
        <Box
            m='auto'   
            justifyContent="center"
            sx={{
            bgcolor: "primary.light",
            position: "absolute",
            width: "100%",
            height: "100%",
        }}>
            <HomeToolbar />
            <ListWrapper />
            <Grid container justifyContent="center" alignItems="center">
                {footer}
            </Grid>
            <MUIDeleteModal/>

            {/* <Grid container direction="column" justifyContent="space-between">
                <Grid item xs={2}>
                    <HomeToolbar/>
                </Grid>
                <Grid item xs={10}>
                    <ListViewScreen />
                </Grid>
            </Grid> */}
        </Box>
        
        
    )
}

export default HomeScreen;