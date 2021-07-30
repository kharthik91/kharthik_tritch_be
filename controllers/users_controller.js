const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { UserModel } = require("../models/users_model");
const {
  schemaValidator,
  loginValidator,
  updateSchemaValidator,
  changePasswordValidator,
} = require("../validations/users_validations");

module.exports = {
  register: async (req, res) => {
    // validate user form input
    const validationResult = schemaValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error.details[0].message);
    }

    const validatedParams = validationResult.value;

    // ensure pw and confirmPw is the same
    if (validatedParams.password !== validatedParams.confirmPassword) {
      res.statusCode = 400;
      return res.json(`Passwords should match`);
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
      return res.json(`email already exists`);
    }

    // convert password to a hash value
    let hash = "";

    try {
      hash = await bcrypt.hash(validatedParams.password, 10);
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (hash === "") {
      res.statusCode = 500;
      return res.json(`server error`);
    }

    // create user
    try {
      user = await UserModel.create({
        firstName: validatedParams.firstName,
        lastName: validatedParams.lastName,
        email: validatedParams.email,
        hash: hash,
      });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      return res.json(err);
    }

    if (!user) {
      res.statusCode = 500;
      return res.json(`User not found`);
    }

    res.statusCode = 201;
    return res.json(user.email);
  },

  login: async (req, res) => {
    // validate user input
    const validationResult = loginValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error.details[0].message);
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
      return res.json(`Email or password is incorrect!`);
    }

    // ensure user input pw matches saved pw
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
      return res.json(`Email or password is incorrect!`);
    }

    // create accessToken & refreshToken for added security
    const accessToken = jwt.sign(
      { email: user.email, userID: user._id },
      process.env.JWT_SECRET
    );

    const refreshToken = jwt.sign(
      { email: user.email, userID: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    return res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  },

  updateParticulars: async (req, res) => {
    // validate user input - limited to firstname, lastname, email
    const validationResult = updateSchemaValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      return res.json(validationResult.error.details[0].message);
    }

    let validatedParams = validationResult.value;

    let currentUser = null;

    try {
      currentUser = await UserModel.findOne({ _id: req.params.userID });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!currentUser) {
      res.statusCode = 400;
      return res.json(`User not found`);
    }

    let updatedUser = null;

    let updateParams = {
      firstName: validatedParams.firstName,
      lastName: validatedParams.lastName,
    };

    if (validatedParams.email !== currentUser.email) {
      updateParams.email = validatedParams.email;
    }

    try {
      updatedUser = await UserModel.findOneAndUpdate(
        {
          _id: req.params.userID,
        },
        updateParams,
        { new: true }
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!updatedUser) {
      res.statusCode = 500;
      return res.json(`error updating user's particulars`);
    }

    // use the updated particulars to sign a new jwt token
    let updatedAccessToken = jwt.sign(
      { email: updatedUser.email, userID: updatedUser._id },
      process.env.JWT_SECRET
    );

    let updatedRefreshToken = jwt.sign(
      { email: updatedUser.email, userID: updatedUser._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    res.statusCode = 200;
    return res.json({
      accessToken: updatedAccessToken,
      refreshToken: updatedRefreshToken,
    });
  },

  changePassword: async (req, res) => {
    // validate that user exists
    let user = null;

    try {
      user = await UserModel.findOne({ email: req.params.userID });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!user) {
      res.statusCode = 400;
      return res.json(`User not found`);
    }

    // validate user input to change pw
    const validationResult = changePasswordValidator.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.json(validationResult.error.details[0].message);
    }

    const validatedPasswords = validationResult.value;

    // check that both passwords are the same
    if (validatedPasswords.password !== validatedPasswords.confirmPassword) {
      res.statusCode = 400;
      return res.json(`Passwords should match`);
    }

    // encrypt password to hash
    let newHash = "";

    try {
      newHash = await bcrypt.hash(validatedPasswords.password, 10);
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!newHash) {
      res.statusCode = 500;
      return res.json("Server Error");
    }

    // save new hash in db
    let changePasswordResponse = null;

    try {
      changePasswordResponse = await UserModel.findOneAndUpdate(
        {
          email: req.params.email,
        },
        {
          hash: newHash,
        },
        { new: true }
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    let newToken,
      newRefreshToken = null;

    try {
      newToken = await jwt.sign(user.email, process.env.JWT_SECRET);

      newRefreshToken = await jwt.sign(
        user.email,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!newToken || !newRefreshToken) {
      res.statusCode = 500;
      return res.json(`Error providing authorisation`);
    }

    return res.json({
      accessToken: newToken,
      refreshToken: newRefreshToken,
    });
  },

  logout: (req, res) => {
    //  clear token from client side
    res.clearCookie("auth_token");
    res.statusCode = 204;
    return res.json();
  },

  showAll: async (req, res) => {
    // show all users so that people can see who they can follow

    let findUsers = null;

    try {
      findUsers = await UserModel.find();
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!findUsers) {
      res.statusCode = 500;
      return res.json(`Unable to find users`);
    }

    res.statusCode = 200;
    return res.json(findUsers);
  },

  showOne: async (req, res) => {
    // allow users to aaccess more details about one other user
    // this should allow us to display the user details, bucketlists, itineraries, who user follows, who follows them
    // validate the request of the user email - ensure that user is valid

    // ensuring that user exists
    let verifiedUser = null;
    console.log(req.params)
    try {
      verifiedUser = await UserModel.findOne({ _id: req.params.userID });
    } catch (err) {
      res.statusCode = 500;
      return res.json(err);
    }

    if (!verifiedUser) {
      res.statusCode = 404;
      return res.json(`unable to find user`);
    }

    res.statusCode = 200;
    return res.json(verifiedUser);
  },
};
