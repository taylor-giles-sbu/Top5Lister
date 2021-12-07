/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createTop5List = (newListName, newItems, owner) => {
    return api.post(`/top5list/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        items: newItems,
        owner: owner
    })
}
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}`)
export const getTop5Lists = () => api.get(`/top5lists/`)
export const updateTop5ListById = (id, top5List) => {
    return api.put(`/top5list/${id}`, {
        // SPECIFY THE PAYLOAD
        top5List : top5List
    })
}
export const publishTop5ListById = (id) => api.put(`/publishtop5list/${id}`)

//Liking and disliking - note that unliking is handled on the server side
export const likeTop5List = (id) => api.put(`/liketop5list/${id}`)
export const dislikeTop5List = (id) => api.put(`/disliketop5list/${id}`)

export const viewTop5List = (id) => api.put(`/viewtop5list/${id}`)
export const commentTop5List = (id, content) => {
    return api.put(`/commenttop5list/${id}`, {
        comment : content
    })
}

export const likeCommunityList = (id) => api.put(`/likecommunitylist/${id}`)
export const dislikeCommunityList = (id) => api.put(`/dislikecommunitylist/${id}`)
export const viewCommunityList = (id) => api.put(`/viewcommunitylist/${id}`)
export const commentCommunityList = (id, content) => {
    return api.put(`/commentcommunitylist/${id}`, {
        comment : content
    })
}
export const getCommunityLists = () => api.get(`/communitylists/`)

const apis = {
    createTop5List,
    deleteTop5ListById,
    getTop5ListById,
    getTop5Lists,
    updateTop5ListById,
    likeTop5List,
    dislikeTop5List,
    publishTop5ListById,
    viewTop5List,
    commentTop5List,
    getCommunityLists,
    likeCommunityList,
    viewCommunityList,
    dislikeCommunityList,
    viewCommunityList,
    commentCommunityList
}

export default apis
