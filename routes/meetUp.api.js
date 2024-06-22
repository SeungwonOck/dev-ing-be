const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const meetUpController = require("../controllers/meetUpController");

router.get("/all", meetUpController.getAllMeetUp);
router.post("/", authController.authenticate, meetUpController.createMeetUp);
router.get("/:id", meetUpController.getMeetUp);
router.put("/:id", meetUpController.updateMeetUp);

module.exports = router;
