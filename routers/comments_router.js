const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments_controller");
const { authenticated } = require("../middlewares/user_auth");

//shows iternay comment
router.get(
  "/itinerary/:id",
  authenticated,
  commentsController.showitinerarycomments
);

//show route for comments
router.get("/:user", authenticated, commentsController.showusercomments);

//create route
router.post(
  "/:user/itinerary/:id/new",
  authenticated,
  commentsController.create
);

//update
router.put("/:id", authenticated, commentsController.update);

//delete
router.delete("/:id", authenticated, commentsController.delete);

module.exports = router;
