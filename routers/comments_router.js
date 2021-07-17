const express = require("express");
const router = express.Router();
const commentsController = require('../controllers/comments_controller');

//shows iternay comment
router.get('/itnerary/:itnerary_id', commentsController.index);

//show route for comments
router.get('/:user_id', commentsController.show);

//create route 
router.post('/:user_id/itinerary/:itinerary_id/new', commentsController.create);

//update
router.put('/:id', commentsController.update);

//delete
router.delete('/:id', commentsController.delete);


module.exports = router; 