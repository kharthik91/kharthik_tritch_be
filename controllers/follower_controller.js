const express = require("express");
const mongoose = require("mongoose");
const { FollowModel } = require("../models/follow_model");
const router = express.Router();

module.exports = {
//create user
//usercreate: async (req, res) => 

  // //get a user
  // show: (req, res) => {
  //   FollowModel.find({ user: req.params.user })
  //     .populate("user")
  //     .then((response) => {
  //       if (!response) {
  //         res.statusCode = 404;
  //         return res.json();
  //       }

  //       return res.json(response);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.statusCode = 500;
  //       return res.json(err);
  //     });
//   },

  // create follower
  create: async (req, res) => {
    let flw = null;
    let flw2 = null;
    try {
      flw = await FollowModel.create({
        user: req.params.user,
      });

      flw2 = await FollowModel.create({
        user: req.body.userId,
      });

      let user = await FollowModel.find({user: req.params.user});
      let currentUser = await FollowModel.find({user: req.body.userId});
      
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.user } });
        res.status(200).json("user has been followed");
     
    } catch (err) {
      console.log(err);
      return res.json();
    }
    console.log(req.body);
    res.statusCode = 200;
    return res.json();
  },
}









//follow a user

// follow: async (req, res) => {
//   if (req.body.userId !== req.params.user) {
//     try {
//       const user = await FollowModel.findById(req.params.user);
//       const currentUser = await FollowModel.findById(req.body.userId);
//       if (!user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $push: { followers: req.body.userId } });
//         await currentUser.updateOne({ $push: { followings: req.params.user } });
//         res.status(200).json("user has been followed");
//       } else {
//         res.status(403).json("you already follow this user");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json("you cant follow yourself");
//   }
// },

// //unfollow a user

// unfollow: async (req, res) => {
//     if (req.body.userId !== req.params.id) {
//       try {
//         const user = await FollowModel.findById(req.params.id);
//         const currentUser = await FollowModel.findById(req.body.userId);
//         if (user.followers.includes(req.body.userId)) {
//           await user.updateOne({ $pull: { followers: req.body.userId } });
//           await currentUser.updateOne({ $pull: { followings: req.params.id } });
//           res.status(200).json("user has been unfollowed");
//         } else {
//           res.status(403).json("you dont follow this user");
//         }
//       } catch (err) {
//         res.status(500).json(err);
//       }
//     } else {
//       res.status(403).json("you cant unfollow yourself");
//     }
//   },
// }
