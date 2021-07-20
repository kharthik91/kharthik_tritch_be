const express = require("express");
const router = express.Router();
const bucketlistController = require("../controllers/bucketlist_controller");

// ROUTES //

app.post(
  "/:userID/bucketlist/:itinerayID/add",
  bucketlistController.addToBucketlist
);

app.patch("/:userID/bucketlist/:itineraryID", bucketlistController.beenThere);

app.post(
  "/:userID/bucketlist/:itineraryID/delete",
  bucketlistController.delete
);

module.exports = router;
