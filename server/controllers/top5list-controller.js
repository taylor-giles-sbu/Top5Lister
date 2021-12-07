const Top5List = require('../models/top5list-model');
const User = require('../models/user-model');
const CommunityList = require('../models/community-model')

// TG - Updated for final project
createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    body.isPublished = false;
    body.datePublished = 0;
    body.comments = [];
    body.userLikes = [];
    body.views = 0;

    const top5List = new Top5List(body);
    console.log(top5List)
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    // REMEMBER THAT OUR AUTH MIDDLEWARE GAVE THE userId TO THE req
    console.log("top5List created for " + req.userId);
    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.top5Lists.push(top5List._id);
        user.save().then(() => {
            top5List.save().then(() => {
                return res.status(201).json({
                    top5List: top5List
                })
            }).catch(error => {
                console.log(error)
                return res.status(400).json({
                    errorMessage: 'Top 5 List Not Created!'
                })
            })
        });
    })
}
deleteTop5List = async (req, res) => {
    console.log("delete Top 5 List with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.owner }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                        //Update community lists
                        async function updateCommunityLists(deletedList){
                            await CommunityList.findOne({name: list.name}, (err, communityList) => {
                                console.log("found community list: " + JSON.stringify(communityList));
                                if (err) {
                                    return res.status(400).json({ success: false, error: err })
                                }

                                //Iterate over the items in this list (deletedList) and remove the points from the community list
                                for(itemIndex in deletedList.items){
                                    console.log("itemIndex: " + itemIndex)
                                    let done = false;
                                    for(communityItemIndex in communityList.items){
                                        if(communityList.items[communityItemIndex].item === deletedList.items[itemIndex]){
                                            communityList.items[communityItemIndex].points -= 5-itemIndex;
                                            done = true;
                                            break;
                                        }
                                    }
                                }
                                if(communityList.items[0].points < 1){
                                    CommunityList.findOneAndDelete({name: list.name}, ()=>{})
                                } else {
                                    communityList.save()
                                }
                            }).catch(err => console.log(err))
                        }
                        updateCommunityLists(list);

                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })
}
getTop5ListById = async (req, res) => {
    console.log("Find Top 5 List with id: " + JSON.stringify(req.params.id));

    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.owner }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    return res.status(200).json({ success: true, top5List: list })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getTop5ListPairs = async (req, res) => {
    console.log("getTop5ListPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Top5Lists owned by " + email);
            await Top5List.find({ owner: email }, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    console.log("Send the Top5List pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getTop5Lists = async (req, res) => {
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Top5Lists owned by " + email + " or published");
            await Top5List.find({$or:[{owner: email},{isPublished:true}]}, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                return res.status(200).json({ success: true, data: top5Lists })
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.owner }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

                    list.name = body.top5List.name;
                    list.items = body.top5List.items;
                    list.save().then(() => {
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            id: list._id,
                            message: 'Top 5 List updated!',
                        })
                    }).catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Top 5 List not updated!',
                        })
                    })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(top5List);
    })
}
likeTop5List = async (req, res) => {
    console.log("likeTop5List");
    
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        User.findOne({ _id: req.userId }, (err, user) => {
            console.log("user found: " + JSON.stringify(user));
            console.log("req.userId: " + req.userId);
            let index = top5List.userLikes.findIndex((element) =>  (element.user === user.email))
            if(index >= 0){
                if(top5List.userLikes[index].liked === true){
                    top5List.userLikes.splice(index, 1);
                } else {
                    top5List.userLikes[index].liked = true;
                }
            } else {
                top5List.userLikes.push({user: user.email, liked: true})
            }
            top5List.save().then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            }).catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
        })
    })
}
dislikeTop5List = async (req, res) => {
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        User.findOne({ _id: req.userId }, (err, user) => {
            console.log("user found: " + JSON.stringify(user));
            console.log("req.userId: " + req.userId);
            let index = top5List.userLikes.findIndex((element) =>  (element.user === user.email))
            if(index >= 0){
                if(top5List.userLikes[index].liked === false){
                    top5List.userLikes.splice(index, 1);
                } else {
                    top5List.userLikes[index].liked = false;
                }
            } else {
                top5List.userLikes.push({user: user.email, liked: false})
            }
            top5List.save().then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            }).catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
        })
    })
}
publishTop5List = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.owner }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

                    list.isPublished = true;
                    list.datePublished = new Date();
                    list.save().then(() => {
                        //Update community lists
                        async function updateCommunityLists(addedList){
                            await CommunityList.find({}, (err, communityLists) => {
                                console.log("found community lists: " + JSON.stringify(communityLists));
                                if (err) {
                                    return res.status(400).json({ success: false, error: err })
                                }
                                let listFound = false;
                                for(communityList of communityLists){
                                    if(communityList.name === addedList.name){
                                        for(itemIndex in addedList.items){
                                            console.log("itemIndex: " + itemIndex)
                                            let itemFoundAndHandled = false;
                                            for(communityItemIndex in communityList.items){
                                                if(communityList.items[communityItemIndex].item === addedList.items[itemIndex]){
                                                    communityList.items[communityItemIndex].points += 5-itemIndex;
                                                    itemFoundAndHandled = true;
                                                    break;
                                                }
                                            }
                                            if(!itemFoundAndHandled){
                                                communityList.items.push({item: addedList.items[itemIndex], points: (5-itemIndex)})
                                            }
                                        }
                                        communityList.save()
                                        communityList.numLists++;
                                        listFound = true;
                                    }
                                }
                                if(!listFound){
                                    let newItems = addedList.items.map((item, index) => {return {item: item, points: (5-index)}})
                                    let communityList = new CommunityList( {name: addedList.name, items : newItems, userLikes: [], comments: [], views: 0, numLists: 1})
                                    communityList.save()
                                }
                                
                            }).catch(err => console.log(err))
                        }
                        updateCommunityLists(list);
                        
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            id: list._id,
                            message: 'Top 5 List updated!',
                        })
                    }).catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Top 5 List not updated!',
                        })
                    })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(top5List);
    })
}

viewTop5List = async (req, res) => {
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        if(top5List.isPublished){
            top5List.views = top5List.views + 1;
            top5List.save().then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            }).catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
        }
    })
}

commentTop5List = async (req, res) => {
    const body = req.body
    console.log("\n\n\n\n\n")
    console.log(body)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        User.findOne({ _id: req.userId }, (err, user) => {
            top5List.comments.push({user: user.email, content: body.comment})
            top5List.save().then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            }).catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
        })
    })
}

getCommunityLists = async (req, res) => {
    await CommunityList.find({}, (err, communityLists) => {
        console.log("found community lists: " + JSON.stringify(communityLists));
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!communityLists) {
            console.log("!communityLists.length");
            return res
                .status(404)
                .json({ success: false, error: 'Community Lists not found' })
        }
        return res.status(200).json({ success: true, data: communityLists })
    }).catch(err => console.log(err))
}


viewCommunityList = async (req, res) => {
    CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
        console.log("communityList found: " + JSON.stringify(communityList));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Community List not found!',
            })
        }
        communityList.views = communityList.views + 1;
        communityList.save().then(() => {
            console.log("SUCCESS!!!");
            return res.status(200).json({
                success: true,
                id: communityList._id,
                message: 'communityList updated!',
            })
        }).catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'communityList not updated!',
            })
        })
    })
}

commentCommunityList = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
        console.log("communityList found: " + JSON.stringify(communityList));
        if (err) {
            return res.status(404).json({
                err,
                message: 'communityList not found!',
            })
        }

        User.findOne({ _id: req.userId }, (err, user) => {
            communityList.comments.push({user: user.email, content: body.comment})
            communityList.save().then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: communityList._id,
                    message: 'communityList updated!',
                })
            }).catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'communityList not updated!',
                })
            })
        })
    })
}
likeCommunityList = async (req, res) => {
    console.log("likecommunityList");
    CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
        console.log("communityList found: " + JSON.stringify(communityList));
        if (err) {
            return res.status(404).json({
                err,
                message: 'communityList not found!',
            })
        }

        User.findOne({ _id: req.userId }, (err, user) => {
            console.log("user found: " + JSON.stringify(user));
            console.log("req.userId: " + req.userId);
            let index = communityList.userLikes.findIndex((element) =>  (element.user === user.email))
            if(index >= 0){
                if(communityList.userLikes[index].liked === true){
                    communityList.userLikes.splice(index, 1);
                } else {
                    communityList.userLikes[index].liked = true;
                }
            } else {
                communityList.userLikes.push({user: user.email, liked: true})
            }
            communityList.save().then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: communityList._id,
                    message: 'Top 5 List updated!',
                })
            }).catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
        })
    })
}
dislikeCommunityList = async (req, res) => {
    CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
        console.log("communityList found: " + JSON.stringify(communityList));
        if (err) {
            return res.status(404).json({
                err,
                message: 'communityList not found!',
            })
        }

        User.findOne({ _id: req.userId }, (err, user) => {
            console.log("user found: " + JSON.stringify(user));
            console.log("req.userId: " + req.userId);
            let index = communityList.userLikes.findIndex((element) =>  (element.user === user.email))
            if(index >= 0){
                if(communityList.userLikes[index].liked === false){
                    communityList.userLikes.splice(index, 1);
                } else {
                    communityList.userLikes[index].liked = false;
                }
            } else {
                communityList.userLikes.push({user: user.email, liked: false})
            }
            communityList.save().then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: communityList._id,
                    message: 'Top 5 List updated!',
                })
            }).catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
        })
    })
}

module.exports = {
    createTop5List,
    deleteTop5List,
    getTop5ListById,
    getTop5ListPairs,
    getTop5Lists,
    updateTop5List,
    likeTop5List,
    dislikeTop5List,
    publishTop5List,
    viewTop5List,
    commentTop5List,
    getCommunityLists,
    likeCommunityList,
    dislikeCommunityList,
    viewCommunityList,
    commentCommunityList
}