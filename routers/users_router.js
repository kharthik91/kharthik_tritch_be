const express = require("express");
const router = express.Router();
const userController = require("../controllers/users_controller");
const { authenticated, unauthenticated } = require("../middlewares/user_auth");

// ROUTES //

router.post("/register", unauthenticated, userController.register);

router.post("/login", unauthenticated, userController.login);

router.patch("/:userID", authenticated, userController.updateParticulars);

router.patch(
  "/change-password/:userID",
  authenticated,
  userController.changePassword
);

router.get("/logout", authenticated, userController.logout);

router.get("/display-users/all", authenticated, userController.showAll);

router.get("/display-users/:userID", authenticated, userController.showOne);

module.exports = router;
