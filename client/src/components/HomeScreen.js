import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import { Grid } from '@mui/material'
import HomeToolbar from './HomeToolbar'
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
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                listCards
            }
            </List>;
    }
    return (
        <Grid container direction="column">
            <Grid item>
                <HomeToolbar/>
            </Grid>
            <Grid item>
                {listOfLists}
            </Grid>
        </Grid>
    )
}

export default HomeScreen;