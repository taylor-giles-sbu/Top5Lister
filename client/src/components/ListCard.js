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
import { Top5Item, CommentItem } from '.';
import AuthContext from '../auth'

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const {auth} = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [commentText, setCommentText] = useState("");
    const list = props.list;

    function handleEdit(event) {
        event.stopPropagation();
        console.log("ready to edit")
        console.log(list)
        store.setListToEdit(list)
    }

    async function handleDeleteList(event) {
        event.stopPropagation();
        console.log("list to delete: ")
        console.log(list)
        store.markListForDeletion(list._id)
    }

    async function handleLikeList(event){
        event.stopPropagation();
        store.likeList(list._id);
    }

    async function handleDislikeList(event){
        event.stopPropagation();
        store.dislikeList(list._id)
    }

    const handleCommentChange = (event) =>{
        setCommentText(event.target.value)
    }

    const handleComment = (event) => {
        if(event.keyCode == 13){
            if(event.target.value.length > 0){
                store.addListComment(list._id, event.target.value)
                setCommentText("")
            }
            
        }
    }

    let handleAccordionChange = (event, newExpanded) => {
        if(newExpanded){
            store.viewList(list._id)
        }
    }

    let backgroundColor = (list.isPublished) ? "complement.main" : "unpublished.main"

    let dateObj = new Date(list.datePublished)
    let dateString = String(dateObj.getMonth() + 1) + "/" + String(dateObj.getDate()) + "/" + dateObj.getFullYear();

    let likes = store.numLikes(list);
    let dislikes = store.numDislikes(list);

    let likeColor = (store.isListLiked(list)) ? "selection" : "action"
    let dislikeColor = (store.isListDisliked(list)) ? "selection" : "action"

    if(auth.isGuest()){
        likeColor = "disabled"
        dislikeColor ="disabled"
    }

    let publish = (list.isPublished) 
        ? (<Typography variant="caption"> {"Published: " + dateString} </Typography>)
        : (<Typography variant="caption" color="red"> {"Not Published"} </Typography>)

    let deleteButton = (store.isListOwnedByMe(list))
        ? <IconButton onClick={handleDeleteList} size="large">
            <DeleteIcon fontSize="large"/>
        </IconButton>
        : ""

    let likesAndViewsOrEdit = (list.isPublished)
        ? <Grid item xs container px={2} direction="column" justifyContent="center" alignItems="flex-end">
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
        : (<Button variant="text" color="black" onClick={handleEdit}> Edit </Button>)

    let commentItems = list.comments.map((item) => {return <CommentItem comment={item}/>})

    let commentView = (list.isPublished)
        ? <Grid item xs>
            <Box height='250px' display="flex" m="auto" alignItems='center' sx={{ 
                p: 1,
                borderRadius:"16px",
                backgroundColor:"transparent",
            }}>
                <Grid container direction="column" spacing={1}>
                    <Grid item xs>
                        <List style={{height:"185px", overflow: 'auto', borderTopLeftRadius:'16px'}}sx={{ width: '100%'}}>
                            {commentItems}
                        </List>
                    </Grid>
                    <Grid item xs='auto'>
                        <TextField disabled={auth.isGuest()} fullWidth variant='outlined' label='Add Comment' onChange={handleCommentChange} onKeyDown={handleComment} value={commentText}/>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        : ""

    return (
        <Accordion sx={{ bgcolor: backgroundColor}} onChange={handleAccordionChange}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container pr={2} direction="row" justifyContent="space-around" alignItems="center">
                    <Grid item xs container direction="column" justifyContent="center" alignItems="flex-start">
                        <Typography variant="h5">
                            {list.name}
                        </Typography>
                        <Typography variant="subtitle1">
                            {list.owner}
                        </Typography>
                        { publish }
                    </Grid>
                    <Grid item xs="auto" container direction="row">
                        {likesAndViewsOrEdit}
                        <Grid item xs="auto">
                            { deleteButton }
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs>
                        <Box height='250px' display="flex" m="auto" alignItems='center' sx={{ 
                            p: 1,
                            borderRadius:"16px",
                            backgroundColor:"secondary.main"
                        }}>
                            <List sx={{ width: '100%'}}>
                                <Top5Item index={0} item={list.items[0]}/>
                                <Top5Item index={1} item={list.items[1]}/>
                                <Top5Item index={2} item={list.items[2]}/>
                                <Top5Item index={3} item={list.items[3]}/>
                                <Top5Item index={4} item={list.items[4]}/>
                            </List>
                        </Box>
                    </Grid>
                    {commentView}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

export default ListCard;