import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, Grid, List, TextField} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { CommunityListItem, CommentItem } from '.';
import AuthContext from '../auth'

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function CommunityListCard(props) {
    const {auth} = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [commentText, setCommentText] = useState("");
    const list = props.list;

    async function handleLikeList(event){
        event.stopPropagation();
        store.likeCommunityList(list._id);
    }

    async function handleDislikeList(event){
        event.stopPropagation();
        store.dislikeCommunityList(list._id)
    }

    const handleCommentChange = (event) =>{
        setCommentText(event.target.value)
    }

    const handleComment = (event) => {
        if(event.keyCode == 13){
            if(event.target.value.length > 0){
                store.addCommunityListComment(list._id, event.target.value)
                setCommentText("")
            }
            
        }
    }

    let handleAccordionChange = (event, newExpanded) => {
        if(newExpanded){
            store.viewCommunityList(list._id)
        }
    }

    let backgroundColor = "complement.main"

    let dateObj = new Date(Date.parse(list.updatedAt))
    let dateString = String(dateObj.getMonth() + 1) + "/" + String(dateObj.getDate()) + "/" + dateObj.getFullYear();

    let likes = store.numLikes(list);
    let dislikes = store.numDislikes(list);

    let likeColor = (store.isListLiked(list)) ? "selection" : "action";
    let dislikeColor = (store.isListDisliked(list)) ? "selection" : "action";

    if(auth.isGuest()){
        likeColor = "disabled"
        dislikeColor ="disabled"
    }

    let commentItems = list.comments.map((item) => {return <CommentItem comment={item}/>})
    return (
        <Accordion sx={{ bgcolor: backgroundColor}} onChange={handleAccordionChange}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container pr={2} direction="row" justifyContent="space-around" alignItems="center">
                    <Grid item xs container direction="column" justifyContent="center" alignItems="flex-start">
                        <Typography variant="h5">
                            {list.name}
                        </Typography>
                        <Typography variant="caption"> 
                            {"Updated: " + dateString} 
                        </Typography>
                    </Grid>
                    <Grid item xs="auto" container direction="row">
                        <Grid item xs container px={2} direction="column" justifyContent="center" alignItems="flex-end">
                            <Grid item container justifyContent="center" direction="row">
                                <Grid item xs="auto" container px={1} justifyContent="center" alignItems="center" direction="row">
                                    <IconButton size="small" onClick={handleLikeList} disabled={auth.isGuest()}>
                                        <ThumbUpIcon color={likeColor}/>
                                    </IconButton>
                                    <Typography variant="subtitle2">
                                        {likes}
                                    </Typography>
                                </Grid>
                                <Grid item xs="auto" container px={1} justifyContent="center" alignItems="center" direction="row">
                                    <IconButton size="small" onClick={handleDislikeList} disabled={auth.isGuest()}>
                                        <ThumbDownIcon color={dislikeColor}/>
                                    </IconButton>
                                    <Typography variant="subtitle2">
                                        {dislikes}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item >
                                <Typography variant="caption">
                                    {list.views + " Views"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs>
                        <Box height='350px' display="flex" m="auto" alignItems='center' sx={{ 
                            p: 1,
                            borderRadius:"16px",
                            backgroundColor:"secondary.main"
                        }}>
                            <List sx={{ width: '100%'}}>
                                <CommunityListItem index={0} item={list.items[0]}/>
                                <CommunityListItem index={1} item={list.items[1]}/>
                                <CommunityListItem index={2} item={list.items[2]}/>
                                <CommunityListItem index={3} item={list.items[3]}/>
                                <CommunityListItem index={4} item={list.items[4]}/>
                            </List>
                        </Box>
                    </Grid>
                        <Grid item xs>
                            <Box height='350px' display="flex" m="auto" alignItems='center' sx={{ 
                                p: 1,
                                borderRadius:"16px",
                                backgroundColor:"transparent",
                            }}>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item xs>
                                        <List style={{height:"285px", overflow: 'auto', borderTopLeftRadius:'16px'}}sx={{ width: '100%'}}>
                                            {commentItems}
                                        </List>
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <TextField disabled={auth.isGuest()} fullWidth variant='outlined' label='Add Comment' onChange={handleCommentChange} onKeyDown={handleComment} value={commentText}/>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

export default CommunityListCard;