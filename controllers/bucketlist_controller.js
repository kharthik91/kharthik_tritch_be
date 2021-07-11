const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { BucketlistModel } = require("../models/bucketlist_model");
const {
  bucketlistValidator,
} = require("../validations/bucketlist_validations");

module.exports = {
  addBucketlist: async (req, res) => {
    // validate user inputs
    const validationResult = bucketlistValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error);
    }
    // make sure that user making request is authorised
    if (!req.headers.auth_token) {
      res.statusCode = 403;
      return res.json(`Not authorised`);
    }
    // make sure that itinerary is not already on bucketlist
    let bucketlistItem = null;

    try {
      bucketlistItem = await BucketlistModel.find({ _id: req.params._id });
    } catch (err) {
      res.statusCode = 500;
      return res.json(500);
    }
  },
};
