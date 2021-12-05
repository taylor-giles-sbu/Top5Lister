import { Button, Grid, IconButton, TextField, Toolbar, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE, SORT_TYPE } from '../store'
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import SortIcon from '@mui/icons-material/Sort';

export default function HomeToolbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    let homeColor = store.currentTab === HOMESCREEN_TAB_TYPE.TAB_HOME ? "selection" : "black"
    let listsColor = store.currentTab === HOMESCREEN_TAB_TYPE.TAB_LISTS ? "selection" : "black"
    let usersColor = store.currentTab === HOMESCREEN_TAB_TYPE.TAB_USERS ? "selection" : "black"
    let communityColor = store.currentTab === HOMESCREEN_TAB_TYPE.TAB_COMMUNITY ? "selection" : "black"

    //Disabled colors
    if(store.listToEdit !== null){
        homeColor = "disabled"
        listsColor = "disabled"
        usersColor = "disabled"
        communityColor = "disabled"
    }

    function handleHome() {
        store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_HOME)
    }

    function handleLists(){
        store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_LISTS)
    }

    function handleUsers(){
        store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_USERS)
    }

    function handleCommunity(){
        store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_COMMUNITY)
    }

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const sortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={'sort-menu'}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
                <Button style={{justifyContent: "flex-start"}} color="black" fullWidth onClick={() => {store.sortBy(SORT_TYPE.SORT_DATE_NEWEST)}}>
                    {'Publish Date (Newest)'}
                </Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <Button style={{justifyContent: "flex-start"}} color="black" fullWidth onClick={() => {store.sortBy(SORT_TYPE.SORT_DATE_OLDEST)}}>
                    {'Publish Date (Oldest)'}
                </Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <Button style={{justifyContent: "flex-start"}} color="black" fullWidth onClick={() => {store.sortBy(SORT_TYPE.SORT_VIEWS)}}>
                    {'Views'}
                </Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <Button style={{justifyContent: "flex-start"}} color="black" fullWidth onClick={() => {store.sortBy(SORT_TYPE.SORT_LIKES)}}>
                    {'Likes'}
                </Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <Button style={{justifyContent: "flex-start"}} color="black" fullWidth onClick={() => {store.sortBy(SORT_TYPE.SORT_DISLIKES)}}>
                    {'Dislikes'}
                </Button>
            </MenuItem>
        </Menu>
    );

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
                        onClick={handleSortMenuOpen}
                        startIcon={<SortIcon fontSize="large"/>}>
                        Sort By
                    </Button>
                    {sortMenu}
                </Grid>
            </Grid>
        </Toolbar>
    );
}