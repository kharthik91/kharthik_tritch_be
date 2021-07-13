const express = require("express");
const router = express.Router();
const userController = require("../controllers/users_controller");

// ROUTES //

router.post("/register", userController.register);

router.post("/login", userController.login);

router.patch("/:userID", userController.updateParticulars);

router.patch("/change-password/:userID", userController.changePassword);

router.get("/logout", userController.logout);

module.exports = router;
