const express = require('express')
const router = express.Router()
const attractionsController = require('../controllers/attractions_controller')


// get attractions by location
router.get('/:location/:latlong', attractionsController.search)

// router.get('/photo/:photoref', placesController.photo)


module.exports = router
