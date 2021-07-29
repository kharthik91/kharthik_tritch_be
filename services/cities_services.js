

const axios = require('axios'); 
const {CitiesModel} = require('../models/attractions_model')

module.exports = {

    searchCity: async(slug) => {
        let cityData = await axios({
            method: 'GET',
            url: `http://api.roadgoat.com:80/api/v2/destinations/${slug}`,
            headers: {
                Authorization:`Basic ${process.env.RG_ENCODED_KEY}`
            }
            
        })

        if(!cityData) {
            throw new Error(`Could not find City data for ${slug}`)
        }
        return cityData
    }
 

}