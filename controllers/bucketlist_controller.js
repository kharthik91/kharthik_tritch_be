const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { BucketlistModel } = require("../models/bucketlist_model");
const {
  bucketlistValidator,
} = require("../validations/bucketlist_validations");

module.exports = {
  addToBucketlist: async (req, res) => {
    // need to validate the incoming information
    // need to have a user_id, itinerary_id
    // default value of the user not having been there
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
      bucketlistItem = await BucketlistModel.find({
        _id: req.params.bucketlistid,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(500);
    }

    if (bucketlistItem) {
      res.statusCode = 500;
      return res.json();
    }

    res.statusCode = 204;
    return res.json();
  },

  been_there: async (req, res) => {
    // allows user to update their bucketlist, 'tick' things off their bucketlist
    // validate that user has auth
    if (!req.headers.auth_token) {
      res.statusCode = 403;
      return res.json(`Not authorised`);
    }

    let updateResponse = null;

    try {
      updateResponse = await BucketlistModel.findOneAndUpdate({});
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!updateResponse) {
      res.statusCode = 400;
      return res.json();
    }

    res.statusCode = 204;
    return res.json({
      success: true,
      message: `One step closer to travelling the world!`,
    });
  },

  delete: (req, res) => {
    if (!req.headers.auth_token) {
      res.statusCode = 403;
      return res.json(`Not authorised`);
    }
  },
};
