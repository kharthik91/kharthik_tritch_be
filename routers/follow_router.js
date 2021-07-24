const express = require("express");
const router = express.Router();
const followerController = require('../controllers/follower_controller');

//get a user
//router.get('/:user/check', followerController.show);


router.post('/:user', followerController.create);



module.exports = router; 

