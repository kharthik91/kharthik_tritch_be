const express = require("express");
const router = express.Router();
const bucketlistController = require("../controllers/bucketlist_controller");
const { authenticated, unauthenticated } = require("../middlewares/user_auth");

// ROUTES //

app.post(
  "/:userID/bucketlist/:itinerayID/add",
  authenticated,
  bucketlistController.addToBucketlist
);

app.patch(
  "/:userID/bucketlist/:itineraryID",
  authenticated,
  bucketlistController.beenThere
);

app.post(
  "/:userID/bucketlist/:itineraryID/delete",
  authenticated,
  bucketlistController.delete
);

module.exports = router;
