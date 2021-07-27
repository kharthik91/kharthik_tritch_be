const express = require('express')
const router = express.Router()
const citiesController = require('../controllers/cities_controller')


// get city information
router.get('/:slug', citiesController.search)

// get city slug by autocomplete
// router.get('/:slug/:latlong', citiesController.autoComplete)


module.exports = router
