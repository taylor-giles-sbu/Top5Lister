import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import { Box, Button, Typography } from '@mui/material'
import HomeToolbar from './HomeToolbar'
import ListViewScreen from './ListViewScreen'
import List from '@mui/material/List';

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
    return (
        <Box   
            sx={{
            bgcolor: "primary.light",
            position: "absolute",
            width: "100%",
            height: "100%",
        }}>
            <HomeToolbar />
            <ListViewScreen />
            <Button>
                Hello
            </Button>
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