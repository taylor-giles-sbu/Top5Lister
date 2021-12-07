import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE } from '../store'
import MUIDeleteModal from './MUIDeleteModal'
import { Box, Button, Typography, Grid } from '@mui/material'
import AuthContext from '../auth'
import HomeToolbar from './HomeToolbar'
import ListWrapper from './ListWrapper'
import AddIcon from '@mui/icons-material/Add';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = (props) => {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    
    useEffect(() => {
        if(auth.isGuest()){
            store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_COMMUNITY);
        } else {
            store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_HOME);
        }
    }, []);
    
    

    function handleCreateNewList() {
        store.createNewList();
    }

    let footer = ""
    switch(store.currentTab){
        case HOMESCREEN_TAB_TYPE.TAB_HOME:
            footer = <Button 
            size="large" 
            color="black" 
            startIcon={<AddIcon/>}
            disabled={store.listToEdit!==null || auth.isGuest()}
            onClick={handleCreateNewList}>
                Your {store.searchObj.param} Lists
            </Button>
            break;
        case HOMESCREEN_TAB_TYPE.TAB_LISTS: 
            let listsText = (store.searchObj.param.length > 0) ? store.searchObj.param : "All"
            footer = <Typography variant="h5" p={2}>
                {listsText} Lists
            </Typography>
            break;
        case HOMESCREEN_TAB_TYPE.TAB_USERS:
            let usersText = (store.searchObj.param.length > 0) ? store.searchObj.param : "All Users"
            footer = <Typography variant="h5" p={2}>
                {usersText}'s Lists
            </Typography>
            break;
        case HOMESCREEN_TAB_TYPE.TAB_COMMUNITY:
            footer = <Typography variant="h5" p={2}>
                {store.searchObj.param} Community Lists
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
        </Box>
    )
}

export default HomeScreen;