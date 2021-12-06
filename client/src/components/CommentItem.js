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
function CommentItem(props) {
    const comment = props.comment;

    return (
        <ListItem
            sx={{ display: 'flex', pb:'1', px:'0'}}
            style={{ width: '100%' }}>

            <Box display="flex" m="auto" alignItems='flex-start' sx={{ 
                p: 1,
                height: 'auto',
                borderRadius:"8px",
                backgroundColor:"accent.main",
                width: "100%"
            }}>

                <Grid container direction="column" spacing={0} justifyContent='flex-start' alignItems='flex-start'>
                    <Grid item xs='auto'>
                        <Typography variant="caption" color="secondary">
                            {comment.user}
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="body2" color="black">
                            {comment.content}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </ListItem>
    );
}

export default CommentItem;