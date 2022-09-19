const express = require("express");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const router = express.Router();

const postsCtrl = require("../controllers/posts");

router.get("/", auth, postsCtrl.getAllPosts);
router.post("/", auth, multer, postsCtrl.createPost);
router.put("/:id", auth, multer, postsCtrl.modifyPost);
router.delete("/:id", auth, postsCtrl.deletePost);
router.post("/:id/like", auth, postsCtrl.likePost);

module.exports = router;
