const express = require('express')
const router = express.Router()
const placesController = require('../controllers/places_controller')


// get attractions by location
router.get('/:location/:latlong', placesController.search)

router.get('/photo/:photoref', placesController.photo)

module.exports = router
