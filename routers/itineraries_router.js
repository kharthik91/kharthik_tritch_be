const express = require('express')
const router = express.Router()
const itinerariesController = require('../controllers/itineraries_controller')


// list all itineraries
router.get('/', itinerariesController.listAll)

// list itineraries by owner
router.get('/:userid', itinerariesController.listOwner)

// create
router.post('/',itinerariesController.create)

// // edit
// router.get('/:slug/edit', itineraryController.editForm)

// // update
// router.patch('/:slug', itineraryController.update)

// // delete
// router.delete('/:slug', itineraryController.delete)



module.exports = router
