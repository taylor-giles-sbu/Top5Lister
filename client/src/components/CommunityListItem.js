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
function CommunityListItem(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const item = props.item;
    const index = props.index;

    return (
        <ListItem
            sx={{ display: 'flex', p: 1 }}
            style={{ width: '100%' }}>

            <Grid px={1} container direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                <Grid item xs="auto">
                    <Typography color="accent.main" noWrap variant="h5">
                        {index+1}.
                    </Typography>
                </Grid>
                <Grid item xs container direction="column">
                    <Grid item xs>
                        <Typography color="accent.main" noWrap variant="h5">
                            {item.item}
                        </Typography>
                    </Grid>
                    <Grid item xs='auto'>
                        <Typography color="accent.main" noWrap variant="caption">
                            {"(" + item.points + " points)"}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default CommunityListItem;