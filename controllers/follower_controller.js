const express = require("express");
const mongoose = require("mongoose");
const { FollowModel } = require("../models/follow_model");
const { followValidator } = require("../validations/follow_validation");
const router = express.Router();

module.exports = {
  //show comments under user
  show: (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
      res.statusCode = 400;
      console.log();
      return res.json();
    }

    FollowModel.find({ user: req.params.user })
      .populate("user")
      .then((response) => {
        if (!response) {
          res.statusCode = 404;
          return res.json();
        }

        return res.json(response);
      })
      .catch((err) => {
        console.log(err);
        res.statusCode = 500;
        return res.json(err);
      });
  },

  // follow someone
  create: async (req, res) => {
    //validation
    const followValidatorResult = followValidator.validate(req.body);
    if (followValidatorResult.error) {
      res.statusCode = 400;
      return res.json(followValidatorResult.error);
    }

    let flw = null;
    try {
      flw = await FollowModel.create({
        following: req.body.following,
        user: req.params.user,
      });
    } catch (err) {
      console.log(err);
      return res.json();
    }
    console.log(req.body);
    res.statusCode = 200;
    return res.json();
  },

  // remove follower
  delete: async (req, res) => {
    let flw = null;

    // check if comment exists
    try {
      flw = await FollowModel.findOne({ _id: req.params.id });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }
    if (!flw) {
      res.statusCode = 404;
      return res.json();
    }

    try {
      await FollowModel.deleteOne({ _id: req.params.id });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      return res.json(err);
    }

    return res.json();
  },
};
