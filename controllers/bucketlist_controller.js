const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { BucketlistModel } = require("../models/bucketlist_model");

const {
  bucketlistValidator,
  deleteBucketlistValidator,
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

    const validatedParams = validationResult.value;
    console.log(validatedParams);

    // make sure that itinerary is not already on bucketlist
    let bucketlistItem = null;

    try {
      bucketlistItem = await BucketlistModel.findOne({
        user: validatedParams.userID,
        itineraries: validatedParams.itinerariesID,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (bucketlistItem) {
      res.statusCode = 500;
      return res.json(`itinerary already on bucketlist`);
    }

    let addBucketlistResponse = null;

    try {
      addBucketlistResponse = await BucketlistModel.create({
        been_there: validatedParams.been_there,
        user: validatedParams.userID,
        itineraries: validatedParams.itinerariesID,
      });
    } catch (err) {
      res.statusCode = 500;
      console.log(err);
      return res.json(err);
    }

    if (!addBucketlistResponse) {
      res.statusCode = 500;
      return res.json(`Error adding item to bucketlist!`);
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

    let updateResponse = null;

    try {
      updateResponse = await BucketlistModel.findOneAndUpdate(
        {
          user: validatedParams.userID,
          itineraries: validatedParams.itinerariesID,
        },
        {
          been_there: validatedParams.been_there,
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
    return res.json(updateResponse);
  },

  delete: async (req, res) => {
    // remove itinerary from bucketlist

    const validationResult = deleteBucketlistValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error.details[0].message);
    }

    const validatedParams = validationResult.value;

    let removeResponse = null;

    try {
      removeResponse = await BucketlistModel.deleteOne({
        user: validatedParams.userID,
        itineraries: validatedParams.itinerariesID,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!removeResponse) {
      res.statusCode = 500;
      return res.json(`Error encountered when deleting`);
    }

    return res.json();
  },

  show: async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
      res.statusCode = 400;
      return res.json(`error!`);
    }

    await BucketlistModel.find({
      user: req.params.userID,
    })
      .populate("itineraries")
      .populate("user")
      .then((response) => {
        if (!response) {
          res.statusCode = 500;
          return res.json(`Oops! Server error`);
        }
        res.statusCode = 200;
        console.log(response)
        return res.json(response);
      })
      .catch((err) => {
        res.statusCode = 500;
        return res.json(err);
      });
  },
};
