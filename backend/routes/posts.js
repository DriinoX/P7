const express = require("express");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const router = express.Router();

const postsCtrl = require("../controllers/posts");
// POST ROUTES
router.get("/", auth, postsCtrl.getAllPosts);
router.get("/:id", auth, postsCtrl.getPost);
router.post("/", auth, multer, postsCtrl.createPost);
router.put("/:id", auth, multer, postsCtrl.modifyPost);
router.delete("/:id", auth, postsCtrl.deletePost);
router.post("/:id", auth, postsCtrl.likePost);

module.exports = router;
