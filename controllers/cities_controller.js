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
            return res.json(cityData);
            
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
          let cleanData =  {
            slug: cityData.data.attributes.slug,
            destinationType: cityData.data.attributes.destination_type,
            name: cityData.data.attributes.short_name,
            longName: cityData.data.attributes.long_name,
            population: cityData.data.attributes.population,
            latlong: `${cityData.data.attributes.latitude},${cityData.data.attributes.longitude}`,
            lat: cityData.data.attributes.latitude,
            long: cityData.data.attributes.longitude,
            budget: cityData.data.attributes.budget[cityData.data.attributes.name],
            safety: cityData.data.attributes.safety[cityData.data.attributes.name],
            rating: cityData.data.attributes.average_rating,
            knownFor: cityData.included.filter(x => x.type === 'known_for'),
            image:cityData.included.find(x => x.type === 'photo').attributes.image.large
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
       
        let cleanData = await Promise.all(cities.data.data.map(item => ({"slug": item.attributes.slug,
        "name": item.attributes.name, "destination_type": item.attributes.destination_type
    })))
        res.json({
          status: 200,
          data: cleanData,
        })
        
  },
}