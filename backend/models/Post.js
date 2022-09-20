const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    username: {type: String, required: true},
    message: {type: String, max: 500},
    image: {type: String,default: null},
    likes: {type: Array, default: []},
});

module.exports = mongoose.model("Post", PostSchema);