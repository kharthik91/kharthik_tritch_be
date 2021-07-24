const express = require("express");
const router = express.Router();
const commentsController = require('../controllers/comments_controller');

//shows iternay comment
router.get('/itnerary/:itineraries', commentsController.showitinerarycomments);

//show route for comments
router.get('/:user', commentsController.showusercomments);

//create route 
router.post('/:user/itinerary/:itineraries/new', commentsController.create);

//update
router.put('/:id', commentsController.update);

//delete
router.delete('/:id', commentsController.delete);


module.exports = router; 