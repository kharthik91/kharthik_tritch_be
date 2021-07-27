const express = require('express')
const router = express.Router()
const itinerariesController = require('../controllers/itineraries_controller')


// list all itineraries
router.get('/', itinerariesController.listAll)

// list itineraries by owner
router.get('/:userid', itinerariesController.listOwner)

// create
router.post('/',itinerariesController.createItinerary)

// retrieve itinerary
router.get('/view/:id', itinerariesController.getItinerary)

// update
router.patch('/:id', itinerariesController.updateItinerary)

// // delete
router.delete('/:id', itinerariesController.deleteItinerary)



module.exports = router
