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
    SET_LIST_LIKE_STATUS: "SET_LIST_LIKE_STATUS",
    UPDATE_VIEW: "UPDATE_VIEW"
}

export const HOMESCREEN_TAB_TYPE = {
    TAB_HOME: "Home",
    TAB_LISTS: "Lists",
    TAB_USERS: "Users",
    TAB_COMMUNITY: "Community"
}

export const SORT_TYPE = {
    SORT_DATE_NEWEST: "DATE_NEWEST",
    SORT_DATE_OLDEST: "DATE_OLDEST",
    SORT_VIEWS: "VIEWS",
    SORT_LIKES: "LIKES",
    SORT_DISLIKES: "DISLIKES"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    const defaultSearchObj = {
        function: () => {return true},
        param: ""
    }

    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        lists: [],
        shownLists: [],
        currentTab: null,
        newListCounter: 0,
        listToEdit: null,
        listMarkedForDeletion: null,
        sortType: SORT_TYPE.SORT_DATE_NEWEST,
        searchObj: defaultSearchObj
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
                    listMarkedForDeletion: null,
                    sortType: store.sortType,
                    searchObj: store.searchObj
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
                    listMarkedForDeletion: null,
                    sortType: store.sortType,
                    searchObj: store.searchObj
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
                    listMarkedForDeletion: payload,
                    sortType: store.sortType,
                    searchObj: store.searchObj
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
                    listMarkedForDeletion: null,
                    sortType: store.sortType,
                    searchObj: store.searchObj
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
                    listMarkedForDeletion: null,
                    sortType: store.sortType,
                    searchObj: store.searchObj
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
                    listMarkedForDeletion: null,
                    sortType: store.sortType,
                    searchObj: store.searchObj
                })
            }

            case GlobalStoreActionType.UPDATE_VIEW: {
                return setStore({
                    lists: payload.lists,
                    shownLists: payload.shownLists,
                    currentTab: payload.currentTab,
                    newListCounter: store.newListCounter,
                    listToEdit: null,
                    listMarkedForDeletion: null,
                    sortType: payload.sortType,
                    searchObj: payload.searchObj
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
        const response = await api.createTop5List(newListName, ["?", "?", "?", "?", "?"], auth.user.username);
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
        const response = await api.getTop5Lists();
        if (response.status === 200) {
            let listsArray = response.data.data;
            console.log(response)
            return listsArray;
        } else {
            console.log("API FAILED TO GET THE LISTS");
        }
    }

    store.getCommunityLists = async function () {
        const response = await api.getCommunityLists();
        if (response.status === 200) {
            let listsArray = response.data.data;
            console.log(response)
            console.log(listsArray)
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
        // GET THE LIST (enforced by ownership)
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
            store.updateView(store.currentTab, store.sortType, store.searchObj);
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
            store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_HOME); //This clears the listToEdit
        }
    }

    store.publishEditedList = async function() {
        const response = await api.publishTop5ListById(store.listToEdit._id);
        if (response.status === 200){
            store.setCurrentTab(HOMESCREEN_TAB_TYPE.TAB_HOME); //This clears the listToEdit
        }
    }

    store.setListToEdit = function (list) {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_TO_EDIT,
            payload: list
        })
    }

    store.setCurrentTab = async function (tab) {
        store.updateView(tab, SORT_TYPE.SORT_DATE_NEWEST, defaultSearchObj)
    }

    // Updates the page with fresh lists from the server
    store.updateView = async function (tab, sortType, searchObj) {
        async function setTabAndSort(tab, sortType, searchObj, lists){
            let newShownLists = []
            switch (tab) {
                case HOMESCREEN_TAB_TYPE.TAB_HOME: {
                    newShownLists = lists.filter(list => list.owner === auth.user.username)
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
                    newShownLists = lists;
                    break;
                }
            }
            newShownLists.sort(store.getSortFunction(sortType))
            newShownLists = newShownLists.filter(searchObj.function)
            
            storeReducer({
                type: GlobalStoreActionType.UPDATE_VIEW, 
                payload: {
                    lists: lists,
                    shownLists: newShownLists,
                    currentTab: tab,
                    sortType: sortType,
                    searchObj: searchObj
                }
            })
        }
        if(tab != HOMESCREEN_TAB_TYPE.TAB_COMMUNITY){
            store.getLists().then((lists) => setTabAndSort(tab, sortType, searchObj, lists))
        } else {
            store.getCommunityLists().then((lists)=> setTabAndSort(tab, sortType, searchObj, lists))
        }
    }

    store.sortBy = function (sortType) {
        store.updateView(store.currentTab, sortType, store.searchObj)
    }

    store.getSortFunction = function(sortType){
        switch(sortType){
            case SORT_TYPE.SORT_DATE_NEWEST: return ((list1, list2) => { return list2.datePublished - list1.datePublished });
            case SORT_TYPE.SORT_DATE_OLDEST: return ((list1, list2) => { return list1.datePublished - list2.datePublished });
            case SORT_TYPE.SORT_VIEWS: return ((list1, list2) => { return list2.views - list1.views });
            case SORT_TYPE.SORT_LIKES: return ((list1, list2) => { return store.numLikes(list2) - store.numLikes(list1) });
            case SORT_TYPE.SORT_DISLIKES: return ((list1, list2) => { return store.numDislikes(list2) - store.numDislikes(list1) });
        }
    }

    store.searchLists = function(searchParam){
        if(store.currentTab === HOMESCREEN_TAB_TYPE.TAB_USERS){
            store.filterByUser(searchParam)
        } else {
            store.filterByName(searchParam)
        }
    }

    store.filterByName = function (name) {
        store.updateView(store.currentTab, store.sortType, {function: ((list) => {return list.name.toUpperCase().startsWith(name.toUpperCase())}), param: name})
    }

    store.filterByUser = function (user) {
        store.updateView(store.currentTab, store.sortType, {function: ((list) => {return list.owner.toUpperCase() === user.toUpperCase()}), param: user})
    }

    store.clearFilter = function(){
        store.updateView(store.currentTab, store.sortType, defaultSearchObj);
    }

    store.likeList = async function (id) {
        const response = await api.likeTop5List(id);
        if (response.status === 200) {
            store.updateView(store.currentTab, store.sortType, store.searchObj); 
        }
    }

    store.dislikeList = async function (id) {
        const response = await api.dislikeTop5List(id);
        if (response.status === 200) {
            store.updateView(store.currentTab, store.sortType, store.searchObj);  
        }
    }

    store.isListLiked = function(list){
        let index = list.userLikes.findIndex((element) =>  (element.user === auth.user.username))
        if(index < 0) { 
            return false
        }
        return list.userLikes[index].liked;
    }

    store.isListDisliked = function(list){
        let index = list.userLikes.findIndex((element) =>  (element.user === auth.user.username))
        if(index < 0) { 
            return false
        }
        return !list.userLikes[index].liked;
    }

    store.isListOwnedByMe = function(list){
        return list.owner === auth.user.username
    }

    store.getMyLists = function(){
        return store.lists.filter((list) => {return store.isListOwnedByMe(list)})
    }

    store.numLikes = function(list){
        return list.userLikes.reduce((numLikes, item) => { return (item.liked) ? numLikes+1 : numLikes }, 0);
    }

    store.numDislikes = function(list){
        return list.userLikes.reduce((numDislikes, item) => { return (item.liked) ? numDislikes : numDislikes + 1 }, 0);
    }

    store.viewList = async function(id){
        const response = await api.viewTop5List(id);
        if (response.status === 200) {
            store.updateView(store.currentTab, store.sortType, store.searchObj);  
        }
    }

    store.addListComment = async function(id, comment){
        const response = await api.commentTop5List(id, comment);
        if(response.status === 200){
            store.updateView(store.currentTab, store.sortType, store.searchObj);
        }
    }

    store.likeCommunityList = async function (id) {
        const response = await api.likeCommunityList(id);
        if (response.status === 200) {
            store.updateView(store.currentTab, store.sortType, store.searchObj); 
        }
    }

    store.dislikeCommunityList = async function (id) {
        const response = await api.dislikeCommunityList(id);
        if (response.status === 200) {
            store.updateView(store.currentTab, store.sortType, store.searchObj);  
        }
    }

    store.viewCommunityList = async function(id){
        const response = await api.viewCommunityList(id);
        if (response.status === 200) {
            store.updateView(store.currentTab, store.sortType, store.searchObj);  
        }
    }

    store.addCommunityListComment = async function(id, comment){
        const response = await api.commentCommunityList(id, comment);
        if(response.status === 200){
            store.updateView(store.currentTab, store.sortType, store.searchObj);
        }
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