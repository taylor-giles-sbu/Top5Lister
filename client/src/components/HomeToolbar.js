import { Button, Grid, IconButton, TextField, Toolbar } from '@mui/material';
import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext, HOME_TAB_TYPE } from '../store'
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import SortIcon from '@mui/icons-material/Sort';

export default function HomeToolbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    let homeColor = store.currentTab === HOME_TAB_TYPE.TAB_HOME ? "secondary" : "black"
    let listsColor = store.currentTab === HOME_TAB_TYPE.TAB_LISTS ? "secondary" : "black"
    let usersColor = store.currentTab === HOME_TAB_TYPE.TAB_USERS ? "secondary" : "black"
    let communityColor = store.currentTab === HOME_TAB_TYPE.TAB_COMMUNITY ? "secondary" : "black"

    function handleHome() {
        store.changeTab(HOME_TAB_TYPE.TAB_HOME)
    }

    function handleLists(){
        store.changeTab(HOME_TAB_TYPE.TAB_LISTS)
    }

    function handleUsers(){
        store.changeTab(HOME_TAB_TYPE.TAB_USERS)
    }

    function handleCommunity(){
        store.changeTab(HOME_TAB_TYPE.TAB_COMMUNITY)
    }

    return (
        <Toolbar>
            <Grid container direction="row" justifyContent="space-between">
                <Grid container justifyContent="space-around" item md={4} lg={3}>
                    <IconButton 
                        disabled={store.listToEdit !== null} 
                        onClick={handleHome}>
                        <HomeIcon  color={homeColor} fontSize='large'/>
                    </IconButton>
                    <IconButton 
                        disabled={store.listToEdit !== null} 
                        onClick={handleLists}>
                        <GroupsIcon color={listsColor} fontSize='large'/>
                    </IconButton>
                    <IconButton 
                        disabled={store.listToEdit !== null} 
                        onClick={handleUsers}>
                        <PersonIcon color={usersColor} fontSize='large'/>
                    </IconButton>
                    <IconButton
                        disabled={store.listToEdit !== null} 
                        onClick={handleCommunity}>
                        <FunctionsIcon color={communityColor} fontSize='large'/>
                    </IconButton>
                </Grid>
                <Grid container justifyContent="center" item xs={6}>
                    <TextField 
                        disabled={store.listToEdit !== null} 
                        style ={{width: '100%'}} 
                        id="search-bar" 
                        label="Search" 
                        variant="outlined" 
                    />
                </Grid>
                <Grid container justifyContent="center" item xs={2}>
                    <Button 
                        disabled={store.listToEdit !== null} 
                        size="large"
                        variant="text" 
                        color="black" 
                        startIcon={<SortIcon fontSize="large"/>}>
                        Sort By
                    </Button>
                </Grid>
            </Grid>
        </Toolbar>
    );
}