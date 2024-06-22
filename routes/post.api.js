const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");

router.get("/all", postController.getAllPost);
router.get("/:id", postController.getPost);
router.post("/", authController.authenticate, postController.createPost);
router.delete("/:id", postController.deletePost);
router.put("/:id", postController.updatePost);
router.post("/like", authController.authenticate, postController.incrementLikesAndAddUser)

router.post('/comment', authController.authenticate, postController.createComment)

module.exports = router;
