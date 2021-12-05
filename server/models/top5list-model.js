const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },

        //TODO: Each item has a String name and a Number of points (for community lists)
        items: { type: [String], required: true },
        owner: { type: String },
        isPublished:  { type: Boolean },
        datePublished: { type: Number },
        comments: [{ user: String, content: String }],
        userLikes: [{ user: String, liked: Boolean }],
        views: {type: Number}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
