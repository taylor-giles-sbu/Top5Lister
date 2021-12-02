import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        console.log("its supposed to stop")
        // let _id = event.target.id;
        // _id = ("" + _id).substring("delete-list-".length);
        // store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container pr={2} direction="row" justifyContent="space-around" alignItems="center">
                    <Grid item xs>
                        <Typography variant="h4">
                            {"Hello!"}
                        </Typography>
                    </Grid>
                    <Grid item xs="auto" container direction="row">
                        <Grid item xs container px={2} direction="column" justifyContent="center" alignItems="center">
                            <Grid item container justifyContent="center" direction="row">
                                <Grid item xs="auto" container px={1} justifyContent="center" alignItems="center" direction="row">
                                    <IconButton size="small">
                                        <ThumbUpIcon/>
                                    </IconButton>
                                    <Typography variant="subtitle2">
                                        {"5K"}
                                    </Typography>
                                </Grid>
                                <Grid item xs="auto" container px={1} justifyContent="center" alignItems="center" direction="row">
                                    <IconButton size="small">
                                        <ThumbDownIcon/>
                                    </IconButton>
                                    <Typography variant="subtitle2">
                                        {"10K"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item >
                                <Typography variant="subtitle2">
                                    {"100000 Views"}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs="auto">
                            <IconButton onClick={handleDeleteList} size="large">
                                <DeleteIcon fontSize="large"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}

export default ListCard;