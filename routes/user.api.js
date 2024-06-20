const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require('../controllers/auth.controller');

router.post("/", userController.createUser);
router.get('/', authController.authenticate, userController.getUser)
router.get('/all', userController.getAllUser)
router.put('/', authController.authenticate, userController.updateUser)

module.exports = router;