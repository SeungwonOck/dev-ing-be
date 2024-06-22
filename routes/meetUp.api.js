const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const meetUpController = require("../controllers/meetUpController");

router.get("/all", meetUpController.getAllMeetUp);
router.post("/", authController.authenticate, meetUpController.createMeetUp);
router.post("/join", authController.authenticate, meetUpController.joinMeetUp);
router.get("/:id", meetUpController.getMeetUp);
router.put("/:id", meetUpController.updateMeetUp);
router.delete("/:id", meetUpController.deleteMeetUp);

module.exports = router;
