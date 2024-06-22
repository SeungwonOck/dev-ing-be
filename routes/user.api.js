const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

router.post("/", userController.createUser);
router.get("/", authController.authenticate, userController.getUser);
router.post("/report", userController.reportUser);
router.post("/block", authController.checkAdminPermission, userController.blockUser)
router.get("/all", userController.getAllUser);
router.get("/:id", userController.getUserInfo);

module.exports = router;
