const express = require("express");
const router = express.Router();
const bucketlistController = require("../controllers/bucketlist_controller");

// ROUTES //

app.post("/addToBucketlist", bucketlistController.addToBucketlist);

module.exports = router;
