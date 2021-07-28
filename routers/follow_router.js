const express = require("express");
const router = express.Router();
const followerController = require("../controllers/follower_controller");
const { authenticated } = require("../middlewares/user_auth");

//get followings users
router.get("/:user", authenticated, followerController.show);

//create route
router.post("/:user/follow", authenticated, followerController.create);

//delete
router.post("/:user/unfollow", authenticated, followerController.delete);

module.exports = router;
