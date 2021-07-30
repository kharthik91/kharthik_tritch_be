const express = require("express");
const mongoose = require("mongoose");
const { FollowModel } = require("../models/follow_model");
const { followValidator } = require("../validations/follow_validation");
const router = express.Router();

module.exports = {
  //show comments under user
  show: async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
      res.statusCode = 400;
      
      return res.json();
    }
    
    let followers
    let following
    let followersData
    let followingData
    try{
      followersData = await FollowModel.find({ following: req.params.user })
      .populate("user")
    }
    catch(err) {
      res.statusCode = 404;
          return res.json();
    }
      
   try{
     followingData = await FollowModel.find({ user: req.params.user })
     .populate("user")
   }
   catch (err) {
    res.statusCode = 404;
    return res.json();
   }
      
      if(followingData){
        following = followingData
      }
      if(followersData){
        followers = followersData
      }
      
      console.log({
        followers: followers,
        following: following
      })
      return res.json({
        followers: followers,
        following: following
      })
    
  },

  // follow someone
  create: async (req, res) => {
    //validation
    // const followValidatorResult = followValidator.validate(req.params);
    // if (followValidatorResult.error) {
    //   res.statusCode = 400;
    //   return res.json(followValidatorResult.error);
    // }
    
    if(req.body.following === req.params.user){
      
      res.statusCode = 400;
      return res.json("You cannot follow yourself");
    }
    try {
      await FollowModel.create({
        following: req.body.following,
        user: req.params.user,
      });
    } catch (err) {
      console.log(err);
      return res.json();
    }
    console.log("i did it");
    res.statusCode = 200;
    return res.json();
  },

  // remove follower
  delete: async (req, res) => {
    let flw = null;

    // check if comment exists

    console.log(req.params.user, req.body);
    try {
      await FollowModel.findOneAndDelete({
        user: req.params.user,
        following: req.body.following,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    return res.json("deleted");
  },
};
