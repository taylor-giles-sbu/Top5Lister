import { useContext } from 'react'
import GlobalStoreContext from '../store';
import ListViewScreen from './ListViewScreen'
import ListEditScreen from './ListEditScreen'

export default function ListWrapper() {
    const { store } = useContext(GlobalStoreContext);
    
    if (store.listToEdit === null)
        return <ListViewScreen />
    else
        return <ListEditScreen />
}