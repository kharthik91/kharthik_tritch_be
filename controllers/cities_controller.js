const mongoose = require('mongoose')
const {attractionsValidator} = require('../validations/cities_validations')
const {searchCity} = require ('../services/cities_services')
module.exports = {


    search: async (req, res) => {
        let cityData
        try {
            cityData = await searchCity(req.params.slug)
            res.json({
              status: 200,
              data: cityData.data,
            })
          } catch (err) {
            res.status(500).json({
              data: err.message
            })
          }
          
    },
}