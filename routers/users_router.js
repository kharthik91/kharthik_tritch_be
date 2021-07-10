const express = require("express");
const router = express.Router();
const userController = require("../controllers/users_controller");

// ROUTES //

router.post("/register", userController.register);

router.post("/login", userController.login);

module.exports = router;
