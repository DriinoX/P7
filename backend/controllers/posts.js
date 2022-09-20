const Post = require("../models/Post");
const fs = require("fs");

exports.createPost = (req, res, next) => {
  	const postObject = JSON.parse(req.body.post);
    const post = new Post({
        ...postObject,
        // création de l'url de l'image avec le nom du fichier
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    post.save()
    .then(() => { res.status(201).json({message: 'Post enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};
exports.getAllPosts = (req, res, next) => {
  
};
exports.modifyPost = (req, res, next) => {
  
};
exports.deletePost = (req, res, next) => {
  
};
exports.likePost = (req, res, next) => {
  
};