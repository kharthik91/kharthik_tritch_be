const express = require('express')
const router = express.Router()
const itinerariesController = require('../controllers/itineraries_controller')


// index
router.get('/', itinerariesController.listAll)

// show
// router.get('/:slug', itineraryController.show)

// // create
// router.post('/',itineraryController.create)

// // edit
// router.get('/:slug/edit', itineraryController.editForm)

// // update
// router.patch('/:slug', itineraryController.update)

// // delete
// router.delete('/:slug', itineraryController.delete)



module.exports = router
