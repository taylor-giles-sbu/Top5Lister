import { Box, Button, Grid, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import SortIcon from '@mui/icons-material/Sort';

export default function HomeToolbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    return (
        <Toolbar sx={{ display: 'flex' }}>
            <Grid container direction="row" justifyContent="space-between">
                <Grid container justifyContent="flex-start" item xs={3}>
                    <IconButton>
                        <HomeIcon fontSize='large'/>
                    </IconButton>
                    <IconButton>
                        <GroupsIcon fontSize='large'/>
                    </IconButton>
                    <IconButton>
                        <PersonIcon fontSize='large'/>
                    </IconButton>
                    <IconButton>
                        <FunctionsIcon fontSize='large'/>
                    </IconButton>
                </Grid>
                <Grid container justifyContent="center" item xs={6}>
                    <TextField style ={{width: '100%'}} id="search-bar" label="Search" variant="outlined" />
                </Grid>
                <Grid container justifyContent="flex-end" item xs={3}>
                    <Button size="large"variant="text" color="black" startIcon={<SortIcon fontSize="large"/>}>
                        Sort By
                    </Button>
                </Grid>
            </Grid>
        </Toolbar>
    );
}