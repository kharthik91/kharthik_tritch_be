const express = require("express");
const router = express.Router();
const followerController = require('../controllers/follower_controller');

//get followings users
router.get('/:user', followerController.show);

//create route 
router.post('/:user/follow', followerController.create);

//delete
router.delete('/:id/unfollow', followerController.delete);


module.exports = router; 

