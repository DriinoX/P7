const Post = require("../models/Post");
const fs = require("fs");

exports.createPost = async (req, res) => {
  const { userId, message, username } = req.body;
  const imageURL = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : "";
  await Post.create({
    userId: userId,
    username: username,
    message: message,
    image: imageURL,
  })
    .then(() => {
      res.status(201).json({ message: "Nouveau Post créé !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Get all posts
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ updatedAt: "desc" }).exec();
  res.status(200).json(posts);
};

//Get one post
// exports.getPost = async (req, res) => {
//   const post = await Post.findOne({
//     _id: req.params.id,
//   });
//   res.status(200).json(post);
// };

//Update post
exports.modifyPost = async (req, res) => {
  const { message } = req.body;
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : "";
  // Check if File in request
  const postObject = {
    message,
    image: imageUrl,
  };

  delete req.body.user_id;
  //If object in request exists
  if (req.file !== undefined) {
    //Get the post
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        //Delete image from images folder
        const filename = post.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //Update Database with new image
          Post.updateOne(
            { _id: req.params.id },
            { ...postObject, _id: req.params.id }
          )
            .then(() => res.status(200).json("Post mis à jour !"))
            .catch((error) => res.status(401).json({ error }));
        });
      })
      .catch((error) => res.status(404).json({ error }));
  } else {
    //If no File in request
    Post.updateOne({ _id: req.params.id }, { message: message })
      .then(() => res.status(200).json("Post mis à jour !"))
      .catch((error) => res.status(401).json({ error }));
  }
};

//Delete post
exports.deletePost = async (req, res) => {
  //Get the post
  await Post.findOne({ _id: req.params.id })
    .then((post) => {
      //If post contains image
      if (post.image) {
        const filename = post.image.split("/images/")[1];
        //Delete image from folder
        fs.unlink(`images/${filename}`, () => {
          post.deleteOne({ _id: req.params.id });
        });
        res.status(200).json({ message: "Post deleted !" });
      } else {
        post.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Post deleted !" });
      }
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
};


exports.likePost = async (req, res) => {
  //Get the post with params
  const post = await Post.findById(req.params.id);
  if (req.auth.userId !== post.userId) {
    //Check if user allready like the post, if not, insert userId in likes array
    //else pull-it from likes array
    if (!post.likes.includes(req.auth.userId)) {
      await post.updateOne({ $push: { likes: req.auth.userId } });
      res.status(200).json("Like enregistré !");
    } else {
      await post.updateOne({ $pull: { likes: req.auth.userId } });
      res.status(200).json("Like retiré !");
    }
  } else {
    res.status(401).json("Vous ne pouvez pas liker vos posts !");
  }
};