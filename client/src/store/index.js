import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from './store-request-api'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LISTS: "LOAD_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_TAB: "SET_CURRENT_TAB",
    SET_LIST_TO_EDIT: "SET_LIST_TO_EDIT",
    SET_LIST_LIKE_STATUS: "SET_LIST_LIKE_STATUS"
}

export const HOMESCREEN_TAB_TYPE = {
    TAB_HOME: "Home",
    TAB_LISTS: "Lists",
    TAB_USERS: "Users",
    TAB_COMMUNITY: "Community"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        lists: [],
        shownLists: [],
        currentTab: null,
        newListCounter: 0,
        listToEdit: null,
        listMarkedForDeletion: null
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    lists: payload.lists,
                    shownLists: store.shownLists,
                    currentTab: store.currentTab,
                    newListCounter: store.newListCounter + 1,
                    listToEdit: payload.listToEdit,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    lists: payload,
                    shownLists: payload,
                    currentTab: store.currentTab,
                    newListCounter: store.newListCounter,
                    listToEdit: null,
                    listMarkedForDeletion: null
                });
            }
            // // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    shownLists: store.shownLists,
                    currentTab: store.currentTab,
                    newListCounter: store.newListCounter,
                    listToEdit: null,
                    listMarkedForDeletion: payload
                });
            }
            // Unmark list for deletion
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    shownLists: store.shownLists,
                    currentTab: store.currentTab,
                    newListCounter: store.newListCounter,
                    listToEdit: null,
                    listMarkedForDeletion: null
                });
            }

            // Set the list to edit
            case GlobalStoreActionType.SET_LIST_TO_EDIT: {
                return setStore({
                    lists: store.lists,
                    shownLists: store.shownLists,
                    currentTab: store.currentTab,
                    newListCounter: store.newListCounter,
                    listToEdit: payload,
                    listMarkedForDeletion: null
                });
            }
            //CHANGE TAB
            case GlobalStoreActionType.SET_CURRENT_TAB: {
                return setStore({
                    lists: payload.lists,
                    shownLists: payload.shownLists,
                    currentTab: payload.currentTab,
                    newListCounter: store.newListCounter,
                    listToEdit: null,
                    listMarkedForDeletion: null
                })
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createTop5List(newListName, ["?", "?", "?", "?", "?"], auth.user.email);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            let newList = response.data.top5List;
            if(newList){
                async function callReducer(lists, newList){
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {
                            lists: lists,
                            listToEdit: newList
                        }
                    })
                }
                store.getLists().then((lists) => {
                    console.log("reducerlists")
                    console.log(lists)
                    callReducer(lists, newList)
                });
            }
        } else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // Don't look at id/name pairs bc theyre useless. Get the whole list for every list
    store.getLists = async function () {
        console.log("store.loadLists");
        const response = await api.getTop5Lists();
        if (response.status === 200) {
            let listsArray = response.data.data;
            console.log(response)
            return listsArray;
        } else {
            console.log("API FAILED TO GET THE LISTS");
        }
    }

    store.loadLists = function(){
        store.getLists().then((lists) => {
            console.log("lists:")
            console.log(lists)
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: lists
            })
        });
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.status === 200) {
            store.loadLists();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // Change one of the items in the list being edited
    store.editListItem = function (index, newItem) {
        store.listToEdit.items[index] = newItem;
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_TO_EDIT,
            payload: store.listToEdit
        })
    }

    // Changes the name of the list currently being edited
    store.editListName = async function (newName) {
        store.listToEdit.name = newName;
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_TO_EDIT,
            payload: store.listToEdit
        })
    }

    // Sends local changes on edited list to the server
    store.updateEditedList = async function () {
        const response = await api.updateTop5ListById(store.listToEdit._id, store.listToEdit);
        if (response.status === 200) {
            store.loadLists(); //This clears the listToEdit
        }
    }

    store.getListById = async function(id){

    }

    store.setListToEdit = function (id) {
        let listToEdit = store.getListById(id);
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_TO_EDIT,
            payload: listToEdit
        })
    }

    store.setCurrentTab = async function (tab) {
        async function setTab(tab, lists){
            let newShownLists = []
            switch (tab) {
                case HOMESCREEN_TAB_TYPE.TAB_HOME: {
                    newShownLists = lists.filter(list => list.owner === auth.user.email)
                    break;
                }
    
                case HOMESCREEN_TAB_TYPE.TAB_LISTS: {
                    newShownLists = lists;
                    break;
                }
    
                case HOMESCREEN_TAB_TYPE.TAB_USERS: {
                    newShownLists = lists;
                    break;
                }
    
                case HOMESCREEN_TAB_TYPE.TAB_COMMUNITY: {
                    newShownLists = lists.filter(list => list.owner === null)
                    break;
                }
            }
            
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_TAB, 
                payload: {
                    lists: lists,
                    shownLists: newShownLists,
                    currentTab: tab
                }
            })
        }
        store.getLists().then((lists) => setTab(tab, lists))
    }

    store.sortLists = function (sortBy) {

    }

    store.filterByName = function (name) {

    }

    store.filterByUser = function (user) {

    }

    store.filterForCommunity = function () {

    }

    store.likeList = function (id) {

    }

    store.dislikeList = function (id) {

    }

    store.unlikeList = function (id) {

    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };