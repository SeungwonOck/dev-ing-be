const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

router.get("/all", authController.authenticate, postController.getAllPost);
router.post('/comment', authController.authenticate, postController.createComment)
router.post("/like", authController.authenticate, postController.incrementLikesAndAddUser)
router.post("/", authController.authenticate, postController.createPost);
router.post('/scrap', authController.authenticate, postController.addScrap)
router.put('/:postId/comment/:commentId', authController.authenticate, postController.updateComment)
router.delete('/:postId/comment/:commentId', authController.authenticate, postController.deleteComment)
router.get("/:id", postController.getPost);
router.delete("/:id", postController.deletePost);
router.put("/:id", postController.updatePost);


module.exports = router;
