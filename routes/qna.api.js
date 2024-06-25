const express = require("express");
const router = express.Router();
const qnaController = require("../controllers/qna.controller");
const authController = require("../controllers/auth.controller");

router.get('/all', qnaController.getAllQnA)
router.post("/", authController.authenticate, qnaController.createQnA);
router.post("/answer", authController.authenticate, qnaController.createAnswer);
router.put("/:qnaId/answer/:answerId", authController.authenticate, qnaController.updateAnswer);
router.delete("/:qnaId/answer/:answerId", authController.authenticate, qnaController.deleteAnswer);
router.post("/:qnaId/answer/:answerId/like", authController.authenticate, qnaController.likesAnswer)
router.get("/:id", qnaController.getQnA);
router.put("/:id", qnaController.updateQnA);
router.delete("/:id", qnaController.deleteQnA);

module.exports = router;
