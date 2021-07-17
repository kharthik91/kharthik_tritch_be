const User = require("../models/users_model");
const mongoose = require("mongoose"); 
const { FollowModel } = require('../models/follow_model')
const {followValidator} = require('../validations/follow_validation');


module.exports= {

//create user
create: async (req, res) => {

  //validation
  const followValidatorResult = followValidator.validate(req.body);
  if (followValidatorResult.error) {
      res.statusCode = 400;
      return res.json(followValidatorResult.error);
  }


  let user = null
  try {
   user = await FollowModel.create({
    userId: req.body.userId,
    email: req.body.email,
    followers: req.body.followers,
    followings: req.body.followings,
  }); 
  } catch (err) {
      console.log(err);
      return res.json()
  }
  console.log(req.body)
  res.statusCode = 200
  return res.json()
},


//get a user
show: (req, res) => {
  FollowModel.findById(req.params.id)
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

//follow a user

follow: async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await FollowModel.findById(req.params.id);
      const currentUser = await FollowModel.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
},

//unfollow a user

unfollow: async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await FollowModel.findById(req.params.id);
        const currentUser = await FollowModel.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  },
}

