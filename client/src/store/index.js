import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
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
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_LIST: "CLOSE_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_TAB: "SET_CURRENT_TAB",
    SET_LIST_TO_EDIT: "SET_LIST_TO_EDIT",
    SET_LIST_LIKE_STATUS: "SET_LIST_LIKE_STATUS",
    OPEN_LIST: "OPEN_LIST"
}

export const HOME_TAB_TYPE = {
    TAB_HOME: "Home",
    TAB_LISTS: "Lists",
    TAB_USERS: "Users",
    TAB_COMMUNITY: "Community"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        shownIdNamePairs: [],
        openLists: [],
        currentTab: null,
        newListCounter: 0,
        listToEdit: null,
        listMarkedForDeletion: null
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        // let response = await api.getTop5ListById(id);
        // if (response.status === 200) {
        //     let top5List = response.data.top5List;
        //     top5List.name = newName;
        //     async function updateList(top5List) {
        //         response = await api.updateTop5ListById(top5List._id, top5List);
        //         if (response.status === 200) {
        //             async function getListPairs(top5List) {
        //                 response = await api.getTop5ListPairs();
        //                 if (response.status === 200) {
        //                     let pairsArray = response.data.idNamePairs;
        //                     storeReducer({
        //                         type: GlobalStoreActionType.CHANGE_LIST_NAME,
        //                         payload: {
        //                             idNamePairs: pairsArray,
        //                             top5List: top5List
        //                         }
        //                     });
        //                 }
        //             }
        //             getListPairs(top5List);
        //         }
        //     }
        //     updateList(top5List);
        // }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeList = function (id) {
        
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        // let newListName = "Untitled" + store.newListCounter;
        // const response = await api.createTop5List(newListName, ["?", "?", "?", "?", "?"], auth.user.email);
        // console.log("createNewList response: " + response);
        // if (response.status === 201) {
        //     tps.clearAllTransactions();
        //     let newList = response.data.top5List;
        //     storeReducer({
        //         type: GlobalStoreActionType.CREATE_NEW_LIST,
        //         payload: newList
        //     }
        //     );

        //     // IF IT'S A VALID LIST THEN LET'S START EDITING IT
        //     history.push("/top5list/" + newList._id);
        // }
        // else {
        //     console.log("API FAILED TO CREATE A NEW LIST");
        // }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        // console.log("store.loadIdNamePairs");
        // const response = await api.getTop5ListPairs();
        // if (response.status === 200) {
        //     let pairsArray = response.data.idNamePairs;
        //     storeReducer({
        //         type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        //         payload: pairsArray
        //     });
        // }
        // else {
        //     console.log("API FAILED TO GET THE LIST PAIRS");
        // }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        // let response = await api.getTop5ListById(id);
        // if (response.status === 200) {
        //     let top5List = response.data.top5List;
        //     storeReducer({
        //         type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
        //         payload: top5List
        //     });
        // }
    }

    store.deleteList = async function (listToDelete) {
        // let response = await api.deleteTop5ListById(listToDelete._id);
        // if (response.status === 200) {
        //     store.loadIdNamePairs();
        //     history.push("/");
        // }
    }

    store.deleteMarkedList = function () {
        // store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        // storeReducer({
        //     type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
        //     payload: null
        // });
    }

    store.updateItem = function (index, newItem) {
        // store.currentList.items[index] = newItem;
        // store.updateCurrentList();
    }

    store.updateEditedList = async function () {
        // const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        // if (response.status === 200) {
        //     storeReducer({
        //         type: GlobalStoreActionType.SET_CURRENT_LIST,
        //         payload: store.currentList
        //     });
        // }
    }

    store.openList = async function (id) {

    }

    store.setListToEdit = function () {

    }

    store.changeTab = function (tab) {

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