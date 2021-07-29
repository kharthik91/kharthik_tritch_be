const express = require("express");
const router = express.Router();
const bucketlistController = require("../controllers/bucketlist_controller");
const { authenticated } = require("../middlewares/user_auth");

// ROUTES //

router.post("/add", authenticated, bucketlistController.addToBucketlist);

router.patch("/update", authenticated, bucketlistController.beenThere);

router.delete("/remove", authenticated, bucketlistController.delete);

router.get("/:userID/view", bucketlistController.show);

module.exports = router;
