const mongoose = require('mongoose')
const {citiesValidator} = require('../validations/cities_validations')
const {searchCity, autoComplete, checkCity, createCityData} = require ('../services/cities_services')
module.exports = {


    search: async (req, res) => {

          
        // const validationResult = citiesValidator.validate(req.params.slug)
        // if (validationResult.error) {
        //     res.statusCode = 400
        //     return res.json(validationResult.err)
        // }

        // Check if city data exist in DB first
        
        let cityData = await checkCity(req.params.slug)
        
        if (cityData) {
          return res.json({
            status: 200,
            data: cityData,
          })
            
        } else {
          try {
            cityData = await searchCity(req.params.slug)
            
          } catch (err) {
            return res.status(500).json({
              data: err.message
            })
          }


      
          // Write data to DB for future access
          
          try {
                await createCityData(cityData.data)
                
              
          }
          catch(err) {
              console.log(err)
              return
          }
          console.log(cityData)
          let cleanData =  {
            slug: cityData.data.data.attributes.slug,
            destinationType: cityData.data.data.attributes.destination_type,
            name: cityData.data.data.attributes.short_name,
            longName: cityData.data.data.attributes.long_name,
            population: cityData.data.data.attributes.population,
            latlong: `${cityData.data.data.attributes.latitude},${cityData.data.data.attributes.longitude}`,
            lat: cityData.data.data.attributes.latitude,
            long: cityData.data.data.attributes.longitude,
            budget: cityData.data.data.attributes.budget[cityData.data.data.attributes.name],
            safety: cityData.data.data.attributes.safety[cityData.data.data.attributes.name],
            rating: cityData.data.data.attributes.average_rating,
            knownFor: cityData.data.included.filter(x => x.type === 'known_for'),
            image:cityData.data.included.find(x => x.id === cityData.data.included[0].relationships.featured_photo.data.id).attributes.image.large
          }
          console.log('written to db')
          return res.json({
            status: 200,
            data: cleanData,
          })

        }   
          
    },

    autoComplete: async (req, res) => {
      let cities
      
      try {
          cities = await autoComplete(req.params.query)
          
        } catch (err) {
          res.status(500).json({
            data: err.message
          })
        }
        
        let cleanData = await Promise.all(cities.data.data.map(item => {
          let destinationType
          if(item.attributes.destination_type === "City"){
            destinationType = 'Cities'
          } else if (item.attributes.destination_type === "Country") {
            destinationType = 'Countries'
          }
          return ({
            "slug": item.attributes.slug,
            "name": item.attributes.name, 
            "destination_type": destinationType
          })
        }))
        
        res.json({
          status: 200,
          data: cleanData,
        })
        
  },
}