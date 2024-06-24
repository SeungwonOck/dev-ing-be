const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

router.get("/all", authController.authenticate, postController.getAllPost);
router.post('/comment', authController.authenticate, postController.createComment)
router.post("/like", authController.authenticate, postController.incrementLikesAndAddUser)
router.post("/", authController.authenticate, postController.createPost);

router.get("/:id", postController.getPost);
router.delete("/:id", postController.deletePost);
router.put("/:id", postController.updatePost);

router.post('/scrap', authController.authenticate, postController.addScrap)


module.exports = router;
