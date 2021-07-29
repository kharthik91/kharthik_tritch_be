

const axios = require('axios'); 
const {CitiesModel} = require('../models/cities_model')

module.exports = {
 
    checkCity: async(slug) => {
       
        let cityData = await CitiesModel.findOne({slug: slug})
        if(!cityData) {
            return
            
        }
        return cityData
    },
    createCityData: async(cityData) => {
        try {CitiesModel.create({
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
            image:cityData.included.find(x => x.id === cityData.data.relationships.photos.data[0].id).attributes.image.large
            })
            
            return `Location data created`
        } catch (err) {
            
            return err
        }
    },

    searchCity: async(slug) => {
        let cityData = await axios({
            method: 'GET',
            url: `http://api.roadgoat.com:80/api/v2/destinations/${slug}`,
            headers: {
                Authorization:`Basic ${process.env.RG_ENCODED_KEY}`
            }
            
        })

        if(!cityData) {
            // throw new Error(`Could not find City data for ${slug}`)
        }
        return cityData
    },

    autoComplete: async(query) => {
        let cities = await axios({
            method: 'GET',
            url: `https://api.roadgoat.com/api/v2/destinations/auto_complete?q=${query}`,
            headers: {
                Authorization:`Basic ${process.env.RG_ENCODED_KEY}`
            }
            
        })

        if(!cities) {
            // throw new Error(`Could not find City data for ${slug}`)
        }
        return cities
    },

 

}