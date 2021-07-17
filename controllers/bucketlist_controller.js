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
      return res.json(validationResult.error.details[0].message);
    }

    // make sure that itinerary is not already on bucketlist
    let bucketlistItem = null;

    try {
      bucketlistItem = await BucketlistModel.find({
        _id: req.params.bucketlistid,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (bucketlistItem) {
      res.statusCode = 500;
      return res.json(`itineray already on bucketlist`);
    }

    res.statusCode = 204;
    return res.json();
  },

  beenThere: async (req, res) => {
    // allows user to update their bucketlist, 'tick' things off their bucketlist

    const validationResult = bucketlistValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error.details[0].message);
    }

    const validatedParams = validationResult.value;

    // check for value of been_there
    let beenThereToggler = false;
    console.log(beenThereToggler);

    if (!validatedParams.been_there) {
      beenThereToggler = true;
    }

    let updateResponse = null;

    try {
      updateResponse = await BucketlistModel.findOneAndUpdate(
        {
          itinerary_id: validatedParams.itinerary_id,
        },
        {
          been_there: beenThereToggler,
        }
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!updateResponse) {
      res.statusCode = 400;
      return res.json(`Error occurred while updating`);
    }

    res.statusCode = 204;
    return res.json();
  },

  delete: (req, res) => {
    // remove itinerary from bucketlist

    const validationResult = bucketlistValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error.details[0].message);
    }

    const validatedParams = validationResult.value;

    let removeResponse = null;

    try {
      removeResponse = await BucketlistModel.deleteOne({
        user_id: validatedParams.user_id,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!removeResponse) {
      res.statusCode = 500;
      return res.json(`Error encountered when deleting`);
    }
  },

  show: (req, res) => {
    // allow users to view the bucketlist of a particular user
  },
};
