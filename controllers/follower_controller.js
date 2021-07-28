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

    FollowModel.find({ following: req.params.user })
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
    
    if(req.body.following === req.params.user){
      res.statusCode = 400;
      return res.json("You cannot follow yourself");
    }

    let flw = null;
    if (req.body.follwing)
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

    console.log(req.params.user, req.body);
    try {
      flw = await FollowModel.find({
        user: req.params.user,
        following: req.body.following,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }
    if (!flw) {
      res.statusCode = 404;
      return res.json();
    }

    console.log(flw);
    try {
      await FollowModel.deleteOne({ _id: flw[0]._id });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      return res.json(err);
    }

    return res.json();
  },
};
