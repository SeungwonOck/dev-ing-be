const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authController = require("../controllers/auth.controller");

router.get("/all", postController.getAllPost);
router.post('/comment', authController.authenticate, postController.createComment)
router.post("/like", authController.authenticate, postController.incrementLikesAndAddUser)
router.get("/my", authController.authenticate, postController.getMyPost)
router.post("/", authController.authenticate, postController.createPost);


router.get("/:id", postController.getPost);
router.delete("/:id", postController.deletePost);
router.put("/:id", postController.updatePost);



module.exports = router;
