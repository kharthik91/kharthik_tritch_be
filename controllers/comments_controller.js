const express = require("express");
const mongoose = require("mongoose");
const { CommentsModel } = require("../models/comments_model");
const router = express.Router();
const { commentsValidator } = require("../validations/comments_validation");

module.exports = {
  //show comments under itineray
  showitinerarycomments: (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.itineraries)) {
      res.statusCode = 400;
      return res.json();
    }

    CommentsModel.find({ itineraries: req.params.itineraries })
      .populate("itineraries")
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
  //show comments under user
  showusercomments: (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
      res.statusCode = 400;
      console.log();
      return res.json();
    }

    CommentsModel.find({ user: req.params.user })
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

  // create comment
  create: async (req, res) => {
    //validation
    // const commentsValidatorResult = commentsValidator.validate(req.body);
    // if (commentsValidatorResult.error) {
    //   res.statusCode = 400;
    //   return res.json(commentsValidatorResult.error);
    // }

    let cmt = null;
    try {
      cmt = await CommentsModel.create({
        comments: req.body.comments,
        user: req.params.user,
        itineraries: req.params.itineraries,
      });
    } catch (err) {
      console.log(err);
      return res.json();
    }
    console.log(req.body);
    res.statusCode = 200;
    return res.json();
  },

  // update comment
  update: async (req, res) => {
    //validation
    // const commentsValidatorResult = commentsValidator.validate(req.body);
    // if (commentsValidatorResult.error) {
    //   res.statusCode = 400;
    //   return res.json(commentsValidatorResult.error);
    // }
    const validatedParams = req.body

    let cmt = null;

    try {
      cmt = await CommentsModel.findOne({ _id: req.params.id });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }
    if (!cmt) {
      res.statusCode = 404;
      return res.json();
    }
    try {
      await cmt.updateOne(validatedParams);
    } catch (err) {
      res.statusCode = 500;
      return res.json();
    }
    return res.json();
  },

  // Delete comment
  delete: async (req, res) => {
    let cmt = null;

    // check if comment exists
    try {
      cmt = await CommentsModel.findOne({ _id: req.params.id });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }
    if (!cmt) {
      res.statusCode = 404;
      return res.json();
    }

    try {
      await CommentsModel.deleteOne({ _id: req.params.id });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      return res.json(err);
    }

    return res.json();
  },
};
