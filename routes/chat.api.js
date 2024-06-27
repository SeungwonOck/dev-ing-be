const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authController = require("../controllers/auth.controller");

router.post("/", chatController.createChatRoom);
router.get("/", authController.authenticate, chatController.getChatRoomList);

module.exports = router;
