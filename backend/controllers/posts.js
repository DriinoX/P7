const Post = require("../models/Post");
const fs = require("fs");

// CREATION D'UN POST
exports.createPost = async (req, res) => {
  const { userId, message, username } = req.body;
  // création d'une url si il y a une image dans la requete
  const imageURL = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : "";
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

// RECUPERATION DE TOUT LES POSTS
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts.reverse());
};

// RECUPERATION D'UN POST
exports.getPost = async (req, res) => {
  const post = await Post.findOne({_id: req.params.id});
  res.status(200).json(post);
};

// MODIFICATION D'UN POST
exports.modifyPost = async (req, res) => {
  const { message } = req.body;
  // création d'une url si il y a une image dans la requete
  const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : "";
  const postObject = {
    message,
    image: imageUrl,
  };
  delete req.body.user_id;
  // vérification de la présence d'une image dans la requete
  if (req.file !== undefined) {
    // Si OUI, il y a une image
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        // Suppression de l'image
        const filename = post.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Mise à jour du post avec le message et l'image (postObject)
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
    // Si NON, il n'y a pas d'image
    Post.updateOne({ _id: req.params.id }, { message: message })
      .then(() => res.status(200).json("Post mis à jour !"))
      .catch((error) => res.status(401).json({ error }));
  }
};

// SUPPRESSION D'UN POST
exports.deletePost = async (req, res) => {
  // Recuperation d'un post
  await Post.findOne({ _id: req.params.id })
    .then((post) => {
      // Si il y a une image
      if (post.image) {
        // Suppression de l'image
        const filename = post.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          post.deleteOne({ _id: req.params.id });
        });
        res.status(200).json({ message: "Post supprimé !" });
      } else {
        post.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Post supprimé !" });
      }
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
};

// LIKE D'UN POST
exports.likePost = async (req, res) => {
  // Recuperation d'un post
  const post = await Post.findById(req.params.id);
  // Vérification si l'utilisateur a deja like le post
  if (post.likes.includes(req.auth.userId)) {
    // Si OUI, like retiré
    await post.updateOne({ $pull: { likes: req.auth.userId } });
    res.status(200).json("Like retiré !");
  } else {
    // Si NON, like ajouté
    await post.updateOne({ $push: { likes: req.auth.userId } });
    res.status(200).json("Like enregistré !");
  }
};




