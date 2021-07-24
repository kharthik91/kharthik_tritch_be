const express = require("express");
const router = express.Router();
const bucketlistController = require("../controllers/bucketlist_controller");
const { authenticated } = require("../middlewares/user_auth");

// ROUTES //

router.post(
  "/:userID/add/:itinerariesID",
  authenticated,
  bucketlistController.addToBucketlist
);

router.patch(
  "/:userID/update/:itinerariesID",
  authenticated,
  bucketlistController.beenThere
);

router.delete(
  "/:userID/remove/:itinerariesID",
  authenticated,
  bucketlistController.delete
);

router.get("/:userID/itineraries/all", bucketlistController.show);

module.exports = router;
