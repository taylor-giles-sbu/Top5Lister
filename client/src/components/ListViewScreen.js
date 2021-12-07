import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext, HOMESCREEN_TAB_TYPE } from '../store'
import ListCard from './ListCard.js'
import CommunityListCard from './CommunityListCard.js'
import List from '@mui/material/List';

const ListViewScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    let listCards = "";
    if (store) {
        console.log(store.lists)
        listCards = (store.currentTab === HOMESCREEN_TAB_TYPE.TAB_COMMUNITY) 
            ? store.shownLists.map((list) => (<CommunityListCard list={list}/>))
            : store.shownLists.map((list)  => (<ListCard list={list}/>)) 
    }
    return (
        <List style={{maxHeight: '70%', overflow: 'auto'}} sx={{ left: "2.5%", width: '95%', bgcolor: 'transparent' }}>
            {listCards}
        </List>
    )
}

export default ListViewScreen;