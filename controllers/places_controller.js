const _ = require('lodash')
const mongoose = require('mongoose')

const {placeSearch, placePhoto} = require ('../services/places_services')
module.exports = {

    search: async (req, res) => {
        let attractions = await placeSearch(res, req.params.location)
        return res.json(attractions);
    },

    photo: async (req, res) => {
        console.log("getting photo")
        let photo = await placePhoto(res, req.params.photoref)
        return res.json(photo);
    },
}