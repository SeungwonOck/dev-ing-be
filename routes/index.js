const express = require("express");
const router = express.Router();

const userApi = require("./user.api");
const authApi = require("./auth.api");
const postApi = require("./post.api");
const meetUpApi = require("./meetUp.api");

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/post", postApi);
router.use("/meetup", meetUpApi);

module.exports = router;
