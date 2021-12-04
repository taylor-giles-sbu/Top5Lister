import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import { Box, Grid, Paper } from '@mui/material'
import HomeToolbar from './HomeToolbar'
import List from '@mui/material/List';

const ListViewScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    let listCards = "";
    if (store) {
        console.log(store.lists)
        listCards = store.shownLists.map((list)  => (
                <ListCard
                    list={list}
                />
        ))   
    }
    return (
        <List style={{maxHeight: '70%', overflow: 'auto'}} sx={{ left: "2.5%", width: '95%', bgcolor: 'transparent' }}>
            {listCards}
        </List>
    )
}

export default ListViewScreen;