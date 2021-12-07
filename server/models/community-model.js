const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunityListSchema = new Schema(
    {
        name: { type: String, required: true },

        //Each item has a String name and a Number of points (for community lists)
        items: [{ item: String, points: Number}],
        comments: [{ user: String, content: String }],
        userLikes: [{ user: String, liked: Boolean }],
        views: {type: Number},
        numLists: Number
    },
    { timestamps: true },
)

module.exports = mongoose.model('CommunityList', CommunityListSchema)
