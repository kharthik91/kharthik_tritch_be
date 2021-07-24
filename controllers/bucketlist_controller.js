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

    const validatedParams = validationResult.value;

    // make sure that itinerary is not already on bucketlist
    let bucketlistItem = null;

    try {
      bucketlistItem = await BucketlistModel.findOne({
        email: validatedParams.email,
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
        email: validatedParams.email,
        itineraries: req.params.itinerariesID,
        user: req.params.userID,
        been_there: validatedParams.been_there,
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
    return res.json(addBucketlistResponse);
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
    return res.json(updateResponse);
  },

  delete: async (req, res) => {
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

  show: async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
      res.statusCode = 400;
      return res.json();
    }

    await BucketlistModel.findOne({
      user: req.params.userID,
    })
      .populate("itineraries")
      .populate("user")
      .then((response) => {
        return res.json(response);
      })
      .catch((err) => {
        res.statusCode = 500;
        return res.json(err);
      });
  },
};
