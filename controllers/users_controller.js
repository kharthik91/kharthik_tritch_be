const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const { UserModel } = require("../models/users_model");
const {
  registerValidator,
  loginValidator,
} = require("../validations/users_validations");

module.exports = {
  register: async (req, res) => {
    // validate user form input
    const validationResult = registerValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error);
    }

    const validatedParams = validationResult.value;

    // ensure pw and confirmPw is the same
    if (validatedParams.password !== validatedParams.confirmPassword) {
      res.statusCode = 400;
      return res.json(`Fat fingers alert!!`);
    }

    // ensure that user does not already exist
    let user = null;

    try {
      user = await UserModel.findOne({
        email: validatedParams.email,
      });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (user) {
      res.statusCode = 409;
      return res.json();
    }

    // convert password to a hash value
    let hash = "";

    try {
      hash = await bcrypt.hash(validatedParams.password, 10);
    } catch (err) {
      res.statusCode = 500;
      return res.json();
    }

    if (hash === "") {
      res.statusCode = 500;
      return res.json();
    }

    // create user
    try {
      user = await UserModel.create({
        firstName: validatedParams.firstName,
        lastName: validatedParams.lastName,
        email: validatedParams.email,
        hash: hash,
      });

      res.statusCode = 201;
      return res.json(user._id);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      return res.json(err);
    }
  },

  login: async (req, res) => {
    // validate user input
    const validationResult = loginValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error);
    }

    const validatedParams = validationResult.value;

    // ensure that user exists
    let user = null;
    try {
      user = await UserModel.findOne({ email: validatedParams.email });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!user) {
      res.statusCode = 400;
      return res.json({
        success: false,
        message: `Email or password is incorrect!`,
      });
    }

    // decrypt password and ensure that it matches
    let passwordValidated = false;

    try {
      passwordValidated = await bcrypt.compare(
        validatedParams.password,
        user.hash
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!passwordValidated) {
      res.statusCode = 400;
      res.json({
        success: false,
        message: `Email or password is incorrect!`,
      });
    }

    // create a token with an expiry date
    let tokenExpiry = moment().add(1, "hour").toString();
    console.log(tokenExpiry);

    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3 days",
      }
    );

    res.json({
      token: token,
      expiresAt: tokenExpiry,
    });
  },

  edit: (req, res) => {
    // validate user input
  },
};
