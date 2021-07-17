const express = require("express");
const router = express.Router();
const followerController = require('../controllers/follower_controller');



//create user
router.post('/register', followerController.create);

//get a user
router.get('/:id', followerController.show);

//follow a user
router.put('/:id/follow', followerController.follow);

//unfollow a user
router.put('/:id/unfollow', followerController.unfollow);

module.exports = router; 