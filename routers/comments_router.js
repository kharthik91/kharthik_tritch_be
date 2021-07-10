const express = require("express");
const router = express.Router();
const commentsController = require('../controllers/comments_controller');


//route to get comments by itnerary
router.get('/:itnerary_id', commentsController.index);

//create route 
router.post('/new', commentsController.create);

//update
router.put('/:id', commentsController.update);

//delete
router.delete('/:id', commentsController.delete);


module.exports = router; 